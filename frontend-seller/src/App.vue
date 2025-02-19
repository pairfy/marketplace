<template>
  <div class="body">
    <Toast closeIcon="false" />
    <NavMenu v-if="getUserData" />

    <div class="body-content">
      <div class="header">
        <img class="logo" src="@/assets/logo.svg" alt="">
      </div>
      <RouterView />
    </div>
  </div>

</template>

<script setup>
import NavMenu from './components/NavMenu.vue'
import dashboardAPI from '@/views/api/index';
import { RouterView } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { provide } from 'vue';
import { ApolloClients } from '@vue/apollo-composable';
import { productClient, gatewayClient, notificationClient } from './graphql/index';
import { formatWithDots, reduceByLength, formatCurrency } from "./utils/index"
import { walletClient } from "@/api/wallet";

provide(ApolloClients, {
  default: productClient,
  product: productClient,
  gateway: gatewayClient,
  notification: notificationClient
})

provide('utils', {
  formatWithDots,
  reduceByLength,
  formatCurrency
});

const toast = useToast();

const { getUserData, getUser } = dashboardAPI();

const { startWalletService } = walletClient();

const showError = (content) => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

getUser().then(() => console.log('👋 Welcome')).catch(() => showError('AUTH_ERROR'))

startWalletService()
  .then(() => console.info("WALLET_SERVICE"))
  .catch((err) => console.error(err));

</script>

<style scoped>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.body {
  height: 100vh;
  display: flex;
  transition: all .2s ease;
  background: var(--background-b);
  background-image: url('@/assets/shape.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.body-content {
  flex: 1;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.header {
  background: var(--background-a);
  border-bottom: 1px solid var(--border-a);
  padding: 0 1rem;
}

.logo {
  height: 2.5rem;
}
</style>
