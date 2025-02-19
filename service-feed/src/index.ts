import { redisClient } from "./database/redis.js";
import { searchIndex } from "./elastic/index.js";
import {
  handleError,
  errorEvents,
  logger,
  redisChecker,
  sleep,
} from "./utils/index.js";

const main = async () => {
  try {
    if (!process.env.POD_TIMEOUT) {
      throw new Error("POD_TIMEOUT error");
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("REDIS_HOST error");
    }

    if (!process.env.ELASTIC_NODE) {
      throw new Error("ELASTIC_NODE error");
    }

    if (!process.env.ELASTIC_KEY) {
      throw new Error("ELASTIC_KEY error");
    }

    if (!process.env.INTERVAL_MS) {
      throw new Error("INTERVAL_MS error");
    }

    if (!process.env.BEST_SELLER) {
      throw new Error("BEST_SELLER error");
    }

    await redisClient
      .connect({
        url: process.env.REDIS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => redisChecker(redisClient))
      .catch((err: any) => handleError(err));

    errorEvents.forEach((e: string) =>
      process.on(e, async (err) => {
        logger.error(err);
        await redisClient.client.disconnect();
        process.exit(1);
      })
    );

    ///////////////////////////////////////////////////////////

    logger.info("ONLINE");

    const categoryList: string[] = [
      "Best Sellers",
      "Electronics & Digital Content",
      "Clothing & Fashion",
      "Health & Beauty",
      "Books, Music & Movies",
      "Home & Garden",
      "Toys, Hobbies & Collectibles",
      "Sports & Outdoors & Entertainment",
      "Grocery & Gourmet Food",
      "Automotive & Industrial",
      "Office Supplies & Equipment",
      "Pet Supplies",
      "Lights & Lighting",
      "Mother & Kids",
      "Shoes",
      "Art & NFT's"
    ];

    const categories: Record<string, any[]> = categoryList.reduce(
      (acc, category) => {
        acc[category] = [];
        return acc;
      },
      {} as Record<string, any[]>
    );

    while (true) {
      const bestKey = `feed:Best Sellers`;

      await redisClient.client.del(bestKey);

      for (const category of categoryList) {
        const search = await searchIndex(category, 18);

        const categoryKey = `feed:${category}`;

        await redisClient.client.del(categoryKey);

        if (search.length) {
          await redisClient.client.rPush(bestKey, JSON.stringify(search[0]));

          for (const item of search) {
            await redisClient.client.rPush(categoryKey, JSON.stringify(item));
          }

          categories["Best Sellers"].push(search[0]);

          categories[category] = search;
        }
      }

      await redisClient.client.del("feed:timeline");

      await redisClient.client.set("feed:timeline", JSON.stringify(categories));

      await sleep(Number(process.env.INTERVAL_MS as string));
    }
  } catch (err) {
    handleError(err);
  }
};

main();
