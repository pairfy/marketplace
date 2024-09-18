function stringToTimestamp(date: string) {
  return date.replace("T", " ").replace("Z", "");
}
const ADA_LOVELACE = 1000000;

function getContractPrice(
  mode: string,
  productPrice: number,
  productDiscount: number,
  productUnits: number,
): number {
  if (mode === "unit") {
    return productPrice;
  }

  if (mode === "batch") {
    let discountMount = productPrice * (productDiscount / 100);

    let discountPrice = productPrice - discountMount;

    let totalPrice = discountPrice * productUnits;

    return ADA_LOVELACE * totalPrice;
  }

  return 0;
}

function getContractCollateral(
  mode: string,
  productCollateral: number,
  productUnits: number,
): number {
  if (mode === "unit") {
    return productCollateral;
  }

  if (mode === "batch") {
    let totalCollateral = productCollateral * productUnits;

    return  ADA_LOVELACE * totalCollateral;
  }

  return 0;
}

export { getContractCollateral, getContractPrice, stringToTimestamp };
