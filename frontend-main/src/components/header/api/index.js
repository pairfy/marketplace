import { useStore } from "vuex";
import { computed } from "vue";

const headerAPI = () => {
  const store = useStore();

  const currentSeller = async (params) =>
    await store.dispatch("header/currentSeller", params);

  const currentUser = async (params) =>
    await store.dispatch("header/currentUser", params);

  const showPanel = async (params) =>
    await store.dispatch("header/showPanel", params);

  const connectWallet = async (params) =>
    await store.dispatch("header/connectWallet", params);

  const loginSeller = async (params) =>
    await store.dispatch("header/loginSeller", params);

  const loginUser = async (params) =>
    await store.dispatch("header/loginUser", params);

  const logoutSeller = async (params) =>
    await store.dispatch("header/logoutSeller", params);

  const logoutUser = async (params) =>
    await store.dispatch("header/logoutUser", params); 

  const setupLucid = async (data) =>
    await store.dispatch("header/setupLucid", data);

  const setADAprice = async (data) =>
    await store.dispatch("header/setADAprice", data);

  const startTx = async (data) => await store.dispatch("header/startTx", data);

  return {
    currentSeller,
    showPanel,
    currentUser,
    logoutUser,
    loginSeller,
    logoutSeller,
    loginUser,
    startTx,
    setupLucid,
    connectWallet,
    setADAprice,
    getCurrentSeller: computed(() => store.getters["header/getCurrentSeller"]),
    getCurrentUser: computed(() => store.getters["header/getCurrentUser"]),
    drawerVisible: computed(() => store.getters["header/drawerVisible"]), 
    getLucid: computed(() => store.getters["header/getLucid"]),
    getADAprice: computed(() => store.getters["header/getADAprice"])
  };
};

export default headerAPI;
