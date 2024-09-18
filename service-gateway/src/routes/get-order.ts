import DB from "../db";
import { BadRequestError, NotAuthorizedError } from "../errors";
import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";
import { userMiddleware } from "../utils/user";
import { _ } from "../utils/pino";

const getOrderMiddlewares: any = [sellerMiddleware, userMiddleware];

const getOrderHandler = async (req: Request, res: Response) => {
  const params = req.params;

  const SELLER = req.sellerData;
  const BUYER = req.userData;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    const [orders] = await connection.execute(
      `
      SELECT 
      orders.id,
      orders.mode,
      orders.status,
      orders.seller_id,
      orders.buyer_pubkeyhash,
      orders.contract_state,
      orders.contract_units, 
      orders.contract_price,
      orders.contract_collateral,
      orders.contract_range,
      orders.contract_0_tx,
      orders.contract_1_tx,
      orders.contract_2_tx,
      orders.contract_3_tx,
      orders.created_at,
      JSON_OBJECT(
          'product_id', products.id,
          'product_name', products.name,
          'model', products.model,
          'media_url', products.media_url,
          'media_path', products.media_path,
          'image_main', products.image_main
      ) AS product_details

      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE orders.id = ?;
      `,
      [params.id],
    );

    await connection.commit();

    if (orders.length === 0) {
      throw new BadRequestError("NO_ORDER");
    }

    const ORDER = orders[0];

    console.log(ORDER);

    if (ORDER.seller_id === SELLER?.id) {
      return res.status(200).send({ success: true, payload: ORDER });
    }

    if (ORDER.buyer_pubkeyhash === BUYER?.pubkeyhash) {
      return res.status(200).send({ success: true, payload: ORDER });
    }

    throw new NotAuthorizedError();
  } catch (err: any) {
  
    await connection.rollback();

    _.error(err);

    res.status(404).send({ success: false });
  } finally {
    connection.release();
  }
};

export { getOrderHandler, getOrderMiddlewares };
