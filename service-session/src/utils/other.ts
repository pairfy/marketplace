function stringToTimestamp(date: string) {
  return date.replace("T", " ").replace("Z", "");
}

function getContractPrice(
  mode: string,
  productPrice: number,
  productDiscount: number,
  productUnits: number
): number {
  if (mode === "unit") {
    return productPrice;
  }

  if (mode === "batch") {
    let discountMount = productPrice * (productDiscount / 100);

    let discountPrice = productPrice - discountMount;

    let totalPrice = discountPrice * productUnits;

    return Math.floor(totalPrice);
  }

  return 0;
}

function getContractCollateral(
  mode: string,
  productCollateral: number,
  productUnits: number
): number {
  if (mode === "unit") {
    return productCollateral
  }

  if (mode === "batch") {
    let totalCollateral = productCollateral * productUnits;

    return Math.floor(totalCollateral);
  }

  return 0;
}

export { stringToTimestamp, getContractPrice, getContractCollateral };
