<template>
    <div class="pad">

        <PackageReceived />

        <ReturnButton />

        <CancelButton/>

        <AppealButton/>
        
    </div>
</template>

<script setup>

import ReturnButton from '@/views/order/ReturnButton.vue';
import PackageReceived from '@/views/order/PackageReceived.vue';
import CancelButton from '@/views/order/CancelButton.vue';
import AppealButton from '@/views/order/AppealButton.vue';

</script>

<style lang="css" scoped>
.pad button {
    margin-right: 1rem;
    font-weight: 600;
    font-size: var(--text-size-1);
}
</style>