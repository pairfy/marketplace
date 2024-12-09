import { catcher, logger } from "./utils/index.js";
import { Queue, Worker } from "bullmq";
import { redisClient } from "./db/redis.js";
import { getAssetPrice } from "./handlers/assets.js";

const main = async () => {
  try {
    if (!process.env.POD_TIMEOUT) {
      throw new Error("POD_TIMEOUT error");
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("REDIS_HOST error");
    }

    const errorEvents: string[] = [
      "exit",
      "SIGINT",
      "SIGTERM",
      "SIGQUIT",
      "uncaughtException",
      "unhandledRejection",
      "SIGHUP",
      "SIGCONT",
    ];

   /////////////////////////////////////////

    await redisClient
      .connect({
        url: process.env.REDIS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("redisClient connected"))
      .catch((err: any) => catcher(err));

    const checkRedis = setInterval(async () => {
      try {
        await redisClient.client.ping();
        console.log("Redis Online");
      } catch (err) {
        console.error("REDIS_CONNECTION", err);
      }
    }, 10_000);
    
    /////////////////////////////////////////

    const watchAssetPriceQueue = new Queue("getAssetPrice", {
      connection: { url: process.env.REDIS_HOST },
    });

    /////////////////////////////////////////////////////

    await watchAssetPriceQueue.add(
      "ADAUSDT",
      {
        symbol: "ADAUSDT",
      },
      {
        repeat: {
          every: 30000,
        },
        attempts: 99999,
        backoff: {
          type: "fixed",
          delay: 1000,
        },
        removeOnComplete: false,
        removeOnFail: false,
        jobId: "ADAUSDT",
      }
    );

    logger.info("getAssetPrice added.");

    const watchAssetPrice = new Worker("getAssetPrice", getAssetPrice, {
      removeOnComplete: false,
      removeOnFail: false,
      autorun: true,
      drainDelay: 1000,
      connection: { url: process.env.REDIS_HOST },
    } as any);

    ////////////////////////////////////////////////////////

    watchAssetPrice.on("failed", (job: any, err) => {
      logger.info("FAILED", job.id);
      logger.error(err);
    });

    watchAssetPrice.on("completed", (job: any, result) => {
      logger.info("COMPLETED", job.id, result);
    });

    watchAssetPrice.on("error", (err) => {
      logger.error(err);
    });

    watchAssetPrice.on("stalled", (job: any) => {
      logger.info("STALLED", job.id);
    });

    watchAssetPrice.on("drained", () => {
      logger.info("DRAINED");
    });

    errorEvents.forEach((e: string) =>
      process.on(e, async (err) => {
        logger.error(err);
        await watchAssetPrice.close();
        await redisClient.client.disconnect();
        clearInterval(checkRedis);
        process.exit(1);
      })
    );

    logger.info("ONLINE");
  } catch (err) {
    catcher(err);
  }
};

main();
