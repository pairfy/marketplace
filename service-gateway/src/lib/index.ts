async function getContractPrice(
  discount: boolean,
  discountValue: number,
  productPrice: number,
  productUnits: number,
  adaPrice: number
) {
  try {
    let response = null;

    if (productUnits <= 0) {
      throw new Error("productUnits negative");
    }

    /////////////////////////////////////////////

    if (discount) {
      const newPrice = applyDiscount(productPrice, discountValue);

      const totalPrice = newPrice * productUnits;

      response = convertUSDToLovelace(totalPrice, adaPrice);
    } else {
      const totalPrice = productPrice * productUnits;

      response = convertUSDToLovelace(totalPrice, adaPrice);
    }

    return response;
  } catch (err) {
    throw err;
  }
}

function applyDiscount(
  productPrice: number,
  productDiscountValue: number
): number {
  if (productPrice < 0) {
    throw new Error("Product price must be non-negative");
  }

  if (productDiscountValue < 0 || productDiscountValue > 100) {
    throw new Error("Discount percentage must be between 0 and 100");
  }

  const discountAmount = (productPrice * productDiscountValue) / 100;

  const discountedPrice = productPrice - discountAmount;

  return Math.trunc(discountedPrice);
}

/**
 * Converts USD to Lovelace.
 * @param {number} usdAmount - The amount in USD to convert.
 * @param {number} adaPrice - The price of 1 ADA in USD.
 * @returns {number} The converted Lovelace amount as a number.
 */
function convertUSDToLovelace(usdAmount: number, adaPrice: number): number {
  if (usdAmount < 0) {
    throw new Error("USD amount cannot be negative.");
  }

  if (adaPrice <= 0) {
    throw new Error("ADA price must be greater than 0.");
  }

  const amountInADA = usdAmount / adaPrice;

  const amountInLovelace = amountInADA * 1_000_000;

  return Math.round(amountInLovelace);
}

async function getContractCollateral(
  productCollateral: number,
  productUnits: number,
  adaPrice: number
) {
  try {
    if (productCollateral < 0) {
      throw new Error("USD amount cannot be negative.");
    }

    if (productUnits <= 0) {
      throw new Error("productUnits negative");
    }

    const total = productCollateral * productUnits;

    return convertUSDToLovelace(total, adaPrice);
  } catch (err) {
    throw err;
  }
}

export { getContractPrice, getContractCollateral };
