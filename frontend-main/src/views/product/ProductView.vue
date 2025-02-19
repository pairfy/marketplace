<template>
    <div class="body">
        <div class="container">
            <div class="card-header">
                <span @click="backRoute">Back</span>
                <div class="flex">
                    <i class="pi pi-angle-right" />
                </div>
                <span>Home</span>
                <div class="flex">
                    <i class="pi pi-angle-right" />
                </div>
                <span>Categories</span>
                <div class="flex">
                    <i class="pi pi-angle-right" />
                </div>
                <span>{{ getProductData?.category }}</span>
            </div>
            <ProductCard />
            <Divider />
            <DescriptionModule />
        </div>
    </div>
</template>

<script setup>
import gql from 'graphql-tag';
import productAPI from '@/views/product/api/index';
import DescriptionModule from '@/views/product/DescriptionModule.vue';
import MiniGrid from '@/views/product/MiniGrid.vue';
import ProductCard from '@/views/product/ProductCard.vue';
import { onBeforeUnmount, ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable'
import { useToast } from "primevue/usetoast";

const toast = useToast();

const { setProductData, getProductData } = productAPI();

const route = useRoute()

const router = useRouter()

const queryVariablesRef = ref({
    "getProductVariable": {
        "id": null
    }
})
const queryEnabled = ref(false)

const { result: getProductResult, onError: onGetProductError } = useQuery(gql`
query ($getProductVariable: GetProductInput!) {
    getProduct(getProductInput: $getProductVariable) {
        success
        payload { 
            id
            name
            price
            sku
            model
            brand
            features
            category
            keywords
            bullet_list
            paused
            color
            color_name
            quality
            media_url
            image_path
            image_set
            video_set
            discount
            discount_value
            rating
            reviews
            best_seller
            sold
            available
        }
    }
}
`,
    () => (queryVariablesRef.value)
    ,
    () => ({
        enabled: queryEnabled.value,
        clientId: 'query'
    })
);


const updateQueryVariables = (id) => {
    queryVariablesRef.value = {
        getProductVariable: {
            id
        }
    }
}

const unwatchRoute = watch(
    () => route.params.id,
    (id) => {
        if (id) {
            queryEnabled.value = true;
            updateQueryVariables(id)
        }
    },
    { immediate: true }
);

const unwatchGetProduct = watch(getProductResult, value => {
    if (value) {
        setProductData(value.getProduct.payload)
    }
})

onGetProductError(error => {
    showError(error);
})

const backRoute = () => {
    router.go(-1)
}

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000, closable: true });
};

onBeforeUnmount(() => {
    unwatchRoute()
    unwatchGetProduct()
})

</script>

<style lang="css" scoped>
.body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--background-b);
}

.mask {
    height: 150px;
    width: inherit;
    position: relative;
    z-index: 1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: 15%;
}

.container {
    background: var(--background-a);
    border: 1px solid var(--border-a);
    border-radius: 6px;
    flex-direction: column;
    max-width: var(--body-a);
    position: relative;
    display: flex;
    width: 100%;
    height: auto;
    z-index: 10;
    overflow: hidden;
    padding: 1.5rem;
    margin-top: 1rem;
}

.card-header {
    display: flex;
    align-items: center;
    font-size: var(--text-size-0);
    text-transform: capitalize;
    border-bottom: none;
    color: var(--text-b);
}

.card-header div {
    margin: 0 0.5rem;
    color: var(--text-b);
}
</style>