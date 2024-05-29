<template>
  <div class="store">
    <MainHeader />
    <MobileHeader />

    <div class="banner">
      <div class="banner-mask" />

      <div class="banner-screen"></div>
    </div>

    <GridWrap />
    <MobileGrid />
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader.vue";
import MobileHeader from "@/components/MobileHeader.vue";
import GridWrap from "@/pages/home/components/GridWrap.vue";
import MobileGrid from "@/pages/home/components/MobileGrid.vue";
//import storeAPI from "@/pages/home/composable/home-api";
import { useRouter } from "vue-router";

export default {
  components: {
    MainHeader,
    MobileHeader,
    MobileGrid,
    GridWrap,
  },

  setup() {
    const router = useRouter();

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
  background-image: var(--gradient-a);
}

.store .banner {
  width: inherit;
  height: 625px;
  min-height: 625px;
  z-index: 1;
  position: relative;
  inset: 0px 0px -1px;
  background-size: contain;
  display: flex;
  flex-direction: column;
}

.store .banner .banner-mask {
  width: inherit;
  height: inherit;
  z-index: 2;
  position: absolute;
  backdrop-filter: blur(0px);
  background: linear-gradient(180deg, transparent 90%, rgba(0, 0, 0, 0.1) 100%);
}

.store .banner .banner-screen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  z-index: 100;
  padding: 0 4rem;
}

@media only screen and (max-width: 767px) {
  .store {
    background: var(--base-b);
  }

  .store .banner {
    height: 400px;
    min-height: 400px;
  }

  .store .banner .banner-mask {
    display: none;
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
