import { Client } from "@elastic/elasticsearch";
import { logger } from "../utils/index.js";

const searchClient = new Client({
  node: process.env.ELASTIC_NODE as string,
  auth: {
    apiKey: process.env.ELASTIC_KEY as string,
  },
});

const searchIndex = async (category: string, limit: number) => {
  let result: any = [];

  try {
    const best_seller = (process.env.BEST_SELLER as string) === "true";

    const response = await searchClient.search({
      index: "products",
      body: {
        query: {
          bool: {
            must: [{ term: { category } }, { term: { best_seller } }],
          },
        },

        sort: [{ sold: "desc" }],
        size: limit,
      },
    });

    result = response.hits.hits.map(hit => hit._source);
  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

export { searchClient, searchIndex };
