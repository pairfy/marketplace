import { searchClient } from "../../elastic/index.js";
import { database } from "../../database/client.js";
import { logger } from "../../utils/index.js";

const searchIndex = async (id: string) => {
  let result: any = [];

  try {
    const response = await searchClient.search({
      index: "products",
      body: {
        query: {
          term: {
            id,
          },
        },
      },
    });

    result = response.hits.hits;

  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

const getProduct = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const params = args.getProductInput;

    connection = await database.client.getConnection();

    const [product] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [params.id]
    );

    if (!product.length) {
      throw new Error("ProductExistence");
    }

    const PRODUCT = product[0];

    let payload = {
      ...PRODUCT,
      rating: 0,
      reviews: 0,
      best_seller: false,
      sold: 0,
      available: 0,
    };

    const search = await searchIndex(PRODUCT.id);

    if (search.length) {
      const data = search[0]._source;

      payload.rating = data.rating;
      payload.reviews = data.reviews;
      payload.best_seller = data.best_seller;
      payload.sold = data.sold;
      payload.available = data.available;
    }

    return {
      success: true,
      payload,
    };
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { getProduct };
