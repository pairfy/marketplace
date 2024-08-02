import axiosApi from "@/api/axios-api";

const getTimeline = async ({ commit }) => {
  try {
    const query = `
    query Timeline {
      timeline {
        id
        name
        category
        price
        collateral
        discount
        stock
        media_url
        media_path
        image_main
      }
    }
  `;

    const response = await axiosApi.post("/api/query", {
      query,
    });

    console.log(response.data);

    commit("getTimeline", response.data.data);

    return { success: true, response: response.data };
  } catch (error) {
    return { success: false, response: error.response };
  }
};

export { getTimeline };
