import axiosApi from "@/api/axios-api";

const lockingEndpoint = async (_, params) => {
  try {
    const response = await axiosApi.post("/api/gate/locking-endpoint", params);

    console.log(response.data);

    //commit("lockingEndpoint", response.data);

    return { ok: true, response: response.data };
  } catch (error) {
    return { ok: false, response: error.response.data };
  }
};


const lockingTx = async (_, params) => {
  try {
    const response = await axiosApi.post("/api/gate/locking-tx", params);

    console.log(response.data);

    //commit("lockingEndpoint", response.data);

    return { success: true, response: response.data };
  } catch (error) {
    return { success: false, response: error.response.data };
  }
};
const getOrders = async ({ commit }, params) => {
  try {
    const response = await axiosApi.get(`/api/gate/buy-options/${params.id}`);

    commit("getOrders", response.data.payload[0]);

    return { success: true, response: response.data };
  } catch (error) {
    return{ success: false, response: error.response.data };
  }
};

const getProduct = async ({ commit }, params) => {
  try {
    const query = `
    query Product($id: String) {
      product(id: $id) {
        id
        seller_id
        name
        model
        features
        terms_of_sale
        guarantee
        category
        price
        collateral
        discount
        stock
        keywords
        media_url
        media_path
        image_main
        image_set
        video_set
      }
    }
  `;

    const variables = {
      id: params.id,
    };

    const response = await axiosApi.post("/api/query", {
      query,
      variables,
    });

    console.log(response.data.data.product[0]);

    commit("getProduct", response.data.data.product[0]);

    return { success: true, response: response.data };
  } catch (error) {
    return { success: false, response: error.response.data };
  }
};

export { lockingEndpoint, getProduct, getOrders, lockingTx };
