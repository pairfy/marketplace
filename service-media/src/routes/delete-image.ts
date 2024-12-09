import DB from "../db";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { _ } from "../utils/pino";

const deleteImageMiddlewares: any = [sellerMiddleware, requireAuth];

const deleteImageHandler = async (req: Request, res: Response) => {
  res.setHeader("Cross-Origin-Resource-Policy", "none");

  res.setHeader("Cross-Origin-Opener-Policy", "none");

  const SELLER = req.sellerData;

  const params = req.body;

  let connection: any = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    for (const mediaName of params.images) {
      const [result] = await connection.execute(
        "DELETE FROM media WHERE media_name = ? AND seller_id = ?",
        [mediaName, SELLER.id]
      );

      if (result.affectedRows !== 1) {
        throw new Error("INTERNAL_ERROR");
      }
    }

    await connection.commit();

    res.status(200).send({ success: true });
  } catch (err: any) {
    await connection.rollback();

    throw new BadRequestError(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { deleteImageMiddlewares, deleteImageHandler };
