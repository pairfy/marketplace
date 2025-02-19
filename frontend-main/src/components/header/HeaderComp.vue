<template>
    <header>
        <DrawerComp />
        <PriceBar />
        <div class="header">
            <div class="header-col left">
                <img class="brand" src="@/assets/logo-white.svg" alt="" @click="toHome">

                <LocationComp />
            </div>
            <div class="header-col center">
                <SearchComp />
            </div>
            <div class="header-col right">

                <CartComp />

                <AgentButton />

            </div>
        </div>

        <NavComp />

    </header>

</template>

<script setup>
import gql from 'graphql-tag';
import headerAPI from "@/components/header/api/index";
import LocationComp from '@/components/header/LocationComp.vue';
import AgentButton from "@/components/header/AgentButton.vue";
import DrawerComp from "@/components/header/DrawerComp.vue";
import SearchComp from "@/components/header/SearchComp.vue";
import CartComp from "@/components/header/CartComp.vue";
import NavComp from "@/components/header/NavComp.vue";
import PriceBar from "@/components/header/PriceBar.vue";
import { useQuery } from '@vue/apollo-composable';
import { onBeforeUnmount, watch, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()

const router = useRouter()

const watchRoute = watch(
    () => route.params.country,
    (n, o) => {
        let currentRoute = router.currentRoute.value;

        if (n === undefined && o === undefined) return;

        if (n) {
            let savedRoute = localStorage.getItem('location');

            if (savedRoute) {
                let parsed = JSON.parse(savedRoute);

                if (parsed.country.toLowerCase() !== n) {
                    return router.push({
                        name: currentRoute.name,
                        params: {
                            ...currentRoute.params,
                            country: parsed.country.toLowerCase()
                        },
                        query: currentRoute.query
                    });
                }
            }
        }

        if (typeof n === 'string' && typeof o === 'string') {
            return location.reload()
        }

    },
    {
        immediate: true
    }
)

const { setADAprice } = headerAPI();

const queryOptions = {
    pollInterval: 60000,
    clientId: 'query'
}

const { result: onGetAssetPriceResult, onError: onGetAssetPriceError } = useQuery(gql`
      query getAssetPrice {
        getAssetPrice 
      }
`,
    null,
    queryOptions
);

const watchAssetPrice = watch(onGetAssetPriceResult, value => setADAprice(value.getAssetPrice));

onGetAssetPriceError(error => {
    console.log(error)
})


const toHome = () => {
    router.push({
        name: 'home',
        query: {}
    })
}

onBeforeUnmount(() => {
    watchAssetPrice()
    watchRoute()
    watchLocation()
})

</script>

<style scoped>
header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: var(--text-size-1);
    background: var(--background-d);  
    color: var(--text-a);
}

.header{
    padding: 0.5rem 0;
}


.brand {
    cursor: pointer;
    height: 46px;
}

.header {
    display: grid;
    grid-template-columns: 20% 60% 20%;
    max-width: var(--body-a);
    width: 100%;
}

.header-col {
    text-align: center;
    display: flex;
    align-items: center;
}

.header-col.right {
    justify-content: flex-end;
}

.header-col.left {
    justify-content: flex-start;
}

</style>
