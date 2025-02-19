<template>
    <div class="icon" :class="{ visible: color, red: color === 'red', green: color === 'green' }">
        <div class="circle" :class="{ red: color === 'red', green: color === 'green' }">
            <i class="pi pi-check" v-if="color === 'green'" />
            <i class="pi pi-times" v-if="color === 'red'" />
        </div>
    </div>
</template>

<script setup>
import orderAPI from '@/views/order/api/index';
import { computed } from 'vue';


const { getOrderData } = orderAPI();

const color = computed(() => {

    if (getOrderData.value.order.finished) {
        const state = getOrderData.value?.order?.contract_state

        if (state) {
            if ([-1,-2].includes(state)) {
                return 'red'
            }

            if ([3,4].includes(state)) {
                return 'green'
            }
        }

    }

    return false
});



</script>

<style lang="css" scoped>
.icon {
    width: 50px;
    height: 50px;
    position: absolute;
    z-index: 100;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    right: 0;
    background: color-mix(in srgb, var(--green-a), transparent 50%);
    display: none;
}


.icon.visible {
    display: flex;
}

.icon i {
    font-size: 20px;
    font-weight: bold;
    color: var(--text-w);
}

.circle {
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
}

.icon.red {
    background: color-mix(in srgb, var(--red-a), transparent 50%);
}

.icon.green {
    background: color-mix(in srgb, var(--green-a), transparent 50%);
}


.circle.red {
    background: var(--red-a);
}

.circle.green {
    background: var(--green-a);
}
</style>