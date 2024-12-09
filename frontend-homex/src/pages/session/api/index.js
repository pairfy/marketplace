import { useStore } from "vuex";
import { computed } from "vue";

const sessionAPI = () => {
  const store = useStore();

  const getOrder = async (params) =>
    await store.dispatch("session/getOrder", params);

  const deploy = async (params) =>
    await store.dispatch("session/deploy", params);

  const deployTx = async (params) =>
    await store.dispatch("session/deployTx", params);

  const return_ = async (params) =>
    await store.dispatch("session/return_", params);

  const returnTx = async (params) =>
    await store.dispatch("session/returnTx", params);

  const cancel = async (params) =>
    await store.dispatch("session/cancel", params);

  const cancelTx = async (params) =>
    await store.dispatch("session/cancelTx", params);

  const shipping = async (params) =>
    await store.dispatch("session/shipping", params);

  const shippingTx = async (params) =>
    await store.dispatch("session/shippingTx", params);

  const returnable = async (params) =>
    await store.dispatch("session/returnable", params);

  return {
    getOrder,
    deploy,
    deployTx,
    cancel,
    cancelTx,
    shipping,
    shippingTx,
    return_,
    returnTx,
    returnable,
    getOrderData: computed(() => store.getters["session/getOrderData"]),
    getReturnable: computed(() => store.getters["session/getReturnable"]),
  };
};

export { sessionAPI };
