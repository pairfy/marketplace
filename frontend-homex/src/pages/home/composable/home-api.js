import { useStore } from "vuex";
import { computed } from "vue";

const homeAPI = () => {
  const store = useStore();


  const getTimeline = async (params) =>
    await store.dispatch("home/getTimeline", params);

  const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));

  return {
    getTimelineData: computed(
      () => store.getters["home/getTimelineData"]
    ),
    getTimeline,
    sleep,
  };
};

export default homeAPI;
