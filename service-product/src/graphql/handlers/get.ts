import { database } from "../../database/client.js";

const getProducts = async (_: any, args: any, context: any) => {
    const params = args.getProductsInput;
  
    const SELLER = context.sellerData;
  
    let connection = null;
  
    const pageSize = 16;
  
    let queryScheme = "SELECT * FROM products WHERE seller_id = ?";
  
    let queryParams: any = [SELLER.id];
  
    if (params.cursor !== "NOT") {
      queryScheme += " AND created_at < ?";
  
      const date = new Date(parseInt(params.cursor)).toISOString();
  
      queryParams.push(date);
    }
  
    queryScheme += " ORDER BY created_at DESC LIMIT ?";
  
    queryParams.push(pageSize);
  
    try {
      connection = await database.client.getConnection();
  
      const [products] = await connection.query(queryScheme, queryParams);
  
      const [productCount] = await connection.execute(
        `SELECT COUNT(*) AS total_products FROM products WHERE seller_id = ?`,
        [SELLER.id]
      );
  
      const cursor = products.length
        ? products[products.length - 1].created_at
        : params.cursor;
  
      const count = productCount[0].total_products;
  
      return {
        products,
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
  
  const getProduct = async (_: any, args: any, context: any) => {
    const params = args.getProductInput;
  
    console.log(params);
  
    const SELLER = context.sellerData;
  
    let connection = null;
  
    try {
      connection = await database.client.getConnection();
  
      const [product] = await connection.execute(
        `SELECT * FROM products WHERE id = ? AND seller_id = ?`,
        [params.id, SELLER.id]
      );
  
      if (!product.length) {
        throw new Error("NOT_PRODUCT");
      }
  
      return product[0];
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

  export { getProduct, getProducts }