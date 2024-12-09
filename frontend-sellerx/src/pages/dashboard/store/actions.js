import axiosAPI from "@/api/axios-api";
import { HOST } from "@/api";

const createProduct = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/product/create-product", params);

    //commit("createProduct", response.data.payload);

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


const deployTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/deploy-tx", params);

    console.log(response);


    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const createImages = async (_, params) => {
  try {
    const response = await fetch(HOST + "/api/media/create-image", {
      method: "POST",
      body: params,
      credentials: "include",
    });

    //"Content-Type": "multipart/form-data"

    return { ok: true, response: await response.json() };
  } catch (error) {
    throw { ok: false, response: error.response };
  }
};

const deploy = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/deploy", params);

    console.log(response);
    
    //commit("deploy", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const setupLucid = async ({ commit }, data) => {
  commit("setupLucid", data);
};

const createOrder = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gateway/create-order", params);

    //commit("createOrder", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const getProducts = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get("/api/product/get-products", params);

    commit("getProducts", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const getOrders = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get("/api/gateway/get-orders", params);

    commit("getOrders", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

export {
  deploy,
  setupLucid,
  createProduct,
  cancel,
  cancelTx,
  createImages,
  deployTx,
  getProducts,
  createOrder,
  getOrders,
};
