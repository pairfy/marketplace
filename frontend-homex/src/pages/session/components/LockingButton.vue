<template>
  <div class="locking">
    <div class="subtitle">Provide shipping information to the seller.</div>

    <Button class="actived">
      <span>
        Paid
      </span>
    </Button>

    <Button class="cancel" :class="{ invalid: !getReturnable }" @click="returnTransaction">
      <span>
        Return
      </span>
    </Button>
  </div>
</template>

<script>
import { balanceTx } from "@/api/wallet-api";
import { sessionAPI } from "@/pages/session/api";

export default {
  setup() {
    const { return_, returnTx, getOrderData, getReturnable } = sessionAPI();

    return {
      return_, returnTx, getOrderData, getReturnable
    }

  },

  methods: {
    async returnTransaction(slotId) {
      await this.return_({
        order_id: this.getOrderData.id
      }).then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => this.returnTx({ tx_hash: hash, order_id: slotId }))
        .then(() =>
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Transaction sent to the network.",
            life: 5000,
          })
        )
        .catch((err) => {
          if (err.response?.errors) {
            return this.$toast.add({
              severity: "error",
              summary: "Error Message",
              detail: err.response.errors[0].message,
              life: 5000,
            })
          }

          this.$toast.add({
            severity: "error",
            summary: "Error Message",
            detail: "Transaction Failed",
            life: 5000,
          })
        });
    },

  }
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
  display: flex;
  align-items: center
}

.locking button.actived {
  background: var(--green-a);
  border: 1px solid var(--green-a);
  pointer-events: none;

}

.locking button.cancel {
  background: var(--red-a);
  border: 1px solid var(--red-a);
  cursor: pointer;
}


.locking button.invalid {
  pointer-events: none;
  opacity: 0.5;
}

.subtitle {
  font-size: var(--text-size-c);
  text-align: left;
  margin-top: 0.5rem;
}
</style>
