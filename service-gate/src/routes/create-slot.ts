import DB from "../db";
import API from "../api";
import assert from "assert";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getSlotId } from "../utils/nano";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { sendEvent } from "./get-events";
import { getContractCollateral, getContractPrice } from "../utils/other";
import { _ } from "../utils/pino";

///////////////////////////////////////////////

interface createScheme {
  mode: string;
  iterations: number;
  iteration_units: number;
  iteration_price: number;
  iteration_collateral: number;
  product_discount: number;
}

interface instanceScheme {
  caID: string;
  caWallet: {
    getWalletId: string;
  };
}

///////////////////////////////////////////////

const createSlotMiddlewares: any = [sellerMiddleware, requireAuth];

/**HANDLER: creates slots*/
const createSlotHandler = async (req: Request, res: Response) => {
  const params = req.body;

  const SELLER = req.sellerData;

  const instanceScheme: instanceScheme = {
    caID: "SlaveContract",
    caWallet: {
      getWalletId: params.wallet_id,
    },
  };

  let connection: any = null;

  let createScheme: createScheme = {
    mode: "",
    iterations: 0,
    iteration_units: 0,
    iteration_price: 0,
    iteration_collateral: 0,
    product_discount: 0,
  };

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const [products] = await connection.execute(
      "SELECT * FROM products WHERE id = ? AND seller_id = ?",
      [params.product_id, SELLER.id]
    );

    if (products.length === 0) {
      throw new Error("NOT_PRODUCT");
    }

    const PRODUCT = products[0];

    if (PRODUCT.stock < 1) {
      throw new Error("NOT_STOCK");
    }

    ///////////////////////////////

    if (params.batch_mode === true) {
      createScheme.mode = "batch";
      createScheme.iterations = params.batch_number;
      createScheme.iteration_units = params.product_units;
      createScheme.iteration_price = getContractPrice(
        "batch",
        PRODUCT.price,
        params.product_discount,
        params.product_units
      );
      createScheme.iteration_collateral = getContractCollateral(
        "batch",
        PRODUCT.collateral,
        params.product_units
      );
      createScheme.product_discount = params.product_discount;
    }

    if (params.batch_mode === false) {
      createScheme.mode = "unit";
      createScheme.iterations = params.product_units;
      createScheme.iteration_units = 1;
      createScheme.iteration_price = getContractPrice(
        "unit",
        PRODUCT.price,
        params.product_discount,
        params.product_units
      );
      createScheme.iteration_collateral = PRODUCT.collateral;
      createScheme.product_discount = 0;
    }

    console.log(createScheme);

    ///////////////////////////////

    const schemeData = `
    INSERT INTO slots (
      id,
      mode,
      seller_id,
      contract_id,
      contract_wid,
      contract_units,
      contract_price,
      contract_collateral,
      product_id,
      product_price,
      product_collateral,
      product_discount,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (let acc = 0; acc < createScheme.iterations; acc++) {
      const contractInstance = await API.post(
        "/api/contract/activate",
        instanceScheme
      )
        .then((res) => {
          assert.ok(res.data.hasOwnProperty("unContractInstanceId"));
          return res.data.unContractInstanceId;
        })
        .catch(() => {
          throw new Error("CID_FAILED");
        });

      const schemeValue = [
        "S" + getSlotId(),
        createScheme.mode,
        SELLER.id,
        contractInstance,
        params.wallet_id,
        createScheme.iteration_units,
        createScheme.iteration_price,
        createScheme.iteration_collateral,
        PRODUCT.id,
        PRODUCT.price,
        PRODUCT.collateral,
        createScheme.product_discount,
        0,
      ];

      console.log(schemeValue);
      await connection.execute(schemeData, schemeValue);
    }

    //////////////////////////

    await connection.commit();

    sendEvent(SELLER.id, "slot:created");

    res.status(200).send({ success: true });
  } catch (err: any) {
    await connection.rollback();

    throw new BadRequestError(err.message);
  } finally {
    connection.release();
  }
};

export { createSlotMiddlewares, createSlotHandler };
