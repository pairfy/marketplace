import axiosAPI from "@/api/axios-api";

const getOrder = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get(`/api/gateway/get-order/${params.id}`);

    commit("getOrder", response.data.payload);

    return { success: true, response: response.data };
  } catch (error) {
    return { success: false, response: error.response.data };
  }
};

const deploy = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/deploy", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const deployTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/deploy-tx", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const shipping = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/shipping", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const shippingTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/shipping-tx", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const return_ = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/return", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const returnTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/return-tx", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const cancel = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/cancel", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const cancelTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/cancel-tx", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const returnable = async ({ commit }, params) => {
  commit("returnable", params);
};

export {
  getOrder,
  deploy,
  deployTx,
  cancel,
  cancelTx,
  returnTx,
  return_,
  returnable,
  shipping,
  shippingTx,
};
