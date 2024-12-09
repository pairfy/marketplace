<template>
  <div class="summary">
    <Toast />
    <div class="summary-row">
      <div class="summary-column">
        <div>1</div>
        <span></span>
      </div>
      <div class="summary-body">
        <div class="summary-title">Product</div>

        <div class="summary-product">
          <img class="summary-product-image" :src="getOrderData.product_details.media_url +
            getOrderData.product_details.media_path +
            getOrderData.product_details.image_main
            " alt="" />

          <div class="summary-product-title">
            <a :href="'/p/' + getOrderData.product_details.product_id" target="_blank" rel="noopener noreferrer">
              {{ getOrderData.product_details.product_name }}</a>

            <span> | </span>
            <span class="sku">SKU: {{ getOrderData.product_details.product_id }}</span>
            <span> | </span>
            <span class="model">
              Model: {{ getOrderData.product_details.model }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--///-->
    <div class="summary-row">
      <div class="summary-column">
        <div>2</div>
        <span></span>
      </div>
      <div class="summary-body">
        <div class="summary-title">Information</div>
        <div class="summary-price">
          <div>
            <label>Total Price </label>
            <span>{{ formatLovelace(getOrderData.contract_price) }}</span>
          </div>

          <div>
            <label>Total Collateral</label>
            <span>{{ formatLovelace(getOrderData.contract_collateral) }}</span>
          </div>

          <div>
            <label>Mode</label>
            <span>{{ getOrderData.mode }}</span>
          </div>

          <div>
            <label>Units</label>
            <span> {{ getOrderData.contract_units }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--///////////////////////////////////////////////////////////////7-->

    <div class="summary-row">
      <div class="summary-column">
        <div>3</div>
      </div>
      <div class="summary-body">
        <div class="summary-title">Action</div>
        <WaitingButton v-if="
          getOrderData.status === 'created' ||
          getOrderData.status === 'waiting' ||
          getOrderData.status === 'canceled'
        " />

        <shippingButton v-if="
          getOrderData.status === 'locking' ||
          getOrderData.status === 'shipping'
        " />
      </div>
    </div>
  </div>
</template>

<script>
import { sessionAPI } from "@/pages/session/api";
import WaitingButton from "./WaitingButton.vue";
import shippingButton from "./ShippingButton.vue";

export default {
  components: {
    WaitingButton,
    shippingButton,
  },
  setup() {
    const { getOrderData } = sessionAPI();

    const formatLovelace = (value) => {
      if (value) {
        const newValue = value / 1000000;
        return newValue + " ADA"
      }
    }
    return {
      getOrderData,
      formatLovelace
    };
  },
};
</script>

<style lang="css" scoped>
.sku,
.model {
  font-size: var(--text-size-b);
}

.summary-product {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
}

.summary-product-image {
  width: 125px;
  height: 125px;
  object-fit: contain;
  border-radius: 16px;
  background: var(--base-a);
  border: 1px solid var(--border-b);
  padding: 0.5rem;
  overflow: hidden;
}

.summary-product-title {
  font-size: var(--text-size-e);
  text-align: left;
  max-width: 600px;
  margin-left: 2rem;
  line-height: 2rem;
}

.summary-product-title a {
  color: var(--text-a);
  font-weight: 400;
}

.summary-column {
  width: 75px;
  height: 225px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}


.summary-column div {
  background: var(--primary-c);
  min-height: 2rem;
  min-width: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-w);
  font-weight: 700;
  font-size: var(--text-size-a);
}

.summary-column span {
  width: 2px;
  height: 100%;
  background: var(--primary-c);
}

.summary-title {
  font-size: var(--text-size-e);
  text-align: start;
  font-weight: 600;
}

.summary {
  background: var(--base-a);
  padding: 2rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--border-b);
  height: 700px;
}

.summary-price {
  display: flex;
  align-items: center;
  text-align: start;
  margin-top: 2rem;
  max-width: 500px;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--border-b);
}

.summary-price div {
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.summary-price div label {
  display: flex;
  align-items: baseline;
  font-size: var(--text-size-b);
  color: var(--text-b);
}

.summary-price div span {
  line-height: 2.5rem;
  font-size: var(--text-size-e);
  color: var(--text-a);
  white-space: nowrap;
  text-transform: capitalize;
}

.summary-row {
  display: flex;
  width: 100%;
}

.summary-body {
  padding: 0.25rem;
  width: 100%;
}
</style>
