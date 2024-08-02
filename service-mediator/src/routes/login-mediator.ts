import { BadRequestError } from "../errors";
import { comparePassword } from "../utils/password";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { MediatorToken, mediatorMiddleware } from "../utils/mediator";
import { _ } from "../utils/pino";
import DB from "../db";

const loginMediatorMiddlewares: any = [mediatorMiddleware];

const loginMediatorHandler = async (req: Request, res: Response) => {
  let connection = null;
  let params = req.body;
  try {
    if (params.mediatorData) {
      throw new Error("LOGGED");
    }

    connection = await DB.client.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM mediators WHERE email = ?",
      [params.email]
    );

    if (rows.length === 0) {
      throw new Error("NO_EXIST");
    }

    const MEDIATOR = rows[0];

    const passwordsMatch = await comparePassword(
      MEDIATOR.password_hash,
      params.password
    );

    if (!passwordsMatch) throw new BadRequestError("failed");

    if (MEDIATOR.verified !== 1) {
      throw new Error("unverified");
    }

    const mediatorData: MediatorToken = {
      id: MEDIATOR.id,
      role: "MEDIATOR",
      email: MEDIATOR.email,
      country: MEDIATOR.country,
      username: MEDIATOR.username,
    };

    const token = createToken(mediatorData);

    req.session = {
      jwt: token,
    };

    res.status(200).send({ success: true, data: mediatorData });
  } catch (err) {
    await connection.rollback();

    _.error(err);

    throw new BadRequestError("Invalid credentials or unverified.");
  } finally {
    connection.release();
  }
};

export { loginMediatorMiddlewares, loginMediatorHandler };
