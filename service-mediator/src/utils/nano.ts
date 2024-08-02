import { customAlphabet } from "nanoid";

const getMediatorId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 16);

export { getMediatorId};
