import DB from "../db";
import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";

const getOrdersMiddlewares: any = [sellerMiddleware, requireAuth];

const getOrdersHandler = async (req: Request, res: Response) => {
  const params = req.body;

  const SELLER = req.sellerData;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    const [response] = await connection.execute(
      `
      SELECT 
        p.*,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', o.id,
                'mode', o.mode,
                'status', o.status,
                'contract_units', o.contract_units,
                'contract_price', o.contract_price,
                'contract_collateral', o.contract_collateral,
                'contract_state', o.contract_state,
                'contract_0_tx', o.contract_0_tx,
                'product_discount', o.product_discount,
                'created_at', o.created_at              
            )
        ) AS orders,
        COUNT(o.id) AS order_count
      FROM 
        products p
      LEFT JOIN 
        orders o ON p.id = o.product_id
      WHERE
        p.seller_id = ?
      GROUP BY 
        p.id;      
      `,
      [SELLER.id],
    );

    await connection.commit();

    res.status(200).send({ success: true, payload: response });
  } catch (err: any) {
    await connection.rollback();

    res.status(404).send({ success: true });
  } finally {
    connection.release();
  }
};

export { getOrdersHandler, getOrdersMiddlewares };
