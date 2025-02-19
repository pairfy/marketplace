<template>
    <div class="card" v-if="addressData">
        <div class="card-head flex">
            <span>Shipping Address</span>
            <i class="pi pi-box" />
        </div>
        <div class="card-body">
            <div class="card-item flex" v-for="(value, key) in addressData" :key="key">
                <template v-if="key !== 'other'">
                    <span>{{ key }}</span>
                    <span>{{ value }}</span>
                </template>
                <template v-else>
                    <div class="card-notes">
                        {{ value }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import orderAPI from "@/views/order/api/index";
import { computed } from 'vue';
import { Buffer } from 'buffer';

const { getOrderData } = orderAPI();

const addressData = computed(() => {
    let data = getOrderData.value?.address;

    if (data) {
        const address64 = JSON.parse(Buffer.from(data, 'base64').toString("utf-8"));

        const string = Buffer.from(address64.data, 'base64').toString("utf-8");

        return JSON.parse(string)
    }

    return null
});

</script>

<style lang="css" scoped>
.card {
    border-radius: 12px;
    border: 1px solid var(--border-a);
    margin-top: 1rem;
    width: 100%;
}

.card-head {
    font-weight: 600;
    padding: 1rem;
    border-bottom: 1px solid var(--border-a);
}

.card-head i:nth-child(2) {
    margin-left: 0.5rem;
}

.card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    width: inherit;
}

.card-item {
    justify-content: space-between;
    text-transform: capitalize;
    color: var(--text-b);
    line-height: 2.5rem;
    font-size: var(--text-size-1);
    font-weight: 500;
    width: inherit;
}

.card-item span:nth-child(2) {
    text-transform: capitalize;
    max-width: 50%;
    line-height: 2rem;
}

.card-notes{
    display: flex;
    width: inherit;
    border-radius: 8px;
    padding: 1rem;
    background: var(--background-b);
}
</style>