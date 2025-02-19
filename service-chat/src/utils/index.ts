import { Logger } from "tslog";
import { customAlphabet } from "nanoid";
import { redisClient } from "../db/redis.js";

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

  return bypass || process.exit(1);
};

const getMessageId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);

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

function redisChecker(redis: any) {
  let interval: NodeJS.Timeout;

  const pingPong = async () => {
    try {
      await redis.client.ping();
      console.log("Redis Online");
    } catch (err) {
      logger.error("REDIS", err);
      clearInterval(interval);
    }
  };

  interval = setInterval(pingPong, 60_000);
}

export { logger, catcher, getMessageId, errorEvents, redisChecker };
