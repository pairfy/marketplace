import { createStore } from "vuex";
import { dashboard } from "@/pages/dashboard/store";
import { entry } from "@/pages/entry/store";

const stores = createStore({
  modules: {
    dashboard,
    entry
  },
});

export { stores };
