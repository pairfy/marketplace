import { Wallet } from "@cardano-foundation/cardano-connect-with-wallet-core";

import * as CardanoWasm from "@emurgo/cardano-serialization-lib-browser";

const Buffer = require('buffer/').Buffer

const walletAPI = () => {
  return {
    setup,
    stop,
    connect,
  };
};

const connect = async (walletName) => {
  await Wallet.connect(walletName, "testnet", () => {
    console.log("connect call");
    window.cardano.enable();
  });
};

const setup = () => {
  Wallet.addEventListener("enabled", async (e) => {
    console.log("enabled", e, await window.cardano.isEnabled());
  });
  Wallet.addEventListener("connecting", (e) => {
    console.log("connecting", e);
  });

  Wallet.addEventListener("connected", (e) => {
    console.log("connected", e);
  });

  Wallet.addEventListener("enabledWallet", async (e) => {
    console.log("enabledW", e, await window.cardano.isEnabled());
  });

  Wallet.addEventListener("accountBalance", (e) => {
    console.log("balance", e);
  });

  Wallet.startInjectWalletListener();
};

const stop = () => {
  Wallet.disconnect();

  Wallet.removeEventListener("enabled", (e) => {
    console.log("enabled", e);
  });
  Wallet.removeEventListener("connecting", (e) => {
    console.log("connecting", e);
  });

  Wallet.removeEventListener("connected", (e) => {
    console.log("connected", e);
  });

  Wallet.removeEventListener("enabledWallet", (e) => {
    console.log("enabledw", e);
  });

  Wallet.removeEventListener("accountBalance", (e) => {
    console.log("balance", e);
  });

  Wallet.stopInjectWalletListener();
};

const balanceTx = (unbalancedTx) => {
  return Promise.all([
    window.cardano.getChangeAddress(),
    window.cardano.getUtxos(),
    fetchProtocolParameters(),
  ]).then(async (promises) => {
    const changeAddrCbor = promises[0];

    console.log(typeof changeAddrCbor);

    const changeAddrBech32 = CardanoWasm.Address.from_bytes(
      fromHexString(changeAddrCbor)
    ).to_bech32();

    const utxosCbor = promises[1];

    const utxos = utxosCbor.map((cbor) =>
      CardanoWasm.TransactionUnspentOutput.from_bytes(fromHexString(cbor))
    );

    const pp = promises[2];

    const utx = CardanoWasm.Transaction.from_bytes(fromHexString(unbalancedTx));

    const txBody = await buildTx(
      { paymentAddr: changeAddrBech32 },
      utxos,
      utx.body().outputs(),
      pp
    );

    /////////////
  

    const transactionWitnessSet = CardanoWasm.TransactionWitnessSet.new();

    const tx = CardanoWasm.Transaction.new(
      txBody,
      CardanoWasm.TransactionWitnessSet.from_bytes(
        transactionWitnessSet.to_bytes()
      )
    );
    console.log("yes");
    let txVkeyWitnesses = await window.cardano.signTx(
      Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
      true
    );

    txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(
      Buffer.from(txVkeyWitnesses, "hex")
    );

    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    const signedTx = CardanoWasm.Transaction.new(
      tx.body(),
      transactionWitnessSet
    );

    return window.cardano.submitTx(
      Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
    );
  });
};

const WEIGHTS = Uint32Array.from([
  200, // weight ideal > 100 inputs
  1000, // weight ideal < 100 inputs
  1500, // weight assets if plutus
  800, // weight assets if not plutus
  800, // weight distance if not plutus
  5000, // weight utxos
]);

/**const TX = {
  invalid_hereafter: 3600 * 6, //6h from current slot
};*/

const buildTx = async (
  account,
  utxos,
  outputs,
  protocolParameters,
  auxiliaryData = null
) => {
  const txBuilderConfig = CardanoWasm.TransactionBuilderConfigBuilder.new()
    .coins_per_utxo_byte(
      CardanoWasm.BigNum.from_str(protocolParameters.coinsPerUtxoWord)
    )
    .fee_algo(
      CardanoWasm.LinearFee.new(
        CardanoWasm.BigNum.from_str(protocolParameters.linearFee.minFeeA),
        CardanoWasm.BigNum.from_str(protocolParameters.linearFee.minFeeB)
      )
    )
    .key_deposit(CardanoWasm.BigNum.from_str(protocolParameters.keyDeposit))
    .pool_deposit(CardanoWasm.BigNum.from_str(protocolParameters.poolDeposit))
    .max_tx_size(protocolParameters.maxTxSize)
    .max_value_size(protocolParameters.maxValSize)
    .build();
  //.collateral_percentage(protocolParameters.collateralPercentage)
  //.max_collateral_inputs(protocolParameters.maxCollateralInputs)
  //.ex_unit_prices(CardanoWasm.ExUnitPrices)

  const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig);

  txBuilder.add_output(outputs.get(0));

  if (auxiliaryData) txBuilder.set_auxiliary_data(auxiliaryData);



  const utxosCore = CardanoWasm.TransactionUnspentOutputs.new();

  utxos.forEach((utxo) => utxosCore.add(utxo));

  txBuilder.add_inputs_from(
    utxosCore,
    CardanoWasm.Address.from_bech32(account.paymentAddr),
    WEIGHTS
  );

  txBuilder.add_change_if_needed(
    CardanoWasm.Address.from_bech32(account.paymentAddr)
  );


  return txBuilder.build();
};

const fetchProtocolParameters = () => {
  return fetch("https://cardano-preview.blockfrost.io/api/v0/blocks/latest", {
    headers: {
      project_id: "previewXgODba40jVJAs1QgKTBOAuwhvNFHHMVo",
    },
  })
    .then((res) => res.json())
    .then((latestBlock) => {
      return fetch(
        `https://cardano-preview.blockfrost.io/api/v0/epochs/${latestBlock.epoch}/parameters`,
        {
          headers: {
            project_id: "previewXgODba40jVJAs1QgKTBOAuwhvNFHHMVo",
          },
        }
      )
        .then((res) => res.json())
        .then((p) => {
          return {
            linearFee: {
              minFeeA: p.min_fee_a.toString(),
              minFeeB: p.min_fee_b.toString(),
            },
            minUtxo: "1000000", //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
            poolDeposit: p.pool_deposit,
            keyDeposit: p.key_deposit,
            coinsPerUtxoWord: "34482",
            maxValSize: 5000,
            priceMem: 5.77e-2,
            priceStep: 7.21e-5,
            maxTxSize: parseInt(p.max_tx_size),
            slot: parseInt(latestBlock.slot),
          };
        });
    });
};

const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

// padd with leading 0 if <16
//const i2hex = (i) => ("0" + i.toString(16)).slice(-2);

//const toHexString = (uint8) => Array.from(uint8).map(i2hex).join("");

export { walletAPI, CardanoWasm, balanceTx };
