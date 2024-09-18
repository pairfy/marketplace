import DB from "../db";
import { Blaze, ColdWallet, Core, Data, makeValue } from "@blaze-cardano/sdk";
import { Request, Response } from "express";
import { userMiddleware } from "../utils/user";
import { provider } from "../blockchain";
import { BadRequestError } from "../errors";
import { MarketplaceStatemachine } from "../blockchain/plutus";
import { _ } from "../utils/pino";

const shippingMiddlewares: any = [userMiddleware];

const shippingHandler = async (req: Request, res: Response) => {
  const params = req.body;

  let connection: any = null;

  try {
    connection = await DB.client.getConnection();

    const [orders] = await connection.execute(
      "SELECT * FROM orders WHERE id = ?",
      [params.order_id],
    );

    if (orders.length === 0) {
      throw new Error("NO_ORDER");
    }

    const ORDER = orders[0];

    ///////////////

    const externalWallet = Core.addressFromBech32(
      params.address,
    );

    const stateMachineAddress = Core.addressFromBech32(
      ORDER.contract_address,
    );

    const wallet = new ColdWallet(
      externalWallet,
      Core.NetworkId.Testnet,
      provider,
    );

    const blaze = await Blaze.from(provider, wallet);

    const threadTokenUnit = ORDER.contract_unit;

    const assetId = Core.AssetId(threadTokenUnit);

    const threadTokenPolicyId = Core.AssetId.getPolicyId(assetId);

    const threadTokenUtxos = await provider.getUnspentOutputsWithAsset(
      stateMachineAddress,
      assetId,
    );

    if (threadTokenUtxos.length < 1) {
      throw new Error("NO_TT_UTXO");
    }

    if (threadTokenUtxos.length > 1) {
      throw new Error("TT_QUANTITY");
    }

    const stateMachineInput = Data.Enum([
      Data.Literal("Cancel"),
      Data.Object({
        Locking: Data.Object({
          buyer_param: Data.Bytes(),
          range_param: Data.Integer(),
        }),
      }),
      Data.Literal("Return"),
      Data.Literal("Shipping"),
      Data.Literal("Received"),
    ]);

    const shippingInput = "Shipping";

    const stateMachineRedeemer = Data.to(shippingInput, stateMachineInput);

    const stateMachineScript = new MarketplaceStatemachine(threadTokenPolicyId);

    const productPrice = BigInt(ORDER.contract_price);

    const productCollateral = BigInt(ORDER.contract_collateral);

    const threadTokenAsset = makeValue(productPrice + productCollateral, [
      threadTokenUnit,
      1n,
    ]);

    const minFee = 1n * 1_000_000n;

    const rangeParam = BigInt(ORDER.contract_range);

    const data = {
      state: 2n,
      seller: ORDER.seller_pubkeyhash,
      collateral: productCollateral,
      price: productPrice,
      buyer: ORDER.buyer_pubkeyhash,
      range: rangeParam
    };

    const Datum = Data.Object({
      state: Data.Integer(),
      seller: Data.Bytes(),
      collateral: Data.Integer(),
      price: Data.Integer(),
      buyer: Data.Nullable(Data.Bytes()),
      range: Data.Nullable(Data.Integer())
    });

    const shippingDatum = Data.to(data, Datum);

    const tx = await blaze
      .newTransaction()
      .addInput(threadTokenUtxos[0], stateMachineRedeemer)
      .lockAssets(stateMachineAddress, threadTokenAsset, shippingDatum)
      .provideScript(stateMachineScript)
      .addRequiredSigner(Core.Ed25519KeyHashHex(ORDER.seller_pubkeyhash))
      .setChangeAddress(externalWallet)
      .setMinimumFee(minFee)
      .complete();

    const transaction = tx.toCbor();

    await connection.commit();

    res.status(200).send({
      success: true,
      payload: {
        transaction,
      },
    });
  } catch (err: any) {
    console.log(err.message);
    
    await connection.rollback();

    _.error(err);

    throw new BadRequestError(err.message);
  } finally {
    connection.release();
  }
};

export { shippingHandler, shippingMiddlewares };
