import { customAlphabet } from "nanoid";

const getOrderId = customAlphabet("0123456789", 20);

export { getOrderId };
