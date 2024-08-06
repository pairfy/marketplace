import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { UserToken, userMiddleware } from "../utils/user";
import { _ } from "../utils/pino";
import { getUserId } from "../utils/nano";
import { getPubKeyHash } from "../utils/crypto";
import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import DB from "../db";

const verifyDataSignature = require("@cardano-foundation/cardano-verify-datasignature");

const loginUserMiddlewares: any = [userMiddleware];

const loginUserHandler = async (req: Request, res: Response) => {
  let connection = null;
  let params = req.body;

  console.log(params);

  try {
    const address = Cardano.Address.from_hex(params.address);
    const address32: string = address.to_bech32();
    const pubkeyhash = getPubKeyHash(address);
    const signature = params.signature;
    const message = "PLEASE SIGN TO AUTHENTICATE IN PAIRFY";

    const verifySignature = verifyDataSignature(
      signature.signature,
      signature.key,
      message,
      address32
    );

    if (!verifySignature) {
      throw new BadRequestError("AUTH_FAILED");
    }

    ///////////////////////////////////////////////////////

    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const userId = getUserId();
    const username = "server";
    const country = "server";

    const schemeData = `
    INSERT INTO users (
      id,
      username,
      address,
      pubkeyhash,
      country,
      terms_accepted,
      public_ip,
      schema_v
     ) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      username = VALUES(username),
      address = VALUES(address),
      pubkeyhash = VALUES(pubkeyhash),
      country = VALUES(country),
      terms_accepted = VALUES(terms_accepted),
      public_ip = VALUES(public_ip),
      schema_v = VALUES(schema_v);
     `;

    const schemeValue = [
      userId,
      username,
      address32,
      pubkeyhash,
      country,
      params.terms_accepted,
      "192.168.1.1",
      0,
    ];

    const userData: UserToken = {
      id: userId,
      role: "USER",
      address: address32,
      pubkeyhash,
      country,
      username,
    };

    console.log(schemeValue);

    req.session = {
      jwt: createToken(userData),
    };

    await connection.execute(schemeData, schemeValue);

    await connection.commit();

    res.status(200).send({ success: true, data: userData });
  } catch (err) {
    await connection.rollback();
    _.error(err);
  } finally {
    connection.release();
  }
};

export { loginUserMiddlewares, loginUserHandler };
