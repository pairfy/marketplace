<template>
    <main>
        <router-view />
    </main>
</template>

<script>
import entryAPI from "@/pages/entry/api";
import { walletClient } from "@/api/wallet-api"

export default {
    name: "App",
    setup() {
        const {
            getUser
        } = entryAPI();

        const { startWalletService } = walletClient();

        startWalletService()
            .then(() => console.info("WALLET_SERVICE"))
            .catch((err) => console.error(err));



        return {
            getUser,
        };
    },
    mounted() {
        this.getUser()
            .catch((err) => {
                console.error(err);
            });
    },
};
</script>

<style src="./style/global.css" />
