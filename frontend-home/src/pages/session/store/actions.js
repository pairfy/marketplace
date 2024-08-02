import axiosAPI from "@/api/axios-api";

const getSlot = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get(`/api/gate/get-slot/${params.id}`);

    commit("getSlot", response.data.payload);

    return { success: true, response: response.data };
  } catch (error) {
    return { success: false, response: error.response.data };
  }
};


const startEndpoint = async (_, params) => {
  try {
    const response = await axiosAPI.post("/api/gate/start-endpoint", params);

    console.log(response);
    //commit("startEndpoint", response.data.payload);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

export { getSlot, startEndpoint};
