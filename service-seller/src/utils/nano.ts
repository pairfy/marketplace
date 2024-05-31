import { customAlphabet } from "nanoid";

const getSellerId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 20);

export { getSellerId};
