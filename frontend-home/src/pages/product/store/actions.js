import axiosApi from "@/api/axios-api";

const lockingEndpoint = async (_, params) => {
  try {
    console.log(params);
    const response = await axiosApi.post("/api/gate/locking-endpoint", params);

    console.log(response.data);

    //commit("lockingEndpoint", response.data);

    return { ok: true, response: response.data };
  } catch (error) {
    throw { ok: false, response: error.response.data };
  }
};

export { lockingEndpoint };
