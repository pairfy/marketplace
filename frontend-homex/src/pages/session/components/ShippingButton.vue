<template>
  <div class="shipping">
    <div class="subtitle">Press the button to decide on the negotiation.</div>

    <Button :class="{ disabled: getOrderData.status === 'shipping' }" @click="shippingTransaction"> Shipped </Button>

    <Button class="appeal" @click="dialogVisible">Action</Button>

    <Dialog v-model:visible="visibleDialog" maximizable modal header="Action" :style="{ width: '30rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

      <div class="appeal-box">
        <div>Seller Penalty</div>
        <div>Buyer Penalty</div>
        <div>Contract Nullity</div>
        <div>Normal Termination</div>
      </div>

      <template #footer>

      </template>
    </Dialog>



  </div>
</template>

<script>
import headerAPI from "@/components/header/composable/header-api";
import { sessionAPI } from "@/pages/session/api";
import { walletClient, balanceTx, lucidClient } from "@/api/wallet-api";
import { getAddressDetails } from 'lucid-cardano';
import { ref } from "vue";

export default {
  setup() {
    const { startTx } = headerAPI();

    const { getOrderData, shipping, shippingTx } = sessionAPI();

    const visibleDialog = ref(true);

    const dialogVisible = () => {
      visibleDialog.value = true;
    };

    return {
      getOrderData,
      shipping,
      dialogVisible,
      visibleDialog,
      startTx,
      shippingTx
    };
  },

  methods: {
    async shippingTransaction() {
      const { getWallet } = walletClient();

      lucidClient.selectWallet(await getWallet());

      const addr = await lucidClient.wallet.address();
      const address = await getAddressDetails(addr);

      await this.shipping({
        order_id: this.getOrderData.id,
        address: address.address.bech32,
      }).then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => this.shippingTx({ tx_hash: hash, order_id: this.getOrderData.id }))
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
  },
};
</script>

<style lang="css" scoped>
.shipping {
  display: flex;
  flex-direction: column;
}

.shipping button {
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

.subtitle {
  font-size: var(--text-size-b);
  text-align: left;
  margin-top: 0.5rem;
}

.shipping button.appeal {
  background: var(--red-a);
  border: 1px solid var(--red-a);
}

.shipping button.disabled {
  pointer-events: none;
  opacity: 0.5;
  display: none;
}

.appeal-box {
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.appeal-box div {
  border: 1px solid var(--border-b);
  background: blue;
  padding: 0.75rem;
  border-radius: 8px;
  color: var(--text-w);
  font-size: var(--text-size-a);
  font-weight: 600;
  margin: 0.5rem;
  cursor: pointer;
}
</style>
