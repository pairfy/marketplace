import { useStore } from 'vuex'
import { computed } from 'vue'

const productAPI = () => {
  const store = useStore()

  const sleep = timeInMs =>
    new Promise(resolve => setTimeout(() => resolve(false), timeInMs))

  const setProductData = async params =>
    await store.dispatch('product/setProductData', params)

  const getArrivalDate = async params =>
    await store.dispatch('product/getArrivalDate', params)
  
  return {
    sleep,
    setProductData,
    getArrivalDate,
    getArrivalData:  computed(() => store.getters['product/getArrivalData']),
    getProductData: computed(() => store.getters['product/getProductData'])
  }
}

export default productAPI
