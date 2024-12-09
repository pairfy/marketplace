<template>
    <div class="wrap">
        <div class="mask" />
        <div class="container">
            <div class="card-header">
                <span @click="backRoute">Back</span>
                <div class="flex" style="margin: 0 0.5rem;">
                    <i class="pi pi-angle-right" />
                </div>
                <span>Home</span>
                <div class="flex" style="margin: 0 0.5rem;">
                    <i class="pi pi-angle-right" />
                </div>
                <span>Categories</span>
                <div class="flex" style="margin: 0 0.5rem;">
                    <i class="pi pi-angle-right" />
                </div>
                <span>{{ getProductData?.category }}</span>
            </div>
            <div class="card">
                <div class="card-left">
                    <div class="card-image-preview">
                        <MediaModule />
                        <PreviewModule />
                    </div>

                    <Divider/>
                    <DescriptionModule/>
                </div>
                <div class="card-right">
                    <BuyModule />
                </div>
            </div>

            <div class="footer">
                
            </div>
        </div>
    </div>
</template>

<script setup>
import gql from 'graphql-tag';
import productAPI from '@/views/product/api/index';
import MediaModule from './MediaModule.vue';
import PreviewModule from './PreviewModule.vue';
import DescriptionModule from '@/views/product/DescriptionModule.vue';
import BuyModule from "@/views/product/BuyModule.vue"
import { useRouter, useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from "vue";

const { setProductData, getProductData } = productAPI();

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000, closable: false });
};

const route = useRoute()

const router = useRouter()

const backRoute = () => {
    router.go(-1)
}

const queryVariablesRef = ref({
    "getProductVariable": {
        "id": null
    }
})
const queryEnabled = ref(false)

const { result: getProductResult, onError: onGetProductError } = useQuery(gql`
query ($getProductVariable: GetProductInput!) {
    getProduct(getProductInput: $getProductVariable) {
        id
        name
        price
        collateral
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

watch(
    () => route.params.id,
    (id) => {
        if (id) {
            queryEnabled.value = true;
            updateQueryVariables(id)
        }
    },
    { immediate: true }
);

watch(getProductResult, value => {
    if (value) {
        console.log(value);
        setProductData(value.getProduct)
    }
})

onGetProductError(error => {
    showError(error);
})



</script>

<style lang="css" scoped>
.wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--background-b);
}

.mask {
    height: 250px;
    width: inherit;
    position: relative;
    z-index: 1;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("https://http2.mlstatic.com/D_NQ_898353-MLA80842011878_122024-OO.webp");
}

.container {
    display: flex;
    flex-direction: column;
    margin-top: -100px;
    max-width: 1200px;
    width: 80%;
    height: auto;
    position: relative;
    z-index: 10;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    overflow: hidden;
    background: var(--background-a);
}

.card-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    background: var(--background-b);
    font-size: var(--text-size-a);
    color: var(--text-b);
    border: 1px solid var(--border-a);
    border-bottom: none;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
}

.card {
    display: grid;
    grid-template-columns: 75% 25%;
    padding: 1.5rem;
    box-sizing: border-box;
    border: 1px solid var(--border-a);
}

.card-left {
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-right: 1.5rem;
}

.card-right {
    min-height: 100vh;
}

.card-image-preview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.footer {
    height: 200px;
    display: flex;
}
</style>