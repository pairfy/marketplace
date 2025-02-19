import { useStore } from "vuex";
import { computed } from "vue";

const headerAPI = () => {
  const store = useStore();

  const currentSeller = async (params) =>
    await store.dispatch("header/currentSeller", params);

  const currentUser = async (params) =>
    await store.dispatch("header/currentUser", params);

  const togglePanel = async (params) =>
    await store.dispatch("header/togglePanel", params);

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

  const getLocation = async (data) =>
    await store.dispatch("header/getLocation", data);

  const setLocation = async (data) =>
    await store.dispatch("header/setLocation", data);
  
  return {
    currentSeller,
    togglePanel,
    setLocation,
    currentUser,
    logoutUser,
    loginSeller,
    getLocation,
    logoutSeller,
    loginUser,
    setupLucid,
    connectWallet,
    setADAprice,
    getCurrentSeller: computed(() => store.getters["header/getCurrentSeller"]),
    getCurrentUser: computed(() => store.getters["header/getCurrentUser"]),
    panelVisible: computed(() => store.getters["header/panelVisible"]), 
    getLucid: computed(() => store.getters["header/getLucid"]),
    getADAprice: computed(() => store.getters["header/getADAprice"]),
    getLocationData: computed(() => store.getters["header/getLocationData"])
  };
};

export default headerAPI;
