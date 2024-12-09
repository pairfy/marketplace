import { Wallet } from "@cardano-foundation/cardano-connect-with-wallet-core";

import * as CardanoWasm from "@emurgo/cardano-serialization-lib-browser";

import { Lucid } from "lucid-cardano";

const Buffer = require("buffer/").Buffer;

let connectedWallet = null;

const lucidClient = await Lucid.new();

const walletEnabledEvent = new CustomEvent("walletEnabledEvent", {
  detail: {
    payload: "wallet enabled",
  },
});

const walletClient = () => {
  return {
    startWalletService,
    stopWalletService,
    connect,
    reconnect,
    getWallet,
  };
};

const getWallet = async () => {
  if (!connectedWallet) {
    await reconnect();
  }

  return connectedWallet;
};

const connect = async (walletName) => {
  await Wallet.connect(walletName, "testnet", async () => {
    connectedWallet = await window.cardano[walletName].enable();

    localStorage.setItem("pairfy-wallet", walletName);

    console.log("CONNECTED " + walletName);
  });
};

const reconnect = async () => {
  const walletName = localStorage.getItem("pairfy-wallet");

  if (walletName !== null) {
    await connect(walletName);
    console.log("RECONNECTED " + walletName);
  } else {
    return false;
  }
};

const getAddress = async () => {
  if (!connectedWallet) {
    await reconnect();
  }

  const address = await connectedWallet.getUsedAddresses();

  return address[0];
};

const getMessage = () => {
  const message = "PLEASE SIGN TO AUTHENTICATE IN PAIRFY";

  return Buffer.from(message, "utf8").toString("hex");
};

const signMessage = async () => {
  if (!connectedWallet) {
    await reconnect();
  }

  return await connectedWallet.signData(await getAddress(), getMessage());
};

const startWalletService = async () => {
  Wallet.addEventListener("enabledWallet", async (walletName) => {
    const isEnabled = await window.cardano[walletName].isEnabled();

    if (isEnabled) {
      localStorage.setItem("pairfy-wallet", walletName);

      window.dispatchEvent(walletEnabledEvent);

      console.info("ENABLED_WALLET", walletName);
    }
  });

  Wallet.startInjectWalletListener();

  await reconnect();
};

const stopWalletService = () => {
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


const balanceTx = async (unbalancedTx) => {
  const utx = CardanoWasm.Transaction.from_hex(unbalancedTx);

  const tx = CardanoWasm.Transaction.new(utx.body(), utx.witness_set());

  let txVkeyWitnesses = await connectedWallet.signTx(
    Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
    true
  );

  txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(
    Buffer.from(txVkeyWitnesses, "hex")
  );

  const newTransactionWitnessSet = utx.witness_set();

  newTransactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

  const signedTx = CardanoWasm.Transaction.new(
    tx.body(),
    newTransactionWitnessSet
  );

  console.log("NEWBODY", signedTx.to_json());

  return connectedWallet.submitTx(
    Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
  );
};


export {
  walletClient,
  CardanoWasm,
  balanceTx,
  lucidClient,
  signMessage,
  getAddress,
  getMessage,
};
