import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getUserId } from "../utils/nano";
import { _ } from "../utils/pino";
import DB from "../db";

const createUserMiddlewares: any = [];

const createUserHandler = async (req: Request, res: Response) => {
  let connection = null;

  const params = req.body;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    console.log(req.body);

    const schemeData = `
    INSERT INTO users (
      id,
      username,
      wallet,
      signed_tx,
      country,
      terms_accepted,
      public_ip,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = [
      getUserId(),
      params.username,
      params.wallet,
      params.signed_tx,
      params.country,
      params.terms_accepted,
      "192.168.1.1",
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({ success: true, message: "Successfully registered" });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("User created or invalid username/wallet");
  } finally {
    connection.release();
  }
};

export { createUserMiddlewares, createUserHandler };
