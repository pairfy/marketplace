import { getContractFee, getContractPrice } from "../../lib/index.js";
import { chunkMetadata, encryptMetadata } from "../../blockchain/metadata.js";
import { pendingTransactionBuilder } from "../../contracts/builders/pending.js";
import { UserToken } from "../../middleware/agent.js";
import { database } from "../../database/client.js";
import { redisClient } from "../../database/redis.js";

const pendingEndpoint = async (_: any, args: any, context: any) => {
  if (!context.userData) {
    throw new Error("CREDENTIALS");
  }

  const params = args.pendingEndpointInput;

  console.log(params);

  const productUnits = params.product_units;

  if (productUnits <= 0) {
    throw new Error("NO_UNITS");
  }

  const USER = context.userData as UserToken;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [products] = await connection.execute(
      `SELECT
             p.id AS product_id,
             p.name AS product_name,
             p.price AS product_price,
             p.sku AS product_sku,
             p.model AS product_model,
             p.brand AS product_brand,
             p.features AS product_features,
             p.bullet_list AS product_bullet_list,
             p.country AS product_country,
             p.discount AS product_discount,
             p.discount_value AS product_discount_value,
             p.media_url AS product_media_url,
             p.image_path AS product_image_path,
             p.video_path AS product_video_path,
             p.image_set AS product_image_set,
             p.video_set AS product_video_set,
             s.id AS seller_id,
             s.pubkeyhash AS seller_pubkeyhash,
             s.address AS seller_address
         FROM
             products p
         INNER JOIN
             sellers s
         ON
             p.seller_id = s.id            
         WHERE
             p.id = ?`,
      [params.product_id]
    );

    if (!products.length) {
      throw new Error("NO_PRODUCT");
    }

    const RESULT = products[0];

    if (!RESULT.seller_pubkeyhash) {
      throw new Error("NO_SELLER_PKH");
    }

    await connection.beginTransaction();
    
    ///////////////////////////////////////////////////

    const PGPVersion = "1.0";

    const externalData = {
      data: params.data,
      version: PGPVersion,
    };

    const encrypted = await encryptMetadata(JSON.stringify(externalData), PGPVersion);

    const metadata = {
      version: PGPVersion,
      msg: chunkMetadata(encrypted, 64),
    };

    ///////////////////////////////////////////////////

    const getADAPrice = await redisClient.client.get("price:ADAUSDT");

    if (!getADAPrice) {
      throw new Error("ADA_PRICE");
    }

    const ADAUSD = parseFloat(getADAPrice);

    ///////////////////////////////////////////////////

    const contractPrice: number = await getContractPrice(
      RESULT.product_discount,
      RESULT.product_discount_value,
      RESULT.product_price,
      productUnits,
      ADAUSD
    );

    const contractFee: number = await getContractFee(contractPrice);

    const operator = "a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141"
    //////////////////////////////////////////////

    const BUILDER = await pendingTransactionBuilder(
      operator,
      USER.address,
      RESULT.seller_pubkeyhash,
      BigInt(contractPrice),
      BigInt(contractFee),
      metadata
    );

    //////////////////////////////////////////////

    const orderData = {
      id: BUILDER.threadTokenPolicyId,
      country: RESULT.product_country,
      seller_id: RESULT.seller_id,
      buyer_pubkeyhash: USER.pubkeyhash,
      seller_pubkeyhash: RESULT.seller_pubkeyhash,
      buyer_address: USER.address,
      seller_address: RESULT.seller_address,
      buyer_username: USER.username,
      ada_price: ADAUSD,
      contract_address: BUILDER.stateMachineAddress,
      contract_params: BUILDER.serializedParams,
      contract_price: contractPrice,
      contract_fee: contractFee,
      contract_units: productUnits,
      product_id: RESULT.product_id,
      product_name: RESULT.product_name,
      product_price: RESULT.product_price,
      product_sku: RESULT.product_sku,
      product_model: RESULT.product_model,
      product_brand: RESULT.product_brand,
      product_features: RESULT.product_features,
      product_bullet_list: RESULT.product_bullet_list,
      product_discount: RESULT.product_discount,
      product_discount_value: RESULT.product_discount_value,
      product_media_url: RESULT.product_media_url,
      product_image_path: RESULT.product_image_path,
      product_video_path: RESULT.product_video_path,
      product_image_set: RESULT.product_image_set,
      product_video_set: RESULT.product_video_set,
      watch_until: BUILDER.watchUntil,
      pending_until: BUILDER.pendingUntil,
      shipping_until: BUILDER.shippingUntil,
      expire_until: BUILDER.expireUntil
    };

    console.log(orderData);

    const columns = Object.keys(orderData);

    const values = Object.values(orderData);

    const schemeData = `
        INSERT INTO orders (${columns.join(", ")})
        VALUES (${columns.map(() => "?").join(", ")})
      `;

    await connection.execute(schemeData, values);

    await connection.commit();

    return {
      success: true,
      payload: {
        cbor: BUILDER.cbor,
        order: BUILDER.threadTokenPolicyId,
      },
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

export { pendingEndpoint };
