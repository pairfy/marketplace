import { useStore } from "vuex";
import { computed } from "vue";

const entryAPI = () => {
  const store = useStore();

  const loginUser = async (params) =>
    await store.dispatch("entry/loginUser", params);

  const getUser = async (params) =>
    await store.dispatch("entry/getUser", params);

  const createUser = async (params) =>
    await store.dispatch("entry/createUser", params);

  const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

  return {
    loginUser,
    getUserData: computed(() => store.getters["entry/getUserData"]),
    createUser,
    getUser,
    sleep,
  };
};

export default entryAPI;
