import DB from "../db";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { getOrderId } from "../utils/nano";
import { sellerMiddleware } from "../utils/seller";
import { requireAuth } from "../utils/required";
import { getContractCollateral, getContractPrice } from "../utils/other";
import { _ } from "../utils/pino";

const ADA_LOVELACE = 1000000;
///////////////////////////////////////////////TYPES

interface CreateScheme {
  mode: string;
  iterations: number;
  iteration_units: number;
  iteration_price: number;
  iteration_collateral: number;
  product_discount: number;
}

///////////////////////////////////////////////MIDDLEWARES

const createOrderMiddlewares: any = [sellerMiddleware, requireAuth];

///////////////////////////////////////////////

/**HANDLER: create product orders*/
const createOrderHandler = async (req: Request, res: Response) => {
  let connection: any = null;

  const params = req.body;

  const SELLER = req.sellerData;

  let scheme: CreateScheme = {
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
      [params.product_id, SELLER.id],
    );

    if (products.length === 0) {
      throw new BadRequestError("NO_PRODUCT");
    }

    const PRODUCT = products[0];

    ///////////////////////////////

    if (params.batch_mode === true) {
      scheme.mode = "batch";
      scheme.iterations = params.batch_number;
      scheme.iteration_units = params.product_units;
      scheme.iteration_price = getContractPrice(
        "batch",
        PRODUCT.price,
        params.product_discount,
        params.product_units,
      );
      scheme.iteration_collateral = getContractCollateral(
        "batch",
        PRODUCT.collateral,
        params.product_units,
      );
      scheme.product_discount = params.product_discount;
    }

    if (params.batch_mode === false) {
      scheme.mode = "unit";
      scheme.iterations = params.product_units;
      scheme.iteration_units = 1;
      scheme.iteration_price = ADA_LOVELACE * PRODUCT.price;
      scheme.iteration_collateral = ADA_LOVELACE * PRODUCT.collateral;
      scheme.product_discount = 0;
    }

    ///////////////////////////////

    const schemeData = `
    INSERT INTO orders (
      id,
      mode,
      seller_id,
      contract_units,
      contract_price,
      contract_collateral,
      product_id,
      product_discount,
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    console.log(scheme);

    for (let i = 0; i < scheme.iterations; i++) {
      try {
        const schemeValue = [
          getOrderId(),
          scheme.mode,
          SELLER.id,
          scheme.iteration_units,
          scheme.iteration_price,
          scheme.iteration_collateral,
          PRODUCT.id,
          scheme.product_discount,
          0,
        ];

        await connection.execute(schemeData, schemeValue);
      } catch (err) {
        console.error(err);
        throw new BadRequestError("FAILED");
      }
    }

    await connection.commit();

    res.status(200).send({ success: true });
  } catch (err: any) {
    _.error(err);

    await connection.rollback();

    res.status(404).send({ success: false });
  } finally {
    connection.release();
  }
};

export { createOrderHandler, createOrderMiddlewares };
