import { redisClient } from "../../database/redis.js";

const getAssetPrice = async () => {
  try {
    const getPrice = await redisClient.client.get("price:ADAUSDT");

    if (!getPrice) {
      throw new Error("NO_PRICE");
    }

    return parseFloat(getPrice);
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export { getAssetPrice };
