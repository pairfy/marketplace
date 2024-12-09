<template>
  <div class="store">
    <MainHeader />
    <MobileHeader />
    <BannerWrap />
    <GridWrap />
    <MobileGrid />
  </div>
</template>

<script>
import MainHeader from "@/components/header/MainHeader.vue";
import MobileHeader from "@/components/header/MobileHeader.vue";
import GridWrap from "@/pages/home/components/GridWrap.vue";
import MobileGrid from "@/pages/home/components/MobileGrid.vue";
//import storeAPI from "@/pages/home/composable/home-api";
import { useRouter } from "vue-router";
import BannerWrap from "@/pages/home/components/BannerWrap.vue";
import homeAPI from "@/pages/home/composable/home-api";

export default {
  components: {
    MainHeader,
    MobileHeader,
    MobileGrid,
    GridWrap,
    BannerWrap,
  },

  setup() {
    const router = useRouter();

    const { getTimeline } = homeAPI();

    getTimeline();

    return { router };
  },
  data() {
    return {
      selectedTab: "all",
    };
  },
};
</script>

<style lang="css" scoped>
.store {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--primary-a);
}

@media only screen and (max-width: 767px) {
  .store {
    background: var(--base-b);
  }
}

/* Tablets and small deskbanners */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  /* CSS rules for tablets and small deskbanners */
}

/* Medium deskbanners */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  /* CSS rules for medium deskbanners */
}

/* Large deskbanners and widescreen monitors */
@media only screen and (min-width: 1200px) {
  /* CSS rules for large deskbanners and widescreen monitors */
}
</style>

<style src="./css/query.css" />
