import axiosAPI from "@/api/axios-api";

const currentSeller = async ({ commit }) => {
  try {
    const response = await axiosAPI.get("/api/seller/current-seller");

    commit("currentSeller", response.data.sellerData);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { success: false, response: error.response.data };
  }
};

const currentUser = async ({ commit }) => {
  try {
    const response = await axiosAPI.get("/api/user/current-user");

    commit("currentUser", response.data.userData);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { success: false, response: error.response.data };
  }
};

const loginSeller = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post("/api/seller/login-seller", params);

    commit("currentSeller", response.data.data);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const loginUser = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post("/api/user/login-user", params);

    commit("currentUser", response.data.data);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const logoutSeller = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get("/api/seller/logout", params);

    commit("currentSeller", null);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const logoutUser = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get("/api/user/logout", params);

    commit("currentUser", null);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const displaySetupWallet = async ({ commit }, params) => {
  commit("displaySetupWallet", params);
};

const connectWallet = async ({ commit }, params) => {
  console.log(params);
  commit("connectWallet", params);
};

const startTx = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gate/start-tx", params);

    console.log(response);

    //commit("createProduct", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const setupLucid = async ({ commit }, data) => {
  commit("setupLucid", data);
};

export {
  logoutUser,
  currentUser,
  connectWallet,
  setupLucid,
  startTx,
  currentSeller,
  loginSeller,
  displaySetupWallet,
  logoutSeller,
  loginUser,
};
