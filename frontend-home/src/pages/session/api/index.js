import { useStore } from "vuex";
import { computed } from "vue";

const sessionAPI = () => {
  const store = useStore();

  const getSlot = async (params) =>
    await store.dispatch("session/getSlot", params);

  const startEndpoint = async (params) =>
    await store.dispatch("session/startEndpoint", params);

  return {
    getSlot,
    startEndpoint,
    getSlotData: computed(() => store.getters["session/getSlotData"]),
  };
};

export { sessionAPI };
