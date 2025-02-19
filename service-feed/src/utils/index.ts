import { Logger } from "tslog";
import { customAlphabet } from "nanoid";

const logger = new Logger({
  name: "POD",
  prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
  type: "pretty",
});

const handleError = (message?: any, error?: any, bypass?: boolean) => {
  logger.error(`EXIT=>${message}-${error}`);

  return bypass || process.exit(1);
};

const sleep = (timeInMs: number) =>
  new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

const getEventId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 21);

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

const redisChecker = (redisClient: any) => {
  let interval: NodeJS.Timeout;

  if (redisClient) {
    const checker = async () => {
      try {
        await redisClient.client.ping();
        console.log("RedisOnline");
      } catch (err) {
        logger.error("RedisError", err);
        clearInterval(interval);
      }
    };

    interval = setInterval(checker, 30_000);
  }
};

export { logger, handleError, getEventId, sleep, errorEvents, redisChecker };
