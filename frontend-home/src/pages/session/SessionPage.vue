<template>
  <div class="session">
    <MainHeader />

    <div class="session-wrap" v-if="isLoaded">
      <TimeLine />

      <div class="session-body">
        <div class="session-body-left">
          <SellerView />
        </div>

        <div class="session-body-right">
          <SellerChat v-if="getCurrentSeller" />
          <BuyerChat v-if="getCurrentUser" />
        </div>
      </div>

      <div class="session-bottom">z</div>
    </div>
    <div v-if="isFailed">isFailed</div>
  </div>
</template>

<script>
import MainHeader from "@/components/header/MainHeader.vue";
import TimeLine from "@/pages/session/components/TimeLine.vue";
import SellerChat from "@/pages/session/components/SellerChat.vue";
import BuyerChat from "@/pages/session/components/BuyerChat.vue";
import SellerView from "@/pages/session/components/SellerView.vue";
import headerAPI from "@/components/header/composable/header-api";
import { ref } from "vue";
import { sessionAPI } from "@/pages/session/api";

export default {
  components: {
    MainHeader,
    SellerChat,
    BuyerChat,
    TimeLine,
    SellerView,
  },
  setup() {
    const { getCurrentSeller, getCurrentUser } = headerAPI();

    let currentRoute = ref("");

    const isLoaded = ref(false);

    const isFailed = ref(false);

    const { getSlot } = sessionAPI();

    const setupData = (params) => {
      getSlot({ id: params.id }).then((res) => {
        if (res.success === true) {
          isLoaded.value = true;
        }

        if (res.success === false) {
          isFailed.value = true;
        }
      });
    };

    return {
      currentRoute,
      getCurrentSeller,
      getCurrentUser,
      getSlot,
      setupData,
      isLoaded,
      isFailed,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (params) => this.setupData(params),
      { immediate: true }
    )();
  },
};
</script>

<style lang="css" scoped>
.session {
}
.session-body {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-top: 2rem;
}

.session-body-left {
  width: 60%;
  background: var(--base-a);
}

.session-wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 11%;
  margin-top: 100px;
}

.session-body-right {
  width: 40%;
}

.session-bottom {
  height: 50vh;
  background: rgba(0, 128, 0, 0);
}
</style>
