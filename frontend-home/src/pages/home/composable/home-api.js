import { useStore } from "vuex";
import { computed } from "vue";

const homeAPI = () => {
  const store = useStore();


  const action__getAllProducts = async (params) =>
    await store.dispatch("home/action__getAllProducts", params);

  const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

  return {
    getter__allProducts: computed(
      () => store.getters["home/getter__allProducts"]
    ),
    action__getAllProducts,
    sleep,
  };
};

export default homeAPI;
