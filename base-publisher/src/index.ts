import {
  DiscardPolicy,
  jetstreamManager,
  RetentionPolicy,
  StorageType,
} from "@nats-io/jetstream";
import { catcher, errorEvents, logger, sleep } from "./utils/index.js";
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

    const queryLimit = parseInt(process.env.QUERY_LIMIT);

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
        connection = await database.client.getConnection();

        await connection.ping();

        console.log("Database Online");
      } catch (err) {
        logger.error("Database Error", err);

        if (connection) {
          await connection.rollback();
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

    await jetStreamManager.streams.info(process.env.STREAM_NAME);

    const jetStream = jetStreamManager.jetstream();

    logger.info("ONLINE");

    let connection: any = null;

    while (true) {
      await sleep(parseInt(process.env.QUERY_INTERVAL));
      
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

        const queryLength = findEvents.length;

        console.log(queryLength);

        if (queryLength < 1) continue;
        
        for (const event of findEvents) {
          try {
            ///////////////////////////////////////////////////////////////////
            await connection.beginTransaction();

            const [updateEvent] = await connection.execute(
              "UPDATE events SET published = ? WHERE id = ?",
              [true, event.id]
            );

            if (updateEvent.affectedRows !== 1) {
              throw new Error("UPDATE_EVENT");
            }

            const payload = JSON.stringify(event);

            const subject = process.env.STREAM_NAME + "." + event.type;

            const published = await jetStream.publish(subject, payload, {
              msgID: event.id,
            });

            if (!published.seq) {
              throw new Error("PUBLISHING");
            }

            await connection.commit();
            ///////////////////////////////////////////////////////////////////
          } catch (err) {
            console.log(err);

            continue;
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
    }
  } catch (err) {
    catcher(err);
  }
};

main();
