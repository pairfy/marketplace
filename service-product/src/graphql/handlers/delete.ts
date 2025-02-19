import { formatProduct, getEventId } from "../../utils/index.js";
import { database } from "../../database/client.js";

export const deleteProduct = async (_: any, args: any, context: any) => {
  const params = args.deleteProductInput;

  console.log(params);

  const SELLER = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

    ////////////////////////////////////////////////////////////////////

    const [products] = await connection.execute(
      "SELECT * FROM products WHERE id = ? AND seller_id = ?",
      [params.id, SELLER.id]
    );

    if (products.length === 0) {
      throw new Error("ProductExistence");
    }

    const PRODUCT = formatProduct(products[0]);

    const [result] = await connection.execute("DELETE FROM products WHERE id = ?", [PRODUCT.id]);

    if (result.affectedRows !== 1) {
      throw new Error("DeleteProductError");
    }

    const eventSchema = `
          INSERT INTO events (
          id,
          source,
          type,
          data,
          agent_id,
          spec_version
          ) VALUES (?, ?, ?, ?, ?, ?)
          `;

    const eventValue = [
      getEventId(),
      "service-product",
      "DeleteProduct",
      JSON.stringify(PRODUCT),
      SELLER.id,
      0,
    ];

    await connection.execute(eventSchema, eventValue);

    ////////////////////////////////////////////////////////////////////

    await connection.commit();

    return { success: true };
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
