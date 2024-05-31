import { customAlphabet } from "nanoid";

const getSlotId = customAlphabet("0123456789ABCDEFGHIKLMNOPQRSTUVWXYZ", 15);

export { getSlotId };
