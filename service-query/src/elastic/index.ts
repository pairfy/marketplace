import { Client } from "@elastic/elasticsearch";
import { logger } from "../utils/index.js";

const searchClient = new Client({
  node: process.env.ELASTIC_ENDPOINT as string,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY as string,
  },
});

const createProductIndex = async () => {
    let result = false;
    try {
      const exists = await searchClient.indices.exists({ index: "products" });
  
      if (exists) {
        result = true;
      } else {
        const response = await searchClient.indices.create({
          index: "products",
  
          body: {
            settings: {
              analysis: {
                analyzer: {
                  autocomplete_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: ["lowercase", "autocomplete_filter"],
                  },
                },
                filter: {
                  autocomplete_filter: {
                    type: "edge_ngram",
                    min_gram: 2,
                    max_gram: 20,
                  },
                },
              },
            },
            mappings: {
              properties: {
                id: { type: "keyword" }, // Unique identifier
                name: {
                  type: "text",
                  analyzer: "autocomplete_analyzer",
                  fields: {
                    raw: { type: "keyword" }, // For exact matches and sorting
                  },
                },
                sku: { type: "keyword" },
                category: { type: "keyword" }, // For filtering
                brand: { type: "keyword" }, // For filtering
                model: { type: "keyword" }, // For exact search
                price: { type: "double" }, // For range filtering and sorting
                quality: { type: "keyword" }, // New, Used, etc.
                image: { type: "text", index: false }, // Store only
                keywords: { type: "text", analyzer: "standard" }, // Full-text search
                rating: { type: "float" }, // For sorting
                reviews: { type: "integer" }, // For sorting
                discount: { type: "boolean" }, // For filtering
                discount_value: { type: "double" }, // For sorting
                best_seller: { type: "boolean" }, // For filtering
                sold: { type: "integer" }, 
                available: { type: "integer" }
              },
            },
          },
        });
  
        if (!response.acknowledged) {
          throw new Error("CREATE_INDEX");
        }

        result = true;
      }
    } catch (err: any) {
      logger.error(err.message);
    } finally {
      return result;
    }
  };
  

  export { createProductIndex, searchClient }