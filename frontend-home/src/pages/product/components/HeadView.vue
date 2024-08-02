<template>
  <div class="head mobile">
    <div class="head-body">
      <div class="head-left">
        <MediaComp />
        <DescriptionView />
      </div>

      <div class="head-right">
        <BuyPanel />
        <SellerComp />
      </div>
    </div>
  </div>
</template>

<script>
import productAPI from "@/pages/product/api";
import DescriptionView from "./DescriptionView.vue";
import MediaComp from "./MediaComp.vue";
import SellerComp from "./SellerComp.vue";
import BuyPanel from "./BuyPanel.vue";

export default {
  components: {
    DescriptionView,
    MediaComp,
    SellerComp,
    BuyPanel,
  },
  setup() {
    const { lockingEndpoint } = productAPI();

    return {
      lockingEndpoint,
    };
  },
};
</script>

<style lang="css" scoped>


.head {
  display: flex;
  flex-direction: column;
}

.head-body {
  display: flex;
}

.arrow::before {
  border-bottom: 4px solid #0000;
  border-left: 4px solid var(--text-b);
  border-top: 4px solid #0000;
  content: " ";
  display: inline-block;
  align-items: center;
  height: 0;
  margin: 0 2px;
  width: 0;
}

.head .head-left {
  text-align: center;
  width: 70%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.head .head-right {
  height: inherit;
  text-align: center;
  width: 30%;
}

@media only screen and (max-width: 767px) {
  .mobile {
    display: none;
  }

}

/* Tablets and small deskbanners */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .mobile {
    display: none;
  }
}

/* Medium deskbanners */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .mobile {
    display: none;
  }
}

/* Large deskbanners and widescreen monitors */
@media only screen and (min-width: 1200px) {
  /* CSS rules for large deskbanners and widescreen monitors */
}
</style>
