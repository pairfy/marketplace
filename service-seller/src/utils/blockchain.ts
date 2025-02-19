import Cardano from "@emurgo/cardano-serialization-lib-nodejs";

export const getPubKeyHash = (address: any): string => {
  let baseAddr = Cardano.BaseAddress.from_address(address);

  if (baseAddr) {
    const pkh = baseAddr.payment_cred().to_keyhash();

    if (pkh) {
      return pkh.to_hex();
    } 
  }

  return "N/A";

};
