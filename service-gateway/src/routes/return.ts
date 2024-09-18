import DB from "../db";
import { Blaze, ColdWallet, Core, Data, makeValue } from "@blaze-cardano/sdk";
import { Request, Response } from "express";
import { userMiddleware } from "../utils/user";
import { provider } from "../blockchain";
import { BadRequestError } from "../errors";
import { MarketplaceStatemachine } from "../blockchain/plutus";
import { _ } from "../utils/pino";
import { unixToSlot } from "../utils/blockchain";

const returnMiddlewares: any = [userMiddleware];

const returnHandler = async (req: Request, res: Response) => {
  const params = req.body;

  const BUYER = req.userData;

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

    if (ORDER.contract_range > Date.now()) {
      throw new Error("SHIPPING_RANGE");
    }

    /////////////////////

    const externalWallet = Core.addressFromBech32(
      BUYER.address,
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
      throw new Error("NO_THREADTOKEN_UTXO");
    }

    if (threadTokenUtxos.length > 1) {
      throw new Error("THREADTOKEN_QUANTITY");
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

    const returnInput = "Return";

    const stateMachineRedeemer = Data.to(returnInput, stateMachineInput);

    const stateMachineScript = new MarketplaceStatemachine(threadTokenPolicyId);

    const productPrice = BigInt(ORDER.contract_price);

    const productCollateral = BigInt(ORDER.contract_collateral);

    const threadTokenAsset = makeValue(productCollateral, [
      threadTokenUnit,
      1n,
    ]);

    const minFee = 1n * 1_000_000n;

    const data = {
      state: 0n,
      seller: ORDER.seller_pubkeyhash,
      collateral: productCollateral,
      price: productPrice,
      buyer: null,
      range: null,
    };

    const Datum = Data.Object({
      state: Data.Integer(),
      seller: Data.Bytes(),
      collateral: Data.Integer(),
      price: Data.Integer(),
      buyer: Data.Nullable(Data.Bytes()),
      range: Data.Nullable(Data.Integer()),
    });

    const returnDatum = Data.to(data, Datum);

    const laterTime = Date.now() + 1 * 60 * 60 * 1000;

    const tx = await blaze
      .newTransaction()
      .addInput(threadTokenUtxos[0], stateMachineRedeemer)
      .lockAssets(stateMachineAddress, threadTokenAsset, returnDatum)
      .payLovelace(externalWallet, productPrice)
      .provideScript(stateMachineScript)
      .addRequiredSigner(Core.Ed25519KeyHashHex(BUYER.pubkeyhash))
      .setValidFrom(unixToSlot(Core.SLOT_CONFIG_NETWORK.Preprod, Date.now()))
      .setValidUntil(unixToSlot(Core.SLOT_CONFIG_NETWORK.Preprod, laterTime))
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
    await connection.rollback();

    _.error(err);

    throw new BadRequestError(err.message);
  } finally {
    connection.release();
  }
};

export { returnHandler, returnMiddlewares };
