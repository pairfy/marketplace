<template>
  <div class="locking">
    <div class="subtitle">Press the button when you make the delivery.</div>

    <Button class="actived"> Delivered </Button>
  </div>
</template>

<script>
import { sessionAPI } from "@/pages/session/api";
import { useToast } from "primevue/usetoast";
import headerAPI from "@/components/header/composable/header-api";

export default {
  setup() {
    const { startTx } = headerAPI();

    const { getSlotData, startEndpoint } = sessionAPI();

    const toast = useToast();

    const showMessage = ({ severity, summary, detail, life }) => {
      toast.add({
        severity,
        summary,
        detail,
        life,
      });
    };

    return {
      getSlotData,
      startEndpoint,
      showMessage,
      startTx,
    };
  },

  methods: {
    downloadTx(txHash) {
      const data = [
        ["SlotId", this.getSlotData?.id],
        ["Product", this.getSlotData?.product_details.product_name],
        ["ProductId", this.getSlotData?.product_details.product_id],
        ["Mode", this.getSlotData?.mode],
        ["Units", this.getSlotData?.contract_units],
        ["Price", this.getSlotData?.contract_price],
        ["Collateral", this.getSlotData?.contract_collateral],
        ["SlotDate", this.getSlotData?.created_at],
        ["ContractTx0", txHash],
      ];

      const csvContent = data.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;

      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const dated = `${month}-${day}-${year}-${hours}-${minutes}`;

      a.download = `transaction-${this.getSlotData?.id}-${dated}.csv`;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return txHash;
    }
  },
};
</script>

<style lang="css" scoped>
.locking {
  display: flex;
  flex-direction: column;
}

.locking button {
  border: 1px solid var(--primary-c);
  background: var(--primary-c);
  font-size: var(--text-size-b);
  padding: 0.5rem 1rem;
  width: 100px;
  justify-content: center;
  font-weight: 600;
  color: var(--text-w);
  margin-right: 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.locking button.actived {
  background: var(--primary-c);
  border: 1px solid var(--primary-c);
  pointer-events: none;
}

.subtitle {
  font-size: var(--text-size-b);
  text-align: left;
  margin-top: 0.5rem;
}
</style>
