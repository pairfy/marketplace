<template>
  <div class="product">
    <MainHeader />
    <MobileHeader />

    <div v-if="isLoaded" class="product-body">
      <div class="page-1">
        <HeadView />
        <MobileHeadView />
      </div>

      <div class="page-2">x</div>
    </div>

    <div v-if="isFailed">Failed</div>
  </div>
</template>

<script>
import productAPI from "@/pages/product/api";
import MainHeader from "@/components/header/MainHeader.vue";
import MobileHeader from "@/components/header/MobileHeader.vue";
import HeadView from "@/pages/product/components/HeadView.vue";
import MobileHeadView from "@/pages/product/components/MobileHeadView.vue";
import { ref } from "vue";

export default {
  components: {
    MainHeader,
    MobileHeader,
    HeadView,
    MobileHeadView,
  },
  setup() {
    const { getProduct, getOrders, getProductData } = productAPI();

    const isLoaded = ref(false);
    const isFailed = ref(false);

    const setupData = (id) => {
      getProduct({ id }).then((res) => {
        if (res.success === true) {
          return (isLoaded.value = true);
        }

        if (res.success === false) {
          return (isFailed.value = true);
        }
      });

      getOrders({ id });
    };

    return {
      setupData,
      isLoaded,
      isFailed,
      getProductData,
    };
  },
  data() {
    return {};
  },

  created() {
    this.$watch(
      () => this.$route.params,
      (params) => this.setupData(params.id),
      { immediate: true }
    )();
  },
  methods: {
    scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    },
  },

  mounted() {
    this.scrollTop();
  },
};
</script>

<style lang="css" scoped>
.product-body {
  padding: 0 12%;
  width: 100%;
}

.product {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.page-1 {
  min-height: 150vh;
  margin-top: 150px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  border-top: 1px solid var(--border-b);
  padding-top: 100px;
}

@media only screen and (max-width: 767px) {
  .product-body {
    width: 100%;
  }

  .page-1 {
    margin-top: 100px;
  }
}

/* Tablets and small deskbanners */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .product-body {
    width: 100%;
  }

  .page-1 {
    margin-top: 100px;
  }
}

/* Medium deskbanners */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .product-body {
    width: 100%;
  }

  .page-1 {
    margin-top: 100px;
  }
}

/* Large deskbanners and widescreen monitors */
@media only screen and (min-width: 1200px) {
  /* CSS rules for large deskbanners and widescreen monitors */
}
</style>
