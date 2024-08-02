import { useStore } from "vuex";
import { computed } from "vue";

const headerAPI = () => {
  const store = useStore();

  const currentSeller = async (params) =>
    await store.dispatch("header/currentSeller", params);

  const currentUser = async (params) =>
    await store.dispatch("header/currentUser", params);

  const displaySetupWallet = async (params) =>
    await store.dispatch("header/displaySetupWallet", params);

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

  const startTx = async (data) => await store.dispatch("header/startTx", data);

  return {
    currentSeller,
    displaySetupWallet,
    currentUser,
    logoutUser,
    loginSeller,
    logoutSeller,
    loginUser,
    startTx,
    setupLucid,
    connectWallet,
    getCurrentSeller: computed(() => store.getters["header/getCurrentSeller"]),
    getCurrentUser: computed(() => store.getters["header/getCurrentUser"]),
    getDisplaySetupWallet: computed(() => store.getters["header/getDisplaySetupWallet"]), 
    getLucid: computed(() => store.getters["header/getLucid"]),
  };
};

export default headerAPI;
