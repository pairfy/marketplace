import { Client } from "@elastic/elasticsearch";
import { logger } from "../utils/index.js";

const searchClient = new Client({
  node: process.env.ELASTIC_NODE as string,
  auth: {
    apiKey: process.env.ELASTIC_KEY as string,
  },
});

interface UpdateAvailabilityInput {
  id: string;
  available: number;
}

const updateProductAvailability = async (
  data: UpdateAvailabilityInput
): Promise<boolean> => {
  let result = false;

  try {
    const document = {
      id: data.id,
      available: data.available,
    };

    const response = await searchClient.update({
      index: "products",
      id: document.id,
      doc: document,
    });

    if (response.result !== "updated") {
      throw new Error("UpdateProductIndexError");
    }

    result = true;
  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

export { searchClient, updateProductAvailability };
