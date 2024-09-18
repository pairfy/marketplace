import DB from "../db";
import { Request, Response } from "express";
import { userMiddleware } from "../utils/user";

const shippingTxMiddlewares: any = [userMiddleware];


const shippingTxHandler = async (req: Request, res: Response) => {
  let connection: any = null;

  const params = req.body;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    //////////////////////////////////////////////

    const schemeData = `
      UPDATE orders 
      SET status = ?,
          contract_2_tx = ?
      WHERE id = ?
      `;

    const schemeValue = [
      "shipping",
      params.tx_hash,
      params.order_id
    ];

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({
      success: true,
    });
  } catch (err: any) {
    await connection.rollback();

    res.status(404).send({
      success: false,
    });
  } finally {
    connection.release();
  }
};

export { shippingTxHandler, shippingTxMiddlewares };
