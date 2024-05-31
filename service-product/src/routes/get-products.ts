import DB from "../db";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { _ } from "../utils/pino";


const getProductsMiddlewares: any = [sellerMiddleware, requireAuth];

const getProductsHandler = async (req: Request, res: Response) => {
  const params = req.body;

  const SELLER = req.sellerData;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    const [response] = await connection.execute(
      "SELECT * FROM products WHERE seller_id = ?",
      [SELLER.id]
    );

    await connection.commit();

    res.status(200).send({ success: true, payload: response });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("failed");
  } finally {
    connection.release();
  }
};

export { getProductsMiddlewares, getProductsHandler };
