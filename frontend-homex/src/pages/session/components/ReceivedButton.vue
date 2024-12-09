<template>
  <div class="locking">
    <div class="subtitle">Press the button when you receive the product.</div>

    <Button>Received</Button>

    <Button class="appeal">Appeal</Button>
  </div>
</template>

<script>
import { sessionAPI } from "@/pages/session/api";
import { useToast } from "primevue/usetoast";
import headerAPI from "@/components/header/composable/header-api";

export default {
  setup() {
    const { startTx } = headerAPI();

    const { getOrderData, startEndpoint } = sessionAPI();

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
      getOrderData,
      startEndpoint,
      showMessage,
      startTx,
    };
  },

  methods: {

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
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.locking button.appeal {
  background: var(--red-a);
  border: 1px solid var(--red-a);
}

.subtitle {
  font-size: var(--text-size-b);
  text-align: left;
  margin-top: 0.5rem;
}
</style>
