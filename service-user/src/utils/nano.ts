import { customAlphabet } from "nanoid";

const getUserId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 20);

export { getUserId};
