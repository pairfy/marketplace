import { customAlphabet } from "nanoid";
import { redisClient } from "../database/redis.js";
import { database } from "../database/client.js";
import { Logger } from "tslog";

const logger = new Logger({
  name: "POD",
  prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
  type: "pretty",
});

const catcher = async (message?: any, error?: any, bypass?: boolean) => {
  logger.error(`[EXIT]:${message}-${error}`);

  if (redisClient.ready) {
    await redisClient.client.disconnect();
  }

  if (database.ready) {
    await database.client.end();
  }

  return bypass || process.exit(1);
};

const checkRedis = (redisClient: any) => {
  let interval: any;

  const ping = async () => {
    try {
      await redisClient.client.ping();
      console.log("Redis Online");
    } catch (err) {
      console.error("checkRedisError", err);
      clearInterval(interval);
    }
  };

  interval = setInterval(ping, 10_000);
};

const getProductId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 15);

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

export { logger, catcher, getProductId, errorEvents, checkRedis };
