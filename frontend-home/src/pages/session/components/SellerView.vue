<template>
  <div class="stepper">
    <Toast />
    <div class="stepper-row">
      <div class="stepper-column">
        <div>1</div>
        <span></span>
      </div>
      <div class="stepper-body">
        <div class="stepper-title">Product</div>

        <div class="stepper-product">
          <img
            class="stepper-product-image"
            :src="
              getSlotData.product_details.media_url +
              getSlotData.product_details.media_path +
              getSlotData.product_details.image_main
            "
            alt=""
          />

          <div class="stepper-product-title">
            <a
              :href="'/p/' + getSlotData.product_details.product_id"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ getSlotData.product_details.product_name }}</a
            >

            <span> | </span>
            <span class="sku"
              >SKU: {{ getSlotData.product_details.product_id }}</span
            >
            <span> | </span>
            <span class="model">
              Model: {{ getSlotData.product_details.model }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!--///-->
    <div class="stepper-row">
      <div class="stepper-column short">
        <div>2</div>
        <span></span>
      </div>
      <div class="stepper-body">
        <div class="stepper-title">Information</div>
        <div class="stepper-price">
          <div>
            <label>Total Price </label>
            <span>{{ getSlotData.contract_price }} ADA </span>
          </div>

          <div>
            <label>Total Collateral</label>
            <span>{{ getSlotData.contract_collateral }} ADA </span>
          </div>

          <div>
            <label>Mode</label>
            <span>{{ getSlotData.mode }}</span>
          </div>

          <div>
            <label>Units</label>
            <span> {{ getSlotData.contract_units }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--///////////////////////////////////////////////////////////////7-->

    <div class="stepper-row">
      <div class="stepper-column">
        <div>3</div>
      </div>
      <div class="stepper-body">
        <div class="stepper-title">Action</div>
        <WaitingButton
          v-if="
            getSlotData.contract_stage === 'inactive' ||
            getSlotData.contract_stage === 'start' ||
            getSlotData.contract_stage === 'waiting'
          "
        />

        <DeliveredButton v-if="getSlotData.contract_stage === 'locking'" />
      </div>
    </div>
  </div>
</template>

<script>
import { sessionAPI } from "@/pages/session/api";
import WaitingButton from "./WaitingButton.vue";
import DeliveredButton from "./DeliveredButton.vue";

export default {
  components: {
    WaitingButton,
    DeliveredButton,
  },
  setup() {
    const { getSlotData } = sessionAPI();

    return {
      getSlotData,
    };
  },
};
</script>

<style lang="css" scoped>
.sku,
.model {
  color: var(--text-b);
  font-size: var(--text-size-b);
}

.stepper-product {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
}

.stepper-product-image {
  width: 125px;
  height: 125px;
  object-fit: contain;
  border-radius: 12px;
  background: var(--base-a);
  border: 1px solid var(--border-b);
  padding: 0.5rem;
  overflow: hidden;
}

.stepper-product-title {
  font-size: var(--text-size-d);
  text-align: left;
  max-width: 600px;
  margin-left: 2rem;
  line-height: 2rem;
}

.stepper-product-title a {
  color: var(--text-a);
  font-weight: 400;
}

.stepper-column {
  width: 100px;
  height: 250px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}

.stepper-column.short {
  height: 200px;
}

.stepper-column div {
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

.stepper-column span {
  width: 2px;
  height: 100%;
  background: var(--primary-c);
}

.stepper-title {
  font-size: var(--text-size-e);
  text-align: start;
  font-weight: 600;
}

.stepper {
  background: var(--base-a);
}

.stepper-price {
  display: flex;
  align-items: center;
  text-align: start;
  margin-top: 2rem;
  max-width: 500px;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--border-b);
}

.stepper-price div {
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stepper-price div label {
  display: flex;
  align-items: baseline;
  font-size: var(--text-size-b);
  color: var(--text-b);
}

.stepper-price div span {
  line-height: 2.5rem;
  font-size: var(--text-size-d);
  color: var(--text-a);
  white-space: nowrap;
  text-transform: capitalize;
}

.stepper-row {
  display: flex;
  width: 100%;
}

.stepper-body {
  padding: 0.25rem;
  width: 100%;
}
</style>
