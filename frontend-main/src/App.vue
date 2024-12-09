<template>
  <div class="wrapper">
    <Toast closeIcon="pi-user"/>
    <HeaderComp />
    <RouterView />
  </div>
</template>

<script setup>
import headerAPI from "@/components/header/api/index";
import HeaderComp from '@/components/header/HeaderComp.vue';
import { formatWithDots, reduceByLength, formatCurrency, applyDiscount, convertUSDToADA } from "./utils/index"
import { RouterView } from 'vue-router';
import { ApolloClients } from '@vue/apollo-composable';
import { queryClient, gatewayClient } from './graphql/index';
import { provide } from 'vue';
import { walletClient } from "@/api/wallet";


provide(ApolloClients, {
  default: queryClient,
  query: queryClient,
  gateway: gatewayClient
})


provide('utils', {
  formatWithDots,
  reduceByLength,
  formatCurrency,
  applyDiscount,
  convertUSDToADA
});

const { currentUser } = headerAPI();

const { startWalletService } = walletClient();

currentUser()
      .then(() => console.info("USER_LOGGED"))
      .catch((err) => console.error(err));

startWalletService()
      .then(() => console.info("WALLET_SERVICE"))
      .catch((err) => console.error(err));
</script>



<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all .2s ease;
  flex: 1;
  height: 100%;
}
</style>
