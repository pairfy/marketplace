import { useStore } from "vuex";
import { computed } from "vue";

const productAPI = () => {
  const store = useStore();

  const lockingEndpoint = async (params) =>
    await store.dispatch("product/lockingEndpoint", params);

  const lockingTx = async (params) =>
    await store.dispatch("product/lockingTx", params);

  const getOrders = async (params) =>
    await store.dispatch("product/getOrders", params);

  const getProduct = async (params) =>
    await store.dispatch("product/getProduct", params);

  const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

  return {
    lockingEndpoint,
    getProduct,
    getOrders,
    lockingTx,
    getProductData: computed(() => store.getters["product/getProductData"]),
    getOrdersData: computed(() => store.getters["product/getOrdersData"]),
    sleep,
  };
};

export default productAPI;
