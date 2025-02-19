import axiosAPI from '@/api/axios'

const getArrivalDate = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post('/api/matrix/arrival-date', params)

    commit('getArrivalDate', response.data.payload)

    return { ok: true, response: response.data }
  } catch (error) {
    return { ok: false, response: error.response.data }
  }
}

const setProductData = async ({ commit }, params) => {
  commit('setProductData', params)
}

export {
  setProductData,
  getArrivalDate
}
