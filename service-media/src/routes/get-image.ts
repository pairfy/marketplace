import DB from "../db";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { _ } from "../utils/pino";

const getImageMiddlewares: any = [];

const getImageHandler = async (req: Request, res: Response) => {
  let connection: any = null;

  let response: string[] = [];
  
  try {
    res.setHeader('Cross-Origin-Resource-Policy', 'none');

    res.setHeader('Cross-Origin-Opener-Policy', 'none');


    connection = await DB.client.getConnection();

    const mediaId = req.params.mediaId.split('.')[0];


    const [rows] = await connection.execute(
      "SELECT * FROM media WHERE media_id = ?",
      [mediaId]
    );

    const imageData = rows[0];

    res.writeHead(200, { "Content-Type": imageData.media_mimetype });

    res.end(imageData.media_data);

    await connection.commit();
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("failed");
  } finally {
    connection.release();
  }
};

export { getImageMiddlewares, getImageHandler };
