import { redisClient } from "../db/redis.js";
import { axiosAPI } from "../api/index.js";
import { logger } from "../utils/index.js";

type BinanceResponse = { mins: number; price: string; closeTime: number };

async function getAssetPrice(job: any) {
  try {
    let symbol = job.data.symbol;

    let response: any = await axiosAPI.get(`/api/v3/avgPrice?symbol=${symbol}`);

    if (response.status === 200) {
      let payload: BinanceResponse = response.data;

      let assetPrice = Number(parseFloat(payload.price).toFixed(2));

      let key = "price:" + symbol;

      let result = await redisClient.client.set(key, assetPrice, {
        XX: true,
        EX: 120,
      });

      if (result !== "OK") {
        await redisClient.client.set(key, assetPrice, {
          EX: 120,
        });
      }
    } else {
      throw new Error("BINANCE_API");
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export { getAssetPrice };
