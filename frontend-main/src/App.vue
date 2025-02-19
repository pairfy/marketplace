<template>
  <div class="wrap">
    <Toast closeIcon="pi-user" />
    <HeaderComp />
    <RouterView />
    <FooterComp />
  </div>
</template>

<script setup>
import headerAPI from "@/components/header/api/index";
import HeaderComp from '@/components/header/HeaderComp.vue';
import FooterComp from '@/components/FooterComp.vue';
import { randomString, formatPriceToUSD, setupAudio, convertDate, copyToClipboard, convertLovelaceToUSD, convertLovelaceToADA, formatWithDots, reduceByLength, formatCurrency, applyDiscount, convertUSDToADA } from "./utils/index"
import { queryClient, gatewayClient, notificationClient, chatClient } from './graphql/index.js';
import { RouterView } from 'vue-router';
import { ApolloClients } from '@vue/apollo-composable';
import { walletClient } from "@/api/wallet";
import { onBeforeUnmount, provide } from 'vue';

const { currentUser, currentSeller, getLocation } = headerAPI();

const { startWalletService, stopWalletService } = walletClient();

currentUser()
  .then(() => console.info("USER_LOGGED"))
  .catch((err) => console.error(err));

currentSeller()
  .then(() => console.info("SELLER_LOGGED"))
  .catch((err) => console.error(err));

startWalletService()
  .then(() => console.info("WALLET_SERVICE"))
  .catch((err) => console.error(err));

getLocation()
  .then(() => console.info("LOCATION"))
  .catch((err) => console.error(err));

provide(ApolloClients, {
  default: queryClient,
  query: queryClient,
  gateway: gatewayClient,
  notification: notificationClient,
  chat: chatClient
})

provide('utils', {
  formatWithDots,
  reduceByLength,
  formatCurrency,
  applyDiscount,
  convertUSDToADA,
  convertLovelaceToADA,
  convertLovelaceToUSD,
  copyToClipboard,
  convertDate,
  setupAudio,
  formatPriceToUSD,
  randomString
});

onBeforeUnmount(() => {
  stopWalletService()

})

</script>



<style scoped>
.wrap {
  background: var(--background-b);
  display: flex;
  flex-direction: column;
  transition: all .2s ease;
  height: 100%;
  flex: 1;
}
</style>
