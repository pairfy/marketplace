import { formatProduct, getCurrentTimestamp } from "../../utils/index.js";
import { database } from "../../database/client.js";

export const updateProduct = async (_: any, args: any, context: any) => {
  const params = args.updateProductInput;

  console.log(params);

  const SELLER = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

    const productData = {
      name: params.name,
      price: params.price,
      model: params.model,
      brand: params.brand,
      features: params.features,
      category: params.category,
      keywords: params.keywords,
      bullet_list: params.bullet_list,
      paused: params.paused,
      color: params.color,
      color_name: params.color_name,
      variations: params.variations,
      quality: params.quality,
      image_set: params.image_set,
      video_set: params.video_set,
      discount: params.discount,
      discount_value: params.discount_value,
      shipping_weight: params.shipping_weight,
      shipping_length: params.shipping_length,
      shipping_width: params.shipping_width,
      shipping_height: params.shipping_height,
      shipping_city: params.shipping_city,
      shipping_postal: params.shipping_postal,
      shipping_instructions: params.shipping_instructions,
      shipping_fragile: params.shipping_fragile,
      updated_at: getCurrentTimestamp()
    };

    const fields = Object.keys(productData)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(productData), params.id, SELLER.id];

    const updateScheme = `
        UPDATE products
        SET ${fields}, schema_v = schema_v + 1
        WHERE id = ? AND seller_id = ?
        `;

    const [updated] = await connection.execute(updateScheme, values);

    if (updated.affectedRows !== 1) {
      throw new Error("INTERNAL_ERROR");
    }

    //////////////////////////////////////////////////////////////

    const [products] = await connection.execute(
      `SELECT * FROM products WHERE id = ?`,
      [params.id]
    );

    if (products.length === 0) {
      throw new Error("INTERNAL_ERROR");
    }
    
    const PRODUCT = formatProduct(products[0]);

    const eventId = PRODUCT.id + "-" + PRODUCT.schema_v;

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
      eventId,
      "service-product",
      "UpdateProduct",
      JSON.stringify(PRODUCT),
      SELLER.id,
      0,
    ];

    await connection.execute(eventSchema, eventValue);

    //////////////////////////////////////////////////////////////

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
