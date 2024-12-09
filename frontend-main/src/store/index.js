import { createStore } from "vuex";
import { product } from "@/views/product/store/index";
import { header } from "@/components/header/store";

const stores = createStore({
  modules: {
    product,
    header 
  },
});

export { stores };
