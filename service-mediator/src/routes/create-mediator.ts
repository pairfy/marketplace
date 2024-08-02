import { hashPassword } from "../utils/password";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getMediatorId } from "../utils/nano";
import { _ } from "../utils/pino";
import DB from "../db";

const createMediatorMiddlewares: any = [];

const createMediatorHandler = async (req: Request, res: Response) => {
  let connection = null;

  const params = req.body;
  
  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const password = await hashPassword(params.password);

    const schemeData = `
    INSERT INTO mediators (
      id,
      username,
      email,
      password_hash,
      verified,
      country,
      terms_accepted,
      public_ip,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = [
      getMediatorId(),
      params.username,
      params.email,
      password,
      false,
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

    throw new BadRequestError("invalid username or email");
  } finally {
    connection.release();
  }
};

export { createMediatorMiddlewares, createMediatorHandler };
