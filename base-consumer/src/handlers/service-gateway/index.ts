import { database } from "../../database/client.js";
import { logger } from "../../utils/index.js";

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

    const schemeData = `
      INSERT INTO products (${columns.join(", ")})
      VALUES (${columns.map(() => "?").join(", ")})
    `;

    await connection.execute(schemeData, values);

    await connection.execute(
      "INSERT INTO books (id, seller_id, product_sku) VALUES (?, ?, ?)",
      [payload.id, payload.seller_id, payload.sku]
    );

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

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

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
