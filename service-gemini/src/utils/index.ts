import { Logger } from "tslog";
import { customAlphabet } from "nanoid";

const logger = new Logger({
  name: "POD",
  prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
  type: "pretty",
});

const catcher = async (message?: any, error?: any, bypass?: boolean) => {
  logger.error(`EXIT=>${message}-${error}`);

  process.exit(0);

  return bypass;
};

const generateId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 15);

export { logger, catcher, generateId };
