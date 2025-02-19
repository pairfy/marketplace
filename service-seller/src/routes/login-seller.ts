import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import database from "../db";
import { BadRequestError } from "../errors";
import { comparePassword } from "../utils/password";
import { Request, Response } from "express";
import { SellerToken, sellerMiddleware } from "../utils/seller";
import { createToken } from "../utils/token";
import { getPubKeyHash } from "../utils/blockchain";
import { _ } from "../utils/pino";

const verifyDataSignature = require("@cardano-foundation/cardano-verify-datasignature");

const loginSellerMiddlewares: any = [sellerMiddleware];

const loginSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  let params = req.body;

  try {
    const address = Cardano.Address.from_hex(params.address);

    const address32: string = address.to_bech32();

    const pubkeyhash = getPubKeyHash(address);

    const signature = params.signature;

    const message = "SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE";

    const verifySignature = verifyDataSignature(
      signature.signature,
      signature.key,
      message,
      address32
    );

    if (!verifySignature) {
      throw new BadRequestError("AUTH_FAILED");
    }

    /////////////////////////////////////////////////////////////////

    connection = await database.client.getConnection();

    const [rows] = await connection.execute(
      `SELECT id,
              email,
              password_hash,              
              verified,
              avatar_base,
              avatar_path,
              address,
              country,
              username
      FROM sellers WHERE email = ?`,
      [params.email]
    );

    if (rows.length === 0) {
      throw new Error("CREDENTIALS");
    }

    const SELLER = rows[0];

    if (SELLER.verified !== 1) {
      throw new Error("UNVERIFIED");
    }

    /////////////////////////////////////////////////////////////////

    const passwordsMatch = await comparePassword(
      SELLER.password_hash,
      params.password
    );

    if (!passwordsMatch) {
      throw new Error("CREDENTIALS");
    }

    /////////////////////////////////////////////////////////////////

    const sellerData: SellerToken = {
      id: SELLER.id,
      role: "SELLER",
      email: SELLER.email,
      avatar: SELLER.avatar_base + SELLER.avatar_path,
      address: address32,
      country: SELLER.country,
      username: SELLER.username,
      pubkeyhash,
    };

    /////////////////////////////////////////////////////////////////

    await connection.beginTransaction();

    const schemeData = `
      UPDATE sellers
      SET pubkeyhash = ?, address = ?
      WHERE id = ?
   `;
    const [result] = await connection.execute(schemeData, [
      pubkeyhash,
      address32,
      SELLER.id
    ]);

    if (result.affectedRows !== 1) {
      throw new Error("INTERNAL_ERROR");
    }

    const token = createToken(sellerData);

    req.session = {
      jwt: token,
    };

    await connection.commit();

    /////////////////////////////////////////////////////////////////

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
