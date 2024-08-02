import { customAlphabet } from "nanoid";

const getSlotId = customAlphabet("0123456789ABCDEF", 15);

export { getSlotId };
