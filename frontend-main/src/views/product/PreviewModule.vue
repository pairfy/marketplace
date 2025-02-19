<template>
    <div class="preview" v-if="getProductData">

        <div class="preview-name">
            {{ getProductData.name }}
        </div>

        <div class="preview-model">
            <span>Model {{ getProductData.model }} <span>
                </span> SKU {{ getProductData.sku.split(":")[0] }} </span>
            <span class="gray"> +{{ getProductData.sold }} Sold</span>
        </div>

        <Divider />

        <div class="preview-price flex">
            <div>US $</div>
            <span>
                {{ formatCurrency(
                    applyDiscount(getProductData.discount,
                        getProductData.price,
                        getProductData.discount_value)
                ) }}
            </span>
        </div>

        <div class="preview-discount" v-if="getProductData.discount">
            <TagComp :tag="`- ${getProductData.discount_value}%`" type="contrast" />


            <TagComp :tag="`${formatCurrency(getProductData.price)} USD`" type=""
                style="margin: 0 1rem; text-decoration: line-through;" />


            <TagComp :tag="`${convertUSDToADA(
                applyDiscount(getProductData.discount,
                    getProductData.price,
                    getProductData.discount_value), getADAprice)} ADA`" type="" />

        </div>

        <Divider />

        <div class="preview-color flex ">
            <span>Color</span>
            <span>:</span>
            <label> {{ getProductData.color_name }}</label>
            <div :style="{ backgroundColor: `#${getProductData.color}` }" />
        </div>

        <div class="preview-condition flex">
            <span>Condition</span>
            <span>:</span>
            <label> {{ getProductData.quality }}</label>
        </div>

        <div class="preview-about">About this item</div>
        <ul class="preview-bullet">
            <li v-for="item in bulletList" :key="item">{{ item }}</li>
        </ul>

        <div class="preview-keywords">
            <Tag severity="secondary" style="margin-right: 1rem;" v-for="item in keywordList" :key="item">
                <span>{{ item }}</span>
            </Tag>
        </div>
    </div>

</template>

<script setup>
import headerAPI from '@/components/header/api';
import TagComp from '@/components/TagComp.vue';
import productAPI from '@/views/product/api/index';
import { inject, computed } from 'vue';

const { formatCurrency, applyDiscount, convertUSDToADA } = inject('utils');

const { getADAprice } = headerAPI();

const { getProductData } = productAPI();

const bulletList = computed(() => {
    const strings = getProductData.value.bullet_list.split(",");

    return strings.sort((a, b) => a.length - b.length);
});

const keywordList = computed(() => {
    const datum = getProductData.value;

    if (datum) {
        return datum.keywords.split(',');
    }

    return []
})

</script>

<style lang="css" scoped>
.preview {
    min-height: 400px;
}

.preview-name {
    font-size: var(--text-size-4);
    line-height: 2.25rem;
    font-weight: 500;
}

.preview-rating {
    margin-top: 1rem;
}

.preview-price {
    margin-top: 1rem;
    font-weight: 500;
    font-size: var(--text-size-5);
}

.preview-price div {
    margin-right: 0.25rem;
}

.preview-discount {
    margin-top: 1rem;
}

.preview-model {
    display: flex;
    font-size: var(--text-size-1);
    margin-top: 1rem;
}

.preview-model span {
    margin-right: 1rem;
}

.preview-about {
    margin-top: 1rem;
    font-weight: 600;
    font-size: var(--text-size-2);
}

.preview-bullet {
    margin-top: 1rem;
    font-size: var(--text-size-1);
    padding-left: 1rem;
}

.preview-bullet li {
    line-height: 2rem;
    padding-left: 10px;
}

.preview-color,
.preview-condition {
    margin-top: 1rem;
    text-transform: capitalize;
}

.preview-color label,
.preview-condition label {
    font-weight: 600;
    margin: 0 0.5rem;
}

.preview-color div {
    width: 15px;
    height: 15px;
    border-radius: 50%;
}

.preview-keywords {
    margin-top: 1rem;
}
</style>