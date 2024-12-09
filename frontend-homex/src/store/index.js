import { createStore } from "vuex";
import { home } from "@/pages/home/store";
import { product } from "@/pages/product/store";
import { header } from "@/components/header/store";
import { session } from "@/pages/session/store";


const stores = createStore({
  modules: {
    home,
    product,
    header,
    session
  },
});

export { stores };
