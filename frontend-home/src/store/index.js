import { createStore } from "vuex";
import { home } from "@/pages/home/store";
import { product } from "@/pages/product/store";

const stores = createStore({
  modules: {
    home,
    product
  },
});

export { stores };
