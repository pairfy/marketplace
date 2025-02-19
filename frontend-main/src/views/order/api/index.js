import { useStore } from 'vuex'
import { computed } from 'vue'

const orderAPI = () => {
  const store = useStore()

  const setOrderData = async params =>
    await store.dispatch('order/setOrderData', params)

  return {
    setOrderData,
    getOrderData: computed(() => store.getters['order/getOrderData'])
  }
}

export default orderAPI
