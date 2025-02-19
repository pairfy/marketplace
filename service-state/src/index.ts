import {
  catchError,
  errorEvents,
  logger,
  redisChecker,
  sleep,
} from "./utils/index.js";
import { Job, Queue, Worker } from "bullmq";
import { scanThreadToken } from "./handlers/index.js";
import { redisClient } from "./database/redis.js";
import { database } from "./database/client.js";

const main = async () => {
  try {
    if (!process.env.POD_TIMEOUT) {
      throw new Error("POD_TIMEOUT error");
    }

    if (!process.env.DATABASE_HOST) {
      throw new Error("DATABASE_HOST error");
    }

    if (!process.env.DATABASE_PORT) {
      throw new Error("DATABASE_PORT error");
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

    if (!process.env.REDIS_HOST) {
      throw new Error("REDIS_HOST error");
    }

    if (!process.env.QUERY_LIMIT) {
      throw new Error("QUERY_LIMIT error");
    }

    if (!process.env.QUERY_INTERVAL) {
      throw new Error("QUERY_INTERVAL error");
    }

    if (!process.env.SCAN_RANGE) {
      throw new Error("SCAN_RANGE error");
    }

    if (!process.env.PROJECT_ID) {
      throw new Error("PROJECT_ID error");
    }

    if (!process.env.KUPO_KEY) {
      throw new Error("KUPO_KEY error");
    }

    if (!process.env.OGMIOS_KEY) {
      throw new Error("OGMIOS_KEY error");
    }

    if (!process.env.ELASTIC_NODE) {
      throw new Error("ELASTIC_NODE error");
    }

    if (!process.env.ELASTIC_KEY) {
      throw new Error("ELASTIC_KEY error");
    }

    await redisClient
      .connect({
        url: process.env.REDIS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => redisChecker(redisClient))
      .catch((err: any) => catchError(err));

    //////////////////////////////////////////

    database.connect({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
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

    /////////////////////////////////////////

    const mainQueue = new Queue("scanThreadToken", {
      connection: { url: process.env.REDIS_HOST },
    });

    const worker = new Worker("scanThreadToken", scanThreadToken, {
      autorun: true,
      drainDelay: 10,
      settings: {
        backoffStrategy: () => -1,
      },
      connection: { url: process.env.REDIS_HOST },
    });

    worker.on("failed", (job: any, err) => logger.error("FAILED", job.id, err));

    worker.on("completed", async (job: Job, result) => {
      console.log("COMPLETED", job.id);
      const { threadtoken, finished } = result;

      if (finished) {
        await mainQueue.removeJobScheduler(threadtoken);
        console.log("Expired");
      }
    });

    worker.on("error", (err) => {
      logger.error(err);
    });

    worker.on("stalled", (job: any) => {
      logger.error("STALLED", job.id);
    });

    worker.on("drained", () => {
      logger.error("DRAINED");
    });

    errorEvents.forEach((e: string) =>
      process.on(e, async (err) => {
        logger.error(err);
        await worker.close();
        await database.client.end();
        await redisClient.client.disconnect();
        process.exit(1);
      })
    );

    //////////////////////////////////////////////////////////////////////////////////////////////////

    let connection: any = null;

    while (true) {
      console.log("Scanning");

      try {
        connection = await database.client.getConnection();

        const queryScheme = `
          SELECT id,
                 finished,
                 scanned_at,
                 country,
                 seller_id,
                 buyer_pubkeyhash,
                 buyer_address,
                 seller_address,
                 watch_until
          FROM orders
          WHERE finished = ? AND scanned_at < ?
          ORDER BY created_at ASC
          LIMIT ? 
          FOR UPDATE SKIP LOCKED`;

        const scanRange =
          Date.now() - parseInt(process.env.SCAN_RANGE) * 60 * 1000;

        const [findOrders] = await connection.query(queryScheme, [
          false,
          scanRange,
          parseInt(process.env.QUERY_LIMIT),
        ]);

        if (!findOrders.length) {
          console.log("EmptyOrder");
        }

        for (const order of findOrders) {
          try {
            const createWork = await mainQueue.upsertJobScheduler(
              order.id,
              {
                every: 60000,
                jobId: order.id,
              },
              {
                name: order.id,
                data: {
                  threadtoken: order.id,
                  watch_until: order.watch_until,
                  seller_id: order.seller_id,
                  buyer_pubkeyhash: order.buyer_pubkeyhash,
                  buyer_address: order.buyer_address,
                  seller_address: order.seller_address,
                  country: order.country,
                },
                opts: {
                  attempts: 0,
                  backoff: {
                    type: "fixed",
                    delay: 60000,
                  },
                  removeOnComplete: false,
                  removeOnFail: false,
                },
              }
            );

            if (!createWork.name) {
              throw new Error("CreateWorkError");
            }

            console.log("WorkAdded", createWork.name);
          } catch (err) {
            logger.error(err);
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

      await sleep(parseInt(process.env.QUERY_INTERVAL));
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

  } catch (err) {
    catchError(err);
  }
};

main();
