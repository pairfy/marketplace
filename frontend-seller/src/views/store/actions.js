import axiosAPI from '@/api/axios'
import { HOST } from '@/api'

const createUser = async (_, params) => {
  try {
    const response = await axiosAPI.post('/api/seller/create-seller', params)

    return { ok: true, response: response.data }
  } catch (error) {
    return { ok: false, response: error.response.data }
  }
}

const loginUser = async ({ commit }, params) => {
  try {
    const response = await axiosAPI.post('/api/seller/login-seller', params)

    commit('userData', response.data)

    return { ok: true, response: response.data }
  } catch (error) {
    return { ok: false, response: error.response.data }
  }
}

const getUser = async ({ commit }) => {
  try {
    const response = await axiosAPI.get('/api/seller/current-seller')

    commit('userData', response.data.sellerData)

    return { ok: true, response: response.data }
  } catch (error) {
    return { ok: false, response: error.response.data }
  }
}

const createImage = async (_, params) => {
  try {
    const response = await fetch(HOST + '/api/media/create-image', {
      method: 'POST',
      body: params,
      credentials: 'include',
    })

    return { ok: true, response: await response.json() }
  } catch (error) {
    return { ok: false, response: error.response }
  }
}

const deleteImage = async (_, params) => {
  try {
    const response = await axiosAPI.post('/api/media/delete-image', params)

    return { ok: true, response: response.data }
  } catch (error) {
    return { ok: false, response: error.response.data }
  }
}

const getBulletList = async (_, params) => {
  try {
    const response = await axiosAPI.post('/api/gemini/bullet-list', params)

    return { ok: true, response: response.data }
  } catch (error) {
    return { ok: false, response: error.response.data }
  }
}

export { createUser, loginUser, getUser, createImage, deleteImage, getBulletList }
