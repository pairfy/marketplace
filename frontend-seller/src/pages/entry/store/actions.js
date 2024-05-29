import axiosAPI from "@/api/axios-api";

const createUser = async (_,params) => {
  try {
    const response = await axiosAPI.post("/api/seller/create-seller", params);

    console.log(response);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const loginUser = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post("/api/seller/login-seller", params);

    console.log(response);

    commit("userData", response.data);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

const getUser = async ({ commit }) => {
  try {
    const response = await axiosAPI.get("/api/seller/current-seller");

    commit("userData", response.data.sellerData);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};
export { createUser, loginUser, getUser };
