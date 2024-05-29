import { useStore } from "vuex";


const productAPI = () => {
  const store = useStore();

  const lockingEndpoint = async (params) =>
    await store.dispatch("product/lockingEndpoint", params);

  const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

  return {
    lockingEndpoint,
    sleep,
  };
};

export default productAPI;
