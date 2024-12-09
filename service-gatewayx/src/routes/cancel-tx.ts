import DB from "../db";
import { Request, Response } from "express";
import { requireAuth } from "../utils/required";
import { sellerMiddleware } from "../utils/seller";


const cancelTxMiddlewares: any = [sellerMiddleware, requireAuth];

////////////////////////////////////////////////////

const cancelTxHandler = async (req: Request, res: Response) => {
  let connection: any = null;

  const params = req.body;

  const SELLER = req.sellerData;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    //////////////////////////////////////////////

    const schemeData = `
      UPDATE orders 
      SET status = ?,
          contract_cancel_tx = ?
      WHERE id = ? AND seller_id = ?
      `;

    const schemeValue = ["canceled", params.tx_hash, params.order_id, SELLER.id];

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

export { cancelTxMiddlewares, cancelTxHandler };
