import { getProduct, getProducts } from "./handlers/get.js";
import { createProduct } from "./handlers/create.js";
import { updateProduct } from "./handlers/update.js";
import { deleteProduct } from "./handlers/delete.js";

const products = {
  Query: {
    getProducts,
    getProduct,
  },
  Mutation: {
    createProduct,
    updateProduct,
    deleteProduct,
  },
};

export { products };
