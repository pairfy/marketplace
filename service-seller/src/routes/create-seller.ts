import { hashPassword } from "../utils/password";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getSellerId } from "../utils/nano";
import { createToken } from "../utils/token";
import { _ } from "../utils/pino";
import DB from "../db";

const createSellerMiddlewares: any = [];

const createSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  const params = req.body;
  
  console.log("1");

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    console.log("2");

    const token = createToken({
      role: "create-seller",
      entity: "seller",
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
      verified,
      country,
      trade_terms,
      terms_accepted,
      avatar_base,
      avatar_path,
      public_ip,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = [
      getSellerId(),
      params.username,
      params.email,
      password,
      false,
      params.country,
      "Terms and conditions: Provide correct data for effective shipping.",
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
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("invalid username or email");
  } finally {
    connection.release();
  }
};

export { createSellerMiddlewares, createSellerHandler };
