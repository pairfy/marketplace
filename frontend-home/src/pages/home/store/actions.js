import axiosApi from "@/api/axios-api";


const action__getAllProducts = async ({ commit }) => {
  try {
    
    const response = await axiosApi.get("/api/store/get-all-products");

    commit("commit__getAllProducts", response.data);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};




export { action__getAllProducts };
