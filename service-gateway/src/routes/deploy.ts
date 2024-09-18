import DB from "../db";
import {
  Blaze,
  ColdWallet,
  Core,
  Data,
  makeValue,
  Static,
} from "@blaze-cardano/sdk";
import { Request, Response } from "express";
import { requireAuth } from "../utils/required";
import { sellerMiddleware } from "../utils/seller";
import { BadRequestError } from "../errors";
import { provider, validatorsWithParams } from "../blockchain";
import { _ } from "../utils/pino";

////////////////////////////////////////////////////

const deployMiddlewares: any = [sellerMiddleware, requireAuth];

////////////////////////////////////////////////////

const deployHandler = async (req: Request, res: Response) => {
  let connection: any = null;

  const params = req.body;

  const SELLER = req.sellerData;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const [orders] = await connection.execute(
      "SELECT * FROM orders WHERE id = ? AND seller_id = ?",
      [params.order_id, SELLER.id],
    );

    if (orders.length === 0) {
      throw new Error("NO_ORDER");
    }

    const ORDER = orders[0];

    /////////////////////////////////////////////////////////////////

    const externalWallet = Core.addressFromBech32(
      params.address,
    );

    const wallet = new ColdWallet(
      externalWallet,
      Core.NetworkId.Testnet,
      provider,
    );

    const blaze = await Blaze.from(provider, wallet);

    const externalWalletUtxos = await blaze.provider.getUnspentOutputs(
      externalWallet,
    );

    if (externalWalletUtxos.length < 1) {
      throw new Error("NO_UTXOS");
    }

    const utxo = externalWalletUtxos[0];

    const outRef = {
      transactionId: { hash: utxo.input().transactionId() },
      outputIndex: utxo.input().index(),
    };

    const tokenName = "threadtoken";

    const assetName = Buffer.from(tokenName, "utf8").toString("hex");

    const parameterizedValidators = validatorsWithParams(assetName, outRef);

    const policyId = Core.PolicyId(parameterizedValidators.threadTokenPolicyId);

    const threadTokenUnit = policyId + assetName;

    const Datum = Data.Object({
      state: Data.Integer(),
      seller: Data.Bytes(),
      collateral: Data.Integer(),
      price: Data.Integer(),
      buyer: Data.Nullable(Data.Bytes()),
      range: Data.Nullable(Data.Integer())
    });

    type Datum = Static<typeof Datum>;

    const data: Datum = {
      state: 0n,
      seller: params.pubkeyhash,
      collateral: BigInt(ORDER.contract_collateral),
      price: BigInt(ORDER.contract_price),
      buyer: null,
      range: null
    };

    const stateMachineDatum = Data.to(data, Datum);

    const threadTokenInput = Core.PlutusData.newConstrPlutusData(
      new Core.ConstrPlutusData(0n, new Core.PlutusList()),
    );

    const threadTokenAsset = makeValue(
      BigInt(ORDER.contract_collateral),
      [threadTokenUnit, 1n],
    );

    const tokenMap = new Map();

    tokenMap.set(assetName, 1n);

    const minFee = 1_000_000n;

    const tx = await blaze
      .newTransaction()
      .addInput(utxo)
      .addMint(policyId, tokenMap, threadTokenInput)
      .provideScript(parameterizedValidators.threadTokenScript)
      .lockAssets(
        parameterizedValidators.stateMachineAddress,
        threadTokenAsset,
        stateMachineDatum,
      )
      .addRequiredSigner(
        params.pubkeyhash,
      )
      .setChangeAddress(externalWallet)
      .setMinimumFee(minFee)
      .complete();

    const transaction = tx.toCbor();

    /////////////////////////////////////////////////////////////////

    const schemeData = `
      UPDATE orders 
      SET seller_pubkeyhash = ?,
          contract_address = ?,
          contract_threadtoken = ?,
          contract_unit = ?
      WHERE id = ? AND seller_id = ?
      `;

    const schemeValue = [
      params.pubkeyhash,
      parameterizedValidators.stateMachineAddress.toBech32(),
      policyId,
      threadTokenUnit,
      params.order_id,
      SELLER.id,
    ];

    await connection.execute(schemeData, schemeValue);

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

export { deployHandler, deployMiddlewares };
