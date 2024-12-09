import { Logger } from "tslog";
import { customAlphabet } from "nanoid";

const logger = new Logger({
  name: "POD",
  prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
  type: "pretty",
});

const catcher = (message?: any, error?: any, bypass?: boolean) => {
  logger.error(`EXIT=>${message}-${error}`);

  return bypass || process.exit(1);
};

const sleep = (timeInMs: number) =>
  new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

const getEventId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 21);

export { logger, catcher, getEventId, sleep };
