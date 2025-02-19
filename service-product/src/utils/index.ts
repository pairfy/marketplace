import { Logger } from "tslog";
import { customAlphabet } from "nanoid";

const logger = new Logger({
  name: "service-product",
  prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
  type: "pretty",
});

const catcher = (message?: any, error?: any, bypass?: boolean) => {
  logger.error(`EXIT=>${message}-${error}`);

  return bypass || process.exit(1);
};

const getProductId = () => {
  const nanoId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 16);

  const result = nanoId();

  return "P" + result;
};

const getEventId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 21);

function getCurrentTimestamp() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

function toTimestamp(input: string | Date) {
  if (input instanceof Date) {
    input = input.toISOString();
  }

  if (typeof input === "string") {
    return input.replace("T", " ").slice(0, 19);
  }

  throw new Error("Invalid input: expected a string or Date object");
}

function formatProduct(PRODUCT: any): any {
  PRODUCT.moderated = PRODUCT.moderated === 1;

  PRODUCT.paused = PRODUCT.paused === 1;

  PRODUCT.discount = PRODUCT.discount === 1;

  PRODUCT.updated_at = toTimestamp(PRODUCT.updated_at);

  PRODUCT.created_at = toTimestamp(PRODUCT.created_at);

  return PRODUCT;
}

export {
  logger,
  catcher,
  getProductId,
  getEventId,
  getCurrentTimestamp,
  toTimestamp,
  formatProduct,
};
