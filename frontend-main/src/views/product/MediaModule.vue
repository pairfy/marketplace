<template>
    <div class="media">
        <section v-if="getProductData">
            <div class="nav">
                <div class="nav-item flex" :class="{ selected: selectedImageIndex === index }"
                    v-for="(item, index) in productImageList" :key="item" @click="selectImage(index)"
                    @mouseover="selectImage(index)">
                    <img :src="item" alt="item">
                </div>
            </div>

            <div class="media-image">
                <Image :src="productImageList[selectedImageIndex]" alt="Image" :imageStyle="{ width: '100%', maxWidth: '600px', maxHeight: '600px', borderRadius: '0px' }"
                    previewIcon="pi-search" preview />
            </div>
        </section>

    </div>
</template>

<script setup>
import productAPI from '@/views/product/api/index';
import { computed, ref } from 'vue';

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

.nav {
    display: flex;
    flex-direction: column;
    padding-left: 2px;
}

.nav-item {
    border: none;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    justify-content: center;
    margin-bottom: 1rem;
    width: 70px;
    height: 70px;
    border: 1px solid var(--border-a);
}

.nav-item.selected {
    border: none;
    outline: 2px solid var(--text-a);
}

.nav-item img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.media-image {
    justify-content: center;
    align-items: flex-start;
    min-height: 600px;
    max-height: 600px;
    display: flex;
    width: 100%;
}

::v-deep(.p-image-preview-mask:hover) {
    background: transparent !important;
}
</style>