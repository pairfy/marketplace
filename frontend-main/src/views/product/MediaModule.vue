<template>
    <div class="media">
        <Skeleton v-if="!getProductData" width="100%" height="100%" />

        <section v-if="getProductData">
            <div class="media-nav">
                <div class="media-item" :class="{ selected: selectedImageIndex === index }"
                    v-for="(item, index) in productImageList" :key="item" @click="selectImage(index)">
                    <img :src="item" alt="item">
                </div>
            </div>
            <div class="media-image">
                <Image :src="productImageList[selectedImageIndex]" alt="Image" width="200" previewIcon="pi-search" 
                    preview />
            </div>
        </section>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import productAPI from '@/views/product/api/index';

const { getProductData } = productAPI();

const selectedImageIndex = ref(0);

const productImageList = computed(() => {
    let data = getProductData.value;

    let result = [];

    if (data) {
        const splited = data?.image_set.split(",")

        splited.forEach(element => {
            result.push(data.media_url + data.image_path + element)
        });
    }

    return result
})

const selectImage = (index) => {
    selectedImageIndex.value = index;
}

</script>

<style lang="css" scoped>
section {
    display: flex;
}

.media-nav {
    display: flex;
    flex-direction: column;
}

.media-image {
    justify-content: center;
    display: flex;
    align-items: center;
    width: 100%;
}

.media-item {
    border: 1px solid var(--border-a);
    border-radius: 8px;
    width: 56px;
    height: 56px;
    margin-bottom: 1rem;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.media-item.selected {
    border: 2px solid var(--text-a);
}

.media-item img {
    width: 50px;
    height: 50px;
    object-fit: contain;
}

::v-deep(.p-image-preview-mask:hover) {
    background: transparent !important;
}
</style>