import { useStore } from 'vuex'
import { computed } from 'vue'

const productAPI = () => {
  const store = useStore()

  const sleep = timeInMs =>
    new Promise(resolve => setTimeout(() => resolve(false), timeInMs))

  const setProductData = async params =>
    await store.dispatch('product/setProductData', params)

  return {
    sleep,
    setProductData,
    getProductData: computed(() => store.getters['product/getProductData'])
  }
}

export default productAPI
