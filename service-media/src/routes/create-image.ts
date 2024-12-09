import DB from "../db";
import uploadMiddleware from "../utils/multer";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getImageId } from "../utils/nano";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { _ } from "../utils/pino";

const createImageMiddlewares: any = [
  sellerMiddleware,
  requireAuth,
  uploadMiddleware.array("image", 15),
];

const createImageHandler = async (req: Request, res: Response) => {
  const SELLER = req.sellerData;

  let connection: any = null;

  let response: string[] = [];

  try {
    if (!req.files) {
      throw new Error("NOT_FILES");
    }

    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    for (const file of req.files as Express.Multer.File[]) {
      const schemeData = `
      INSERT INTO media (
        media_id,
        media_name,
        seller_id,
        media_type,
        media_mimetype,
        media_data,
        schema_v
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      const mediaId = getImageId();

      const mediaName = mediaId + "." + file.mimetype.split("/")[1]

      const schemeValue = [
        mediaId,
        mediaName,
        SELLER.id,
        "image",
        file.mimetype,
        file.buffer,
        0,
      ];

      const [result] = await connection.execute(schemeData, schemeValue);

      if (result.affectedRows === 1) {
        response.push(mediaName);
      }
    }

    await connection.commit();

    res.status(200).send({ success: true, payload: response });
  } catch (err: any) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { createImageMiddlewares, createImageHandler };
