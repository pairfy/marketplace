import DB from "../db";
import { BadRequestError } from "../errors";
import { comparePassword } from "../utils/password";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { SellerToken, sellerMiddleware } from "../utils/seller";
import { _ } from "../utils/pino";

const loginSellerMiddlewares: any = [sellerMiddleware];

const loginSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  let params = req.body;

  try {
    if (params.sellerData) {
      throw new Error("LOGGED");
    }

    connection = await DB.client.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM sellers WHERE email = ?",
      [params.email]
    );

    if (rows.length === 0) {
      throw new Error("CREDENTIALS");
    }

    const SELLER = rows[0];

    const passwordsMatch = await comparePassword(
      SELLER.password_hash,
      params.password
    );

    if (!passwordsMatch) {
      throw new Error("CREDENTIALS");
    }

    if (SELLER.verified !== 1) {
      throw new Error("UNVERIFIED");
    }

    const sellerData: SellerToken = {
      id: SELLER.id,
      role: "SELLER",
      email: SELLER.email,
      avatar: SELLER.avatar_base + SELLER.avatar_path,
      address: SELLER.address,
      country: SELLER.country,
      username: SELLER.username,
      pubkeyhash: SELLER.pubkeyhash,
    };

    const token = createToken(sellerData);

    req.session = {
      jwt: token,
    };

    res.status(200).send({ success: true, data: sellerData });
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    _.error(err);

    throw new BadRequestError(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { loginSellerMiddlewares, loginSellerHandler };
