import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { _ } from "../utils/pino";
import DB from "../db";

const updateProductMiddlewares: any = [sellerMiddleware, requireAuth];

const updateProductHandler = async (req: Request, res: Response) => {
  const params = req.body;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    UPDATE products 
    SET title = ?,
        category = ?,
        price = ?,
        collateral = ?,
        stock = ?,
        note = ?,
        keywords = ?,
        theme = ?,
        terms = ?,
        country = ?,
        image_base = ?,
        image_path = ?,
        schema_v = schema_v + 1
    WHERE id = ?
    `;

    const schemeValue = [
      params.title,
      params.category,
      params.price,
      params.collateral,
      params.stock,
      params.note,
      params.keywords,
      params.theme,
      params.terms,
      params.country,
      params.image_base,
      params.image_path,
      params.id,
    ];

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({ success: true });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("failed");
  } finally {
    connection.release();
  }
};

export { updateProductMiddlewares, updateProductHandler };
