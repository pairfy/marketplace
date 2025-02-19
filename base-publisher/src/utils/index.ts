import { Logger } from "tslog";
import { customAlphabet } from "nanoid";

const logger = new Logger({ name: "POD", 
    prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
    type: "pretty"
 });

const catcher = (message?: any, error?: any, bypass?: boolean) => {
    logger.error(`EXIT=>${message}-${error}`);

    return bypass || process.exit(1);
};

const generateId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 15);

const sleep = (timeInMs: number) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));
  

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

export { logger, catcher, generateId, sleep, errorEvents }