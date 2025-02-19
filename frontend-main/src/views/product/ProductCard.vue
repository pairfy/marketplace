<template>
    <Skeleton v-if="!getProductData" width="100%" height="500px" style="margin-top:1rem" />
    <div class="card" v-if="getProductData">
        <section>
            <MediaModule />
            <PreviewModule />
        </section>
        
        <BuyModule />
    </div>
</template>

<script setup>
import MediaModule from './MediaModule.vue';
import PreviewModule from './PreviewModule.vue';
import productAPI from '@/views/product/api/index';
import BuyModule from "@/views/product/BuyModule.vue"

const { getProductData } = productAPI();


</script>

<style lang="css" scoped>
section {
    display: grid;
    grid-template-columns: 700px 1fr;
    gap: 1rem;
}

.card {
    display: grid;
    grid-template-columns: 80% 20%;
    box-sizing: border-box;
    margin-top: 1.5rem;
    padding-bottom: 50px;
}


</style>