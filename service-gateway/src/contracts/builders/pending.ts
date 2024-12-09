import {
  applyParamsToScript,
  applyDoubleCborEncoding,
  Constr,
  mintingPolicyToId,
  MintingPolicy,
  fromText,
  Data,
  SpendingValidator,
  validatorToAddress,
  paymentCredentialOf,
} from "@lucid-evolution/lucid";
import { lucid, validators } from "./index.js";

const NETWORK = "Preprod";

const PENDING_UNTIL = 15; // env minutes

/**Generates a CBOR transaction to be signed and sent in the browser by the buyer. */
async function pendingTransactionBuilder(
  externalWalletAddress: string,
  sellerPubKeyHash: string,
  contractPrice: bigint,
  contractCollateral: bigint,
  validUntil: bigint,
  pendingUntil: bigint,
  shippingUntil: bigint
) {
  const externalWalletUtxos = await lucid.utxosAt(externalWalletAddress);

  lucid.selectWallet.fromAddress(externalWalletAddress, externalWalletUtxos);

  const buyerPubKeyHash = paymentCredentialOf(externalWalletAddress).hash;
  ////////////////////////////////
  const minLovelace = contractPrice; //fee

  const findIndex = externalWalletUtxos.findIndex(
    (item) => item.assets.lovelace > minLovelace
  );

  const utxo = externalWalletUtxos[findIndex];

  const utxoRef = new Constr(0, [
    String(utxo.txHash),
    BigInt(utxo.outputIndex),
  ]);

  const tokenName = fromText("threadtoken");

  const threadTokenScript: MintingPolicy = {
    type: "PlutusV3",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validators.threadToken),
      [tokenName, utxoRef, validUntil]
    ),
  };

  const threadTokenPolicyId = mintingPolicyToId(threadTokenScript);

  const mintRedeemer = Data.to(new Constr(0, []));

  ///////////////////////////////////////

  const stateMachineScript: SpendingValidator = {
    type: "PlutusV3",
    script: applyParamsToScript(
      applyDoubleCborEncoding(validators.stateMachine),
      [
        threadTokenPolicyId,
        sellerPubKeyHash,
        buyerPubKeyHash,
        contractPrice,
        contractCollateral,
        pendingUntil
      ]
    ),
  };

  ////////////////////////////////////////////
  const datumValues = {
    state: BigInt(0)
  };

  const StateMachineDatum = Data.Object({
    state: Data.Integer()
  });

  type DatumType = Data.Static<typeof StateMachineDatum>;

  const DatumType = StateMachineDatum as unknown as DatumType;

  /*
  const getUTXObyunit = await lucid.utxoByUnit("4243c29b2d04e0ce751286f77fb40fd6749efec0ea45c4ac7e791caf746872656164746f6b656e");

  if (getUTXObyunit.datum) {
    console.log(getUTXObyunit);
    const datum = Data.from(getUTXObyunit.datum, StateMachineDatum);

    console.log(datum);
  }

  */

  const stateMachineDatum = Data.to(datumValues, DatumType);

  const stateMachineAddress = validatorToAddress(NETWORK, stateMachineScript);

  ////////////////////////////////////////////

  const assetUnit = threadTokenPolicyId + tokenName;

  const transaction = await lucid
    .newTx()
    .collectFrom([utxo])
    .mintAssets(
      {
        [assetUnit]: 1n,
      },
      mintRedeemer
    )
    .pay.ToAddressWithData(
      stateMachineAddress,
      {
        kind: "inline",
        value: stateMachineDatum,
      },
      {
        [assetUnit]: 1n,
        lovelace: contractPrice,
      }
    )
    .attach.MintingPolicy(threadTokenScript)
    .addSigner(externalWalletAddress)
    .validTo(Number(validUntil))
    .complete({
      changeAddress: externalWalletAddress,
      setCollateral: 1_000_000n,
      coinSelection: false,
      localUPLCEval: false,
    });

  const cbor = transaction.toCBOR();

  console.log("ThreadToken: ", threadTokenPolicyId);

  console.log("Unit: ", assetUnit);

  console.log("stateMachineAddress: ", stateMachineAddress);

  console.log("CBOR---------------------------------------");

  console.log(cbor);

  return {
    threadTokenPolicyId,
    stateMachineAddress,
    tokenName,
    cbor,
  };
}

function main() {
  const now = Date.now();

  const TX_VALID_TIME = 5; //tx valid until

  const WATCH_TX_WINDOW = 15; //Observation window limit for the detection of the first transaction

  const PENDING_UNTIL = 60; // 15minutes for the seller to accept;

  const SHIPPING_UNTIL = 1440; // 24h to shipping;

  ///////////////////////////////////////////////

  const validUntil = now + TX_VALID_TIME * 60 * 1000;

  const pendingUntil =
    now + (TX_VALID_TIME + WATCH_TX_WINDOW + PENDING_UNTIL * 60 * 1000);

  const shippingUntil =
    now +
    (TX_VALID_TIME +
      WATCH_TX_WINDOW +
      PENDING_UNTIL +
      SHIPPING_UNTIL * 60 * 1000);


  const externalWalletAddress =
    "addr_test1qz3rnekzh0t2nueyn4j6lmufc28pgu0dqlzjnmqxsjxvzs24qtjuxnphyqxz46t40nudnm3kxu8hkau2mq6nw7svg7jswruwy3";

  const contractPrice = 30 * 1_000_000;

  const contractCollateral = 10 * 1_000_000;

  const sellerPubKeyHash =
    "659fa0cf862b8460989af5f1200118a910ca04ae31b65aaa767d2b65";

  pendingTransactionBuilder(
    externalWalletAddress,
    sellerPubKeyHash,
    BigInt(contractPrice),
    BigInt(contractCollateral),
    BigInt(validUntil),
    BigInt(pendingUntil),
    BigInt(shippingUntil)
  );
}

//main();

export { pendingTransactionBuilder };

//two signature, collateral, validto, paramterice price, collateral, seller, buyer
