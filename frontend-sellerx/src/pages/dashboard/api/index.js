import { useStore } from "vuex";
import { computed } from "vue";

const dashboardAPI = () => {
  const store = useStore();

  const fetchProductData = async (params) =>
    await store.dispatch("dashboard/fetchProductData", params);

  const createProduct = async (params) =>
    await store.dispatch("dashboard/createProduct", params);

  const cancel = async (params) =>
    await store.dispatch("dashboard/cancel", params);

  const cancelTx = async (params) =>
    await store.dispatch("dashboard/cancelTx", params);

  const deployTx = async (params) =>
    await store.dispatch("dashboard/deployTx", params);

  const createImages = async (params) =>
    await store.dispatch("dashboard/createImages", params);

  const createOrder = async (params) =>
    await store.dispatch("dashboard/createOrder", params);

  const deploy = async (params) =>
    await store.dispatch("dashboard/deploy", params);

  const getProducts = async (params) =>
    await store.dispatch("dashboard/getProducts", params);

  const getOrders = async (params) =>
    await store.dispatch("dashboard/getOrders", params);

  const setupLucid = async (data) =>
    await store.dispatch("dashboard/setupLucid", data);

  const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

  return {
    getProductsData: computed(() => store.getters["dashboard/getProductsData"]),
    getOrdersData: computed(() => store.getters["dashboard/getOrdersData"]),
    getLucid: computed(() => store.getters["dashboard/getLucid"]),
    fetchProductData,
    createProduct,
    deploy,
    cancel,
    cancelTx,
    getProducts,
    createOrder,
    setupLucid,
    createImages,
    getOrders,
    deployTx,
    sleep,
  };
};

export default dashboardAPI;
