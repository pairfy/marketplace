import { database } from "../../database/client.js";
import { logger } from "../../utils/index.js";
import { Client } from "@elastic/elasticsearch";

const searchClient = new Client({
  node: process.env.ELASTIC_NODE as string,
  auth: {
    apiKey: process.env.ELASTIC_KEY as string,
  },
});

const createProductIndex = async (payload: any): Promise<boolean> => {
  let result = false;

  try {
    const exists = await searchClient.exists({
      index: "products",
      id: payload.id,
    });

    if (exists) {
      result = true;
    } else {
      const images = payload.image_set.split(",");

      const productImage = payload.media_url + payload.image_path + images[0];

      const document = {
        id: payload.id,
        name: payload.name,
        sku: payload.sku,
        category: payload.category,
        brand: payload.brand,
        model: payload.model,
        price: payload.price,
        quality: payload.quality,
        image: productImage,
        keywords: payload.keywords,
        rating: 0.0,
        reviews: 0,
        discount: payload.discount,
        discount_value: payload.discount_value,
        best_seller: false,
        sold: 0,
        available: 0
      };

      const response = await searchClient.index({
        index: "products",
        id: document.id,
        document,
      });

      if (response.result !== "created") {
        throw new Error("CreateProductIndexError");
      }

      result = true;
    }
  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

const deleteProductIndex = async (id: string): Promise<boolean> => {
  let result = false;

  try {
    const response = await searchClient.delete({
      index: "products",
      id,
    });

    if (response.result !== "deleted") {
      throw new Error("DeleteProductIndexError");
    }

    result = true;
  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

const updateProductIndex = async (payload: any): Promise<boolean> => {
  let result = false;

  try {
    const images = payload.image_set.split(",");

    const productImage = payload.media_url + payload.image_path + images[0];

    const document = {
      id: payload.id,
      name: payload.name,
      sku: payload.sku,
      category: payload.category,
      brand: payload.brand,
      model: payload.model,
      price: payload.price,
      quality: payload.quality,
      image: productImage,
      keywords: payload.keywords,
      discount: payload.discount,
      discount_value: payload.discount_value,
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

const CreateProduct = async (event: any, seq: number): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [findProcessed] = await connection.execute(
      "SELECT id FROM processed WHERE id = ? AND processed = ?",
      [event.id, true]
    );

    if (findProcessed.length > 0) {
      console.log("CreateProductRepeated");

      return Promise.resolve(true);
    }

    const payload = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const columns = Object.keys(payload);

    const values = Object.values(payload);

    const createScheme = `
      INSERT INTO products (${columns.join(", ")})
      VALUES (${columns.map(() => "?").join(", ")})
    `;

    await connection.execute(createScheme, values);

    await connection.execute(
      "INSERT INTO processed (id, seq, type, processed) VALUES (?, ?, ?, ?)",
      [event.id, seq, event.type, true]
    );

    const elastic = await createProductIndex(payload);

    if (!elastic) {
      throw new Error("CreateProductElastic");
    }

    ///////////////////////////////////////////////////////

    await connection.commit();

    response = Promise.resolve(true);
  } catch (err: any) {
    logger.error(err);

    if (connection) {
      await connection.rollback();
    }

    response = Promise.resolve(false);
  } finally {
    if (connection) {
      await connection.release();
    }
  }

  return response;
};

const UpdateProduct = async (event: any, seq: number): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [findProcessed] = await connection.execute(
      "SELECT id FROM processed WHERE id = ? AND processed = ?",
      [event.id, true]
    );

    if (findProcessed.length > 0) {
      console.log("UpdateProductRepeated");

      return Promise.resolve(true);
    }

    const payload = JSON.parse(event.data);

    ///////////////////////////////////////////////////////
    await connection.beginTransaction();

    const fields = Object.keys(payload)
      .map((key) => `${key} = ?`)
      .join(", ");

    const updateScheme = `
        UPDATE products
        SET ${fields}
        WHERE id = ? AND schema_v = ?
        `;

    const values = [
      ...Object.values(payload),
      payload.id,
      payload.schema_v - 1,
    ];

    const [updated] = await connection.execute(updateScheme, values);

    if (updated.affectedRows !== 1) {
      throw new Error("UpdateProductError");
    }

    const updateIndex = await updateProductIndex(payload);

    if (!updateIndex) {
      throw new Error("UpdateProductElastic");
    }

    await connection.execute(
      "INSERT INTO processed (id, seq, type, processed) VALUES (?, ?, ?, ?)",
      [event.id, seq, event.type, true]
    );

    await connection.commit();

    ///////////////////////////////////////////////////////

    response = Promise.resolve(true);
  } catch (err: any) {
    logger.error(err);

    if (connection) {
      await connection.rollback();
    }

    response = Promise.resolve(false);
  } finally {
    if (connection) {
      await connection.release();
    }
  }

  return response;
};

const DeleteProduct = async (event: any, seq: number): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [findProcessed] = await connection.execute(
      "SELECT id FROM processed WHERE id = ? AND processed = ?",
      [event.id, true]
    );

    if (findProcessed.length > 0) {
      console.log("DeleteProductRepeated");

      return Promise.resolve(true);
    }

    const payload = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const [result] = await connection.execute(
      "DELETE FROM products WHERE id = ? AND schema_v = ?",
      [payload.id, payload.schema_v]
    );

    if (result.affectedRows !== 1) {
      throw new Error("DeleteProductError");
    }

    const deleteIndex = await deleteProductIndex(payload.id);

    if (!deleteIndex) {
      throw new Error("DeleteProductIndexError");
    }

    await connection.execute(
      "INSERT INTO processed (id, seq, type, processed) VALUES (?, ?, ?, ?)",
      [event.id, seq, event.type, true]
    );

    ///////////////////////////////////////////////////////

    await connection.commit();

    response = Promise.resolve(true);
  } catch (err: any) {
    logger.error(err);

    if (connection) {
      await connection.rollback();
    }

    response = Promise.resolve(false);
  } finally {
    if (connection) {
      await connection.release();
    }
  }

  return response;
};

const handlers: any = {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
};

export const processEvent = (message: any) => {
  const messageDecoded = new TextDecoder().decode(message.data);

  const event = JSON.parse(messageDecoded);

  console.log(message.seq, event.id, event.type);

  return handlers[event.type](event, message.seq);
};
