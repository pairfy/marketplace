import countries from '@/assets/country.json'
import axiosAPI from '@/api/axios'
import { ref } from 'vue'

const countryData = ref(countries)

const currentSeller = async ({ commit }) => {
  try {
    const response = await axiosAPI.get('/api/seller/current-seller')

    const sellerData = response.data.sellerData

    if (sellerData) {
      commit('currentSeller', sellerData)
    }

    return { ok: true, response: response.data }
  } catch (error) {
    throw { success: false, response: error.response.data }
  }
}

const currentUser = async ({ commit }) => {
  try {
    const response = await axiosAPI.get('/api/user/current-user')

    const userData = response.data.userData

    if (userData) {
      commit('currentUser', userData)
    }

    return { ok: true, response: response.data }
  } catch (error) {
    throw { success: false, response: error.response.data }
  }
}

const getLocation = async ({ commit }, params) => {
  try {
    const currentLocation = localStorage.getItem('location')

    if (currentLocation) {
      return commit('setLocation', JSON.parse(currentLocation))
    }

    const response = await axiosAPI.post('/api/location/get-location', params)

    const scheme = {
      ...response.data.payload,
      name: countryData.value[response.data.payload.country],
    }

    console.log(scheme)

    commit('setLocation', scheme)

    return { ok: true, response: response.data }
  } catch (error) {
    throw { ok: false, response: error.response.data }
  }
}

const setLocation = async ({ commit }, params) => {
  commit('setLocation', scheme)
}
const loginSeller = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post('/api/seller/login-seller', params)

    commit('currentSeller', response.data.data)

    return { ok: true, response: response.data }
  } catch (error) {
    throw { ok: false, response: error.response.data }
  }
}

const loginUser = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post('/api/user/login-user', params)

    commit('currentUser', response.data.data)

    return { ok: true, response: response.data }
  } catch (error) {
    throw { ok: false, response: error.response.data }
  }
}

const logoutSeller = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.get('/api/seller/logout', params)

    commit('currentSeller', null)

    localStorage.removeItem('authToken')

    return { ok: true, response: response.data }
  } catch (error) {
    throw { ok: false, response: error.response.data }
  }
}

const logoutUser = async ({ commit }, params) => {
  try {
    localStorage.removeItem('enabled-wallet')

    const response = await axiosAPI.get('/api/user/logout', params)

    commit('currentUser', null)

    localStorage.removeItem('authToken')

    return { ok: true, response: response.data }
  } catch (error) {
    throw { ok: false, response: error.response.data }
  }
}

const togglePanel = async ({ commit }, params) => {
  commit('togglePanel', params)
}

const connectWallet = async ({ commit }, params) => {
  console.log(params)
  commit('connectWallet', params)
}

const setupLucid = async ({ commit }, data) => {
  commit('setupLucid', data)
}

const setADAprice = async ({ commit }, data) => {
  commit('setADAprice', data)
}

export {
  logoutUser,
  currentUser,
  connectWallet,
  setupLucid,
  getLocation,
  currentSeller,
  loginSeller,
  togglePanel,
  logoutSeller,
  loginUser,
  setADAprice,
  setLocation,
}
