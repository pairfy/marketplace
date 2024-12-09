import { Logger } from "tslog";
import { customAlphabet } from "nanoid";

const logger = new Logger({
    name: "service-product",
    prettyLogTemplate: "{{logLevelName}} {{dateIsoStr}} {{fileNameWithLine}}",
    type: "pretty"
});

const catcher = (message?: any, error?: any, bypass?: boolean) => {
    logger.error(`EXIT=>${message}-${error}`);

    return bypass || process.exit(1);
};

const getProductId = () => {
    const nanoId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 16);

    const result = nanoId();

    return "P" + result

};

const getEventId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 21);


export { logger, catcher, getProductId, getEventId }