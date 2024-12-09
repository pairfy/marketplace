/*
+---------+-------------------------------------------------+
| Version |                   Description                   |
+---------+-------------------------------------------------+
|   1.0.0 | Deduplication, failsafe                         |
+---------+-------------------------------------------------+
*/

import {
  DiscardPolicy,
  jetstreamManager,
  RetentionPolicy,
  StorageType,
} from "@nats-io/jetstream";
import { catcher, logger } from "./utils/index.js";
import { database } from "./db/client.js";
import { connect } from "@nats-io/transport-node";

const main = async () => {
  try {
    if (!process.env.POD_NAME) {
      throw new Error("POD_NAME error");
    }

    if (!process.env.POD_TIMEOUT) {
      throw new Error("POD_TIMEOUT error");
    }

    if (!process.env.DATABASE_USER) {
      throw new Error("DATABASE_USER error");
    }

    if (!process.env.DATABASE_PASSWORD) {
      throw new Error("DATABASE_PASSWORD error");
    }

    if (!process.env.DATABASE_NAME) {
      throw new Error("DATABASE_NAME error");
    }

    if (!process.env.STREAM_NAME) {
      throw new Error("STREAM_NAME error");
    }

    if (!process.env.STREAM_SUBJECT) {
      throw new Error("STREAM_SUBJECT error");
    }

    if (!process.env.QUERY_INTERVAL) {
      throw new Error("QUERY_INTERVAL error");
    }

    if (!process.env.QUERY_LIMIT) {
      throw new Error("QUERY_LIMIT error");
    }

    const errorEvents: string[] = [
      "exit",
      "SIGINT",
      "SIGTERM",
      "SIGQUIT",
      "uncaughtException",
      "unhandledRejection",
      "SIGHUP",
      "SIGCONT"
    ];

    errorEvents.forEach((e: string) => process.on(e, (err) => catcher(err)));

    database.connect({
      host: "mysql",
      port: 3306,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 150,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 5000,
      connectTimeout: 30000,
      timezone: "Z",
      supportBigNumbers: true,
      bigNumberStrings: true,
    });

    async function healthCheck() {
      let connection = null;
      try {
        console.time("DB_PING");
        connection = await database.client.getConnection();
        await connection.ping();
        console.timeEnd("DB_PING");
      } catch (error) {
        logger.error("DB_PING_ERROR", error);

        if (connection) {
          connection.rollback();
        }
      } finally {
        if (connection) {
          connection.release();
        }
      }
    }

    setInterval(healthCheck, 30000);     

    const natsClient = await connect({
      name: process.env.POD_NAME,
      servers: ["nats:4222"],
      reconnect: true,
      pingInterval: 20 * 1000,
      maxPingOut: 5,
      reconnectTimeWait: 10 * 1000,
    });

    const jetStreamManager = await jetstreamManager(natsClient, {
      checkAPI: false,
    });

    //await jetStreamManager.streams.delete(process.env.STREAM_NAME);

    await jetStreamManager.streams.add({
      name: process.env.STREAM_NAME,
      subjects: [process.env.STREAM_SUBJECT],
      retention: RetentionPolicy.Limits,
      storage: StorageType.File,
      max_age: 0,
      max_msgs: -1,
      max_bytes: -1,
      discard: DiscardPolicy.Old,
      max_consumers: -1,
      num_replicas: 3,
    });

    const getInfo = await jetStreamManager.streams.info(
      process.env.STREAM_NAME
    );

    console.log(getInfo);

    const jetStream = jetStreamManager.jetstream();

    const queryLimit = parseInt(process.env.QUERY_LIMIT);

    let connection: any = null;

    const runWorker = async () => {
      try {
        connection = await database.client.getConnection();

        const [findEvents] = await connection.query(
          `
          SELECT * FROM events
          WHERE published = ?
          ORDER BY created_at ASC
          LIMIT ? 
          FOR UPDATE SKIP LOCKED`,
          [false, queryLimit]
        );

        if (!findEvents.length) {
          return;
        }

        for (const event of findEvents) {
          try {
            await connection.beginTransaction();

            const [updateEvent] = await connection.execute(
              "UPDATE events SET published = ? WHERE id = ?",
              [true, event.id]
            );

            if (updateEvent.affectedRows !== 1) {
              throw new Error("UPDATE_EVENT_ERROR");
            }

            const payload = JSON.stringify(event);

            const result = await jetStream.publish(
              `${process.env.STREAM_NAME}.${event.event_type}`,
              payload,
              { msgID: event.id }
            );

            if (!result.seq) {
              throw new Error("PUBLISH_ERROR");
            }

            await connection.commit();
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err: any) {
        logger.error(err);

        if (connection) {
          await connection.rollback();
        }
      } finally {
        if (connection) {
          connection.release();
        }
      }
    };

    setInterval(runWorker, parseInt(process.env.QUERY_INTERVAL));  ///change to while

    logger.info("ONLINE");
  } catch (err) {
    catcher(err);
  }
};

main();
