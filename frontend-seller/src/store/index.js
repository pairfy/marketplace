import { createStore } from "vuex";
import { dashboard } from "@/views/store/index";

const stores = createStore({
  modules: {
    dashboard
  },
});

export { stores };
