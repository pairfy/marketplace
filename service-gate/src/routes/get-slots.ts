import DB from "../db";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";

const getSlotsMiddlewares: any = [sellerMiddleware, requireAuth];

const getSlotsHandler = async (req: Request, res: Response) => {
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
                'id', s.id,
                'mode', s.mode,
                'status', s.status,
                'actived', s.actived,
                'contract_units', s.contract_units,
                'contract_price', s.contract_price,
                'contract_collateral', s.contract_collateral,
                'contract_stage', s.contract_stage,
                'contract_state', s.contract_state,
                'contract_utx_0', s.contract_utx_0,
                'product_price', s.product_price,
                'product_collateral', s.product_collateral,
                'product_discount', s.product_discount,
                'created_at', s.created_at              
            )
        ) AS slots,
        COUNT(s.id) AS slots_count
      FROM 
        products p
      LEFT JOIN 
        slots s ON p.id = s.product_id
      WHERE
        p.seller_id = ?
      GROUP BY 
        p.id;      
      `,
      [SELLER.id]
    );

    await connection.commit();

    res.status(200).send({ success: true, payload: response });
  } catch (err: any) {
    await connection.rollback();

    throw new BadRequestError(err.message);
  } finally {
    connection.release();
  }
};

export { getSlotsMiddlewares, getSlotsHandler };
