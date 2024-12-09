<template>
  <div class="timeline">
    <div class="timeline-title">
      <span>Negotiation Session</span>
      <span>{{ getOrderData.id }} </span>
    </div>

    <div class="timeline-subtitle">
      <span>Space for bilateral negotiation </span>
      <span> {{ getOrderData.created_at }}</span>
    </div>

    <div class="timeline-body">
      <Timeline :value="timelineData" layout="horizontal" align="top">
        <template #opposite="orderProps">
          <div class="transaction">
            <span class="checker" v-if="orderProps.item.text !== 'N/A'">
              <i class="pi pi-sort-down-fill" />
            </span>


            <span style="cursor: default;" @click="openCardanoScan(orderProps.item.data)">{{
              orderProps.item.text
              }}</span>

            <button class="copier" v-if="orderProps.item.data" @click="copy(orderProps.item.data)"
              v-tooltip.top="'Copy'">
              <i class="pi pi-copy" />
            </button>
          </div>
        </template>
        <template #content="orderProps">
          <span>{{ orderProps.item.status }}</span>
          <span class="minicon" v-if="orderProps.item.status === 'Waiting'"><i class="pi pi-clock" /></span>
          <span class="minicon" v-if="orderProps.item.status === 'Locking'"><i class="pi pi-credit-card" /></span>
          <span class="minicon" v-if="orderProps.item.status === 'Shipping'"><i class="pi pi-truck" /></span>
          <span class="minicon" v-if="orderProps.item.status === 'Received'"><i class="pi pi-box" /></span>
        </template>
      </Timeline>
    </div>


    <CountDown/>
  </div>
</template>

<script>
import { computed } from "vue";
import { sessionAPI } from "@/pages/session/api";
import { useClipboard } from "@vueuse/core";
import { NETWORK } from "@/api";
import { shortFormat } from "@/utils";
import CountDown from "./CountDown.vue"

export default {
  components: {
    CountDown
  },
  setup() {
    const { getOrderData } = sessionAPI();

    const timelineData = computed(() => [
      {
        status: "Waiting",
        text: shortFormat(getOrderData.value.contract_0_tx, 20),
        data: getOrderData.value.contract_0_tx,
      },
      {
        status: "Locking",
        text: shortFormat(getOrderData.value.contract_1_tx, 20),
        data: getOrderData.value.contract_1_tx,
      },
      {
        status: "Shipping",
        text: shortFormat(getOrderData.value.contract_2_tx, 20),
        data: getOrderData.value.contract_2_tx,
      },
      {
        status: "Received",
        text: "N/A",
        data: "",
      },
    ]);

    const { copy } = useClipboard();
    return {
      timelineData,
      getOrderData,
      copy,
      shortFormat,
    };
  },

  methods: {
    openCardanoScan(txHash) {
      const internalUrl = `https://${NETWORK}.cardanoscan.io/transaction/${txHash}`;
      window.open(internalUrl, "_blank");
    },
  },
};
</script>

<style lang="css" scoped>
.transaction {
  display: flex;
  align-items: center;
}

.copier {
  margin-left: 0.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: initial;
}

.copier i {
  font-size: 12px;
}

.copier i:hover {
  color: var(--primary-c);
}

.transaction span {
  font-size: var(--text-size-c);
}

.transaction span:hover {
  text-decoration: underline;
}

.timeline {
  background: var(--base-a);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 1rem;
  border-radius: 16px;
  border: 1px solid var(--border-b);
}

.timeline-title,
.timeline-subtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2rem;
}

.timeline-title span:nth-child(1) {
  font-size: var(--text-size-f);
  font-weight: 600;
}

.timeline-title span:nth-child(2) {
  font-size: var(--text-size-d);
  font-weight: 500;
}


.checker {
  margin-right: 1rem;
}

.checker i {
  color: var(--green-a);
}

.minicon {
  margin-left: 0.5rem;
}

.minicon i {
  font-size: 13px;
}
</style>
