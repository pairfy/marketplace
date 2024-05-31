import { customAlphabet } from "nanoid";

const getProductId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 15);

export { getProductId };
