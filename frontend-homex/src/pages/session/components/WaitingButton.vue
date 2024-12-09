<template>
  <div class="waiting">

    <template v-if="getOrderData.status === 'canceled'">
      <div class="subtitle">The script has been cancelled.</div>


      <Button class="cancel disabled">
        <span>Canceled</span>
      </Button>
    </template>

    <template v-if="getOrderData.status === 'waiting'">
      <div class="subtitle">The transaction has been sent to the network.</div>

      <Button class="actived disabled">
        <span>Actived</span>

      </Button>

      <Button class="cancel" @click="cancelTransaction(getOrderData.id)">
        <span>Cancel</span>
      </Button>
    </template>
    <!--//////////////////////////////////////////////////////////////////////-->
    <template v-if="getOrderData.status === 'created'">
      <div class="subtitle">Press to activate the script on the network.</div>

      <Button @click="deployTransaction(getOrderData.id)">
        <span>Deploy</span>
      </Button>
    </template>
    <!--//////////////////////////////////////////////////////////////////////-->
  </div>
</template>

<script>
import { sessionAPI } from "@/pages/session/api";
import { useToast } from "primevue/usetoast";
import { getAddressDetails } from "lucid-cardano";
import { walletClient, balanceTx, lucidClient } from "@/api/wallet-api";
import headerAPI from "@/components/header/composable/header-api";

export default {
  setup() {
    const { startTx } = headerAPI();

    const { getOrderData, deploy, deployTx, cancel, cancelTx } = sessionAPI();

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
      deploy,
      showMessage,
      startTx,
      deployTx,
      cancel,
      cancelTx
    };
  },

  methods: {
    async deployTransaction(slotId) {

      const { getWallet } = walletClient();

      lucidClient.selectWallet(await getWallet());


      const addr = await lucidClient.wallet.address();
      const address = await getAddressDetails(addr);

      await this.deploy({
        order_id: slotId,
        address: address.address.bech32,
        pubkeyhash: address.paymentCredential.hash,
      }).then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => this.deployTx({ tx_hash: hash, order_id: slotId }))
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


    async cancelTransaction(orderId) {
      const { getWallet } = walletClient();

      lucidClient.selectWallet(await getWallet());

      const addr = await lucidClient.wallet.address();
      const address = await getAddressDetails(addr);

      await this.cancel({
        order_id: orderId,
        address: address.address.bech32,
      }).then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => this.cancelTx({ tx_hash: hash, order_id: orderId }))
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
.waiting {
  display: flex;
  flex-direction: column;
}

.waiting button {
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

.waiting button.actived {
  background: var(--green-a);
  border: 1px solid var(--green-a);
}

.waiting button.cancel {
  background: var(--red-a);
  border: 1px solid var(--red-a);
}


.disabled {
  pointer-events: none;
  cursor: not-allowed;
}

.subtitle {
  font-size: var(--text-size-c);
  text-align: left;
  margin-top: 0.5rem;
}
</style>
