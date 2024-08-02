<template>
  <div class="timeline">
    <div class="timeline-title">
      <span>Negotiation Session</span>
      <span>{{ getSlotData?.id }} </span>
    </div>

    <div class="timeline-subtitle">
      <span>Space for bilateral negotiation </span>
      <span> {{ getSlotData?.created_at }}</span>
    </div>

    <div class="timeline-body">
      <Timeline
        v-if="getSlotData"
        :value="eventData"
        layout="horizontal"
        align="top"
      >
        <template #opposite="slotProps">
          <div class="transaction">
            <span @click="openCardanoScan(slotProps.item.data)">{{
              slotProps.item.text
            }}</span>

            <button
              v-if="slotProps.item.data"
              @click="copy(slotProps.item.data)"
            >
              <i class="pi pi-copy" />
            </button>
          </div>
        </template>
        <template #content="slotProps">
          {{ slotProps.item.status }}
        </template>
      </Timeline>
    </div>

    <div class="timeline-timer">
      <span>1</span>
      <span>5</span>
      <div>:</div>
      <span>0</span>
      <span>0</span>
    </div>

    <div class="timeline-note">Perform the action before the deadline.</div>
  </div>
</template>

<script>
import { computed } from "vue";
import { sessionAPI } from "@/pages/session/api";
import { useClipboard } from "@vueuse/core";
import { NETWORK } from "@/api";
import { shortFormat } from "@/utils";

export default {
  setup() {
    const { getSlotData } = sessionAPI();

    const eventData = computed(() => [
      {
        status: "Waiting",
        text: shortFormat(getSlotData.value.contract_0_tx, 20),
        data: getSlotData.value.contract_0_tx,
      },
      {
        status: "Locking",
        text: shortFormat(getSlotData.value.contract_1_tx, 20),
        data: getSlotData.value.contract_1_tx,
      },
      {
        status: "Delivered",
        text: "N/A",
        data: "",
      },
      {
        status: "Received",
        text: "N/A",
        data: "",
      },
    ]);

    const { copy } = useClipboard();
    return {
      eventData,
      getSlotData,
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

.transaction button {
  margin-left: 0.25rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: initial;
}

.transaction button:hover {
  color: var(--primary-c);
}

.transaction span {
  cursor: pointer;
}

.transaction span:hover {
  text-decoration: underline;
}

.timeline {
  background: var(--base-a);
  border: 1px solid var(--border-b);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  padding-bottom: 1rem;
  border-radius: 16px;
}

.timeline-title,
.timeline-subtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2rem;
}

.timeline-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 2rem;
  font-weight: 700;
  font-size: var(--text-size-a);
}

.timeline-timer span {
  background: var(--text-a);
  border-radius: 8px;
  width: 30px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.25rem;
  color: var(--text-w);
  border: 1px solid transparent;
}

.timeline-timer div{
  margin: 0 0.5rem;
}
.timeline-title span:nth-child(1) {
  font-size: var(--text-size-f);
  font-weight: 600;
}

.timeline-title span:nth-child(2) {
  font-size: var(--text-size-d);
  font-weight: 500;
}

.timeline-note {
  padding: 1rem;
  font-size: var(--text-size-b);
}
</style>
