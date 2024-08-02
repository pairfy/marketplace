<template>
  <main>
    <router-view />
  </main>
</template>

<script>
import headerAPI from "@/components/header/composable/header-api";
import { walletClient } from "@/api/wallet-api";

export default {
  name: "App",

  setup() {
    const { currentSeller, currentUser } = headerAPI();
    const { startWalletService, stopWalletService } = walletClient();

    currentSeller()
      .then(() => console.info("SELLER_LOGGED"))
      .catch((err) => console.error(err));

    currentUser()
      .then(() => console.info("USER_LOGGED"))
      .catch((err) => console.error(err));

    startWalletService()
      .then(() => console.info("WALLET_SERVICE"))
      .catch((err) => console.error(err));

    return {
      currentSeller,
      stopWalletService,
      startWalletService,
    };
  },

  beforeUnmount() {
    this.stopWalletService();
  },
};
</script>

<style src="./style/global.css" />
