import { searchProduct } from "./product/search.js";
import { getProduct } from "./product/page.js";
import { getAssetPrice } from "./price/index.js";


const products = {
  Query: {
    getProduct,
    searchProduct
  },
};

const assets = {
  Query: {
    getAssetPrice,
  },
};

export { products, assets };
