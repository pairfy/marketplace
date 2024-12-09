import DB from "../db";
import { hashPassword } from "../utils/password";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getSellerId } from "../utils/nano";
import { createToken } from "../utils/token";
import { _ } from "../utils/pino";

const createSellerMiddlewares: any = [];

const createSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  const params = req.body;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const token = createToken({
      source: "createSeller",
      entity: "SELLER",
      email: params.email,
      username: params.username,
    });

    const password = await hashPassword(params.password);

    const schemeData = `
    INSERT INTO sellers (
      id,
      username,
      email,
      password_hash,
      country,
      terms_accepted,
      avatar_base,
      avatar_path,
      public_ip,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = [
      getSellerId(),
      params.username,
      params.email,
      password,
      params.country.code,
      params.terms_accepted,
      "https://example.com",
      "/avatar.jpg",
      "192.168.1.1",
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({ success: true, message: "Successfully registered" });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }

    _.error(err);

    throw new BadRequestError("Invalid username or email");
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { createSellerMiddlewares, createSellerHandler };
