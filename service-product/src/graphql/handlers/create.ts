import { formatProduct, getCurrentTimestamp, getProductId } from "../../utils/index.js";
import { database } from "../../database/client.js";

export const createProduct = async (_: any, args: any, context: any) => {
  const params = args.createProductInput;

  console.log(params);

  const SELLER = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

    const productId = getProductId();

    const productVersion = 0;

    const productSKU = params.sku + `:${SELLER.id}`;

    const productData = {
      id: productId,
      seller_id: SELLER.id,
      name: params.name,
      price: params.price,
      sku: productSKU,
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
      country: SELLER.country,
      media_url: "https://pairfy.dev",
      image_path: "/api/media/get-image/",
      video_path: "/api/media/get-video/",
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
      updated_at: getCurrentTimestamp(),
      schema_v: productVersion,
    };

    const columns = Object.keys(productData);

    const values = Object.values(productData);

    const createScheme = `
        INSERT INTO products (${columns.join(", ")})
        VALUES (${columns.map(() => "?").join(", ")})
      `;

    const [created] = await connection.execute(createScheme, values);

    if (created.affectedRows !== 1) {
      throw new Error("INTERNAL_ERROR");
    }

    //////////////////////////////////////////////////////////////

    const [products] = await connection.execute(
      `SELECT * FROM products WHERE id = ?`,
      [productId]
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
      "CreateProduct",
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
