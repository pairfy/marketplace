<template>
    <div class="transactions">
        <div class="card">
            <div class="card-head flex">
                <span>Pending State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.pending_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.pending_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.pending_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Return State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.returned_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.returned_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.returned_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Locking State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.locking_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.locking_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.locking_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Canceled State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.canceled_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.canceled_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.canceled_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>
    

        <div class="card">
            <div class="card-head flex">
                <span>Shipping State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.shipping_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.shipping_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.shipping_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Appeal State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.appealed_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.appealed_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.appealed_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Received State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.received_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.received_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.received_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Collected State</span>

                <span class="ago flex">
                    <i class="pi pi-clock" />
                    {{ formatAgo(getOrderData.order.collected_block) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ getOrderData.order.collected_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(getOrderData.order.collected_tx)" v-tooltip.top="'Explore'">
                    <i class="pi pi-globe" />
                </span>
            </div>
        </div>

    </div>
</template>

<script setup>
import orderAPI from "@/views/order/api/index";
import { format } from 'timeago.js';
import { NETWORK } from '@/api';

const { getOrderData } = orderAPI();

const formatAgo = (date) => {
    if (!date) {
        return ""
    }

    return format(date * 1000, 'en_US');
}

const openExplorer = (value) => {
    window.open(`https://${NETWORK}.cexplorer.io/tx/${value}`, '_blank');
}

</script>

<style lang="css" scoped>
.transactions {
    width: 80%;
}

.card {
    border-radius: 12px;
    border: 1px solid var(--border-a);
    margin-bottom: 1rem;
}

.card-head {
    border-bottom: 1px solid var(--border-a);
    padding: 1rem;
    font-weight: 500;
    justify-content: space-between;
    font-size: var(--text-size-1);
}

.card-body {
    padding: 1rem;
 display: flex;
 align-items: center;
}

.ago {
    font-size: var(--text-size-0);
    color: var(--text-b);
}

.ago i{
    margin-right: 0.5rem;
}

.mask {
    background: var(--background-b);
    padding: 0.5rem;
    border-radius: 8px;
    font-size: var(--text-size-1);
}

.explore {
    padding: 1rem;
    color: var(--text-b);
    cursor: pointer;
}
</style>