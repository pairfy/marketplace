import { customAlphabet } from "nanoid";
import { Logger } from "tslog";

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

const checkDatabase = async (database: any) => {
  let interval: any = null;

  let connection: any = null;

  const ping = async () => {
    try {
      connection = await database.client.getConnection();

      await connection.ping();

      console.log("Database Online");
    } catch (error) {
      logger.error("Database Error", error);

      if (connection) {
        await connection.rollback();
      }

      clearInterval(interval);

    } finally {
      if (connection) {
        connection.release();
      }
    }
  };

  interval = setInterval(ping, 30_000);
};

export { logger, catcher, generateId, checkDatabase };
