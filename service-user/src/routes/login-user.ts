import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { UserToken, userMiddleware } from "../utils/user";
import { _ } from "../utils/pino";
import { getPubKeyHash } from "../utils/crypto";
import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import DB from "../db";
import { getUsername } from "../utils/nano";

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

    const message = "PLEASE SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE";

    const verifySignature = verifyDataSignature(
      signature.signature,
      signature.key,
      message,
      address32
    );

    if (!verifySignature) {
      throw new BadRequestError("AUTH_FAILED");
    }

    connection = await DB.client.getConnection();
    
    await connection.beginTransaction();

    const username = getUsername();

    const country = "server";

    const schemeData = `
    INSERT INTO users (
      pubkeyhash,
      username,
      address,
      country,
      terms_accepted,
      public_ip,
      schema_v
     ) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      pubkeyhash = pubkeyhash,
      username = username,
      address = address,
      country = country,
      terms_accepted = terms_accepted,
      public_ip = VALUES(public_ip),
      schema_v = schema_v;
     `;

    const schemeValue = [
      pubkeyhash,
      username,
      address32,
      country,
      params.terms_accepted,
      "192.168.1.1",
      0,
    ];

    await connection.execute(schemeData, schemeValue);

    ///////////////////////////////////7
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE pubkeyhash = ?",
      [pubkeyhash]
    );

    const USER = rows[0];

    const userData: UserToken = {
      pubkeyhash: USER.pubkeyhash,
      role: "USER",
      address: USER.address,
      country: USER.country,
      username: USER.username,
    };

    console.log(schemeValue);

    req.session = {
      jwt: createToken(userData),
    };

    await connection.commit();

    res.status(200).send({ success: true, data: userData });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    _.error(err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { loginUserMiddlewares, loginUserHandler };
