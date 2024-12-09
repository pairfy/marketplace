import { database } from "../db/client.js";
import { getContractCollateral, getContractPrice } from "../lib/index.js";
import { UserToken } from "../middleware/agent.js";
import { pendingTransactionBuilder } from "../contracts/builders/pending.js";
import { redisClient } from "../db/redis.js";

const getOrders = async (_: any, args: any, context: any) => {
  const params = args.updateProductInput;

  console.log(params);

  const SELLER = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

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

const getBooks = async (_: any, args: any, context: any) => {
  const params = args.getBooksInput;

  const SELLER = context.sellerData;

  const pageSize = 16;

  const defaultCursor = "NOT";

  let connection = null;

  let queryScheme = `
    SELECT
      p.id AS id,
      p.name AS name,
      p.price AS price,
      p.collateral AS collateral,
      p.sku AS sku,
      p.media_url AS media_url,
      p.image_path  AS image_path,
      p.image_set  AS image_set,
      p.discount AS discount,
      p.discount_value AS discount_value,
      p.created_at AS created_at,      
      b.keeping_stock AS book_keeping_stock,
      b.ready_stock AS book_ready_stock,
      b.blocked_stock AS book_blocked_stock,
      b.disable_purchases AS disable_purchases
    FROM
      products p
    INNER JOIN
      books b
    ON
      p.id = b.id    
    WHERE
      p.seller_id = ?`;

  let queryParams: any = [SELLER.id];

  if (params.cursor !== defaultCursor) {
    queryScheme += " AND p.created_at < ?";

    const date = new Date(parseInt(params.cursor)).toISOString();

    queryParams.push(date);
  }

  queryScheme += " ORDER BY p.created_at DESC LIMIT ?";

  queryParams.push(pageSize);

  try {
    connection = await database.client.getConnection();

    const [books] = await connection.query(queryScheme, queryParams);

    const [productCount] = await connection.execute(
      "SELECT COUNT(*) AS total_books FROM books WHERE seller_id = ?",
      [SELLER.id]
    );

    const cursor = books.length
      ? books[books.length - 1].created_at
      : params.cursor;

    const count = productCount[0].total_books;

    return {
      books,
      cursor,
      count,
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

const products = {
  Query: {
    getOrders,
  },
};

const updateBook = async (_: any, args: any, context: any) => {
  const params = args.updateBookInput;

  console.log(params);

  const SELLER = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
        UPDATE books
        SET keeping_stock = ?,
            ready_stock = ?,
            disable_purchases = ?,              
            schema_v = schema_v + 1
        WHERE id = ? AND seller_id = ?
       `;

    const schemeValue = [
      params.keeping_stock,
      params.ready_stock,
      params.disable_purchases,
      params.id,
      SELLER.id,
    ];

    const [result] = await connection.execute(schemeData, schemeValue);

    if (result.affectedRows !== 1) {
      throw new Error("INTERNAL_ERROR");
    }

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

const books = {
  Query: {
    getBooks,
  },
  Mutation: {
    updateBook,
  },
};

////////////////////////////////////////////////////////////////

const createOrder = async (_: any, args: any, context: any) => {
  const params = args.createOrderInput;

  console.log(params);

  console.log(context);

  const productUnits = params.product_units;

  if (productUnits <= 0) {
    throw new Error("UNITS_ERROR");
  }

  const USER = context.userData as UserToken;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [row] = await connection.execute(
      `SELECT
           p.id AS product_id,
           p.sku AS product_sku,
           p.price AS product_price,
           p.collateral AS product_collateral,
           p.discount AS product_discount,
           p.discount_value AS product_discount_value,
           s.id AS seller_id,
           s.pubkeyhash AS seller_pubkeyhash
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

    if (!row.length) {
      throw new Error("NO_PRODUCT");
    }
    const RESULT = row[0];

    if (!RESULT.seller_pubkeyhash) {
      throw new Error("NO_SELLER_PKH");
    }

    await connection.beginTransaction();

    ///////////////////////////////////////////////////

    const getADAPrice = await redisClient.client.get("price:ADAUSDT");

    if (!getADAPrice) {
      throw new Error("ADA_PRICE");
    }

    const adaPrice = parseFloat(getADAPrice);

    ///////////////////////////////////////////////////

    const contractPrice: number = await getContractPrice(
      RESULT.product_discount,
      RESULT.product_discount_value,
      RESULT.product_price,
      productUnits,
      adaPrice
    );

    const contractCollateral: number = await getContractCollateral(
      RESULT.product_collateral,
      productUnits,
      adaPrice
    );

    const now = Date.now();

    ///////////////////////////////////////////////

    const TX_VALID_TIME = 5; //tx valid until

    const WATCH_TX_WINDOW = 15; //Observation window limit for the detection of the first transaction

    const PENDING_UNTIL = 60; // 15minutes for the seller to accept;

    const SHIPPING_UNTIL = 1440; // 24h to shipping;

    ///////////////////////////////////////////////
    const validUntil = now + TX_VALID_TIME * 60 * 1000;

    const watchUntil = now + (TX_VALID_TIME + WATCH_TX_WINDOW * 60 * 1000);

    const pendingUntil =
      now + (TX_VALID_TIME + WATCH_TX_WINDOW + PENDING_UNTIL * 60 * 1000);

    const shippingUntil =
      now +
      (TX_VALID_TIME +
        WATCH_TX_WINDOW +
        PENDING_UNTIL +
        SHIPPING_UNTIL * 60 * 1000);

    //////////////////////////////////////////////

    const BUILDER = await pendingTransactionBuilder(
      USER.address,
      RESULT.seller_pubkeyhash,
      BigInt(contractPrice),
      BigInt(contractCollateral),
      BigInt(validUntil),
      BigInt(pendingUntil),
      BigInt(shippingUntil)
    );

    //////////////////////////////////////////////

    const orderData = {
      id: BUILDER.threadTokenPolicyId,
      seller_id: RESULT.seller_id,
      buyer_pubkeyhash: USER.pubkeyhash,
      seller_pubkeyhash: RESULT.seller_pubkeyhash,
      ada_price: adaPrice, // add to metadata contract
      contract_address: BUILDER.stateMachineAddress,
      contract_price: contractPrice,
      contract_collateral: contractCollateral,
      contract_units: productUnits, // add to metadata contract
      product_id: RESULT.product_id, // add to metadata contract
      product_sku: RESULT.product_sku, // add to metadata contract
      product_price: RESULT.product_price, // add to metadata contract
      product_collateral: RESULT.product_collateral, // add to metadata contract
      product_discount: RESULT.product_discount, // add to metadata contract
      product_discount_value: RESULT.product_discount_value, // add to metadata contract
      watch_until: watchUntil,
      pending_until: pendingUntil,
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

    const scheme = {
      success: true,
      payload: {
        cbor: BUILDER.cbor,
      },
    };

    return scheme;
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

const orders = {
  Mutation: {
    createOrder,
  },
};

export { products, books, orders };
