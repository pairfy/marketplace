import { createStore } from "vuex";
import { product } from "@/views/product/store/index";
import { header } from "@/components/header/store";
import { order } from "@/views/order/store";

const stores = createStore({
  modules: {
    product,
    header,
    order
  },
});

export { stores };
