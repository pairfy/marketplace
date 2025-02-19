<template>
    <div class="bar flex">
        <div class="bar-body flex">
            <span class="price">Blackdays: 1.000.000 ADA</span>
            <span class="price">Volume 24h: 253.894 ADA</span>
            <span class="price">ADAUSD {{ formatPriceToUSD(getADAprice) }} </span>
            <span class="price">IUSD 1.0</span>
            <span class="price">USDM 1.0</span>
            <span class="price">USDA 1.0</span>
            <div class="address flex" v-if="getCurrentUser">
                <span>
                    <i class="pi pi-wallet" />
                </span>
                <span class="wallet">{{ getCurrentUser.address.slice(0, 20) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import headerAPI from "@/components/header/api/index";
import { inject } from 'vue';

const { getADAprice, getCurrentUser } = headerAPI();

const { formatPriceToUSD } = inject('utils');
</script>

<style lang="css" scoped>
.bar {
    border-bottom: 1px solid var(--border-b);
    width: inherit;
    height: 2rem;
    justify-content: center;
}

.bar-body {
    justify-content: flex-end;
    max-width: var(--body-a);
    width: 100%;
}

.price,
.wallet {
    font-size: var(--text-size-0);
    font-weight: 400;
    margin-left: 2rem;
}

.address {
    font-weight: 400;
    margin-left: 2rem;
}

.address i {
    font-size: var(--text-size-0);
    margin-right: 0.5rem;
}

.wallet {
    margin: initial;
}
</style>