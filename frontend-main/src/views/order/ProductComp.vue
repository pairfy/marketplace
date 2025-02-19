<template>
    <Skeleton v-if="!getOrderData" width="80%" height="100%" />

    <div class="product" v-if="getOrderData">
        <div class="product-header flex">
            <img :src="productImageList[0]" alt="">

            <div class="product-name">
                {{ getOrderData.order.product_name }}
            </div>
        </div>

        <div class="product-card flex">
            <div class="product-card-box flex">
                <li class="flex">
                    <div>ID</div>
                    <div>{{ getOrderData.order.product_id }}</div>
                </li>
                <li class="flex">
                    <div>SKU</div>
                    <div>{{ getOrderData.order.product_sku.split(":")[0] }}</div>
                </li>
                <li class="flex">
                    <div>Brand</div>
                    <div>{{ getOrderData.order.product_brand }}</div>
                </li>
                <li class="flex">
                    <div>Price</div>
                    <div>{{ formatCurrency(getOrderData.order.product_price) }} USD</div>
                </li>
                <li class="flex">
                    <div>Collateral</div>
                    <div>{{ getOrderData.order.product_collateral }} ADA</div>
                </li>
                <li class="flex">
                    <div>Model</div>
                    <div>{{ getOrderData.order.product_model }}</div>
                </li>
            </div>
        </div>
        <div class="product-list">
            <ul>
                <li v-for="item of getOrderData.order.product_bullet_list.split(',')" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>

        <div class="product-features">
            <editor-content :editor="editor" />
        </div>
    </div>

</template>

<script setup>
import orderAPI from '@/views/order/api/index';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { inject, ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';

const { formatCurrency } = inject('utils');

const { getOrderData } = orderAPI();

const editor = ref(null);

const setupEditor = async () => {
    await nextTick(() => {
        editor.value = new Editor({
            editable: false,
            extensions: [
                StarterKit,
                TextStyle.configure({ types: [ListItem.name] }),
            ],
            editorProps: {
                attributes: {
                    class: 'editor-class',
                },
            },
            content: "",
        })


        if (editor) {
            editor.value.commands.setContent(JSON.parse(getOrderData.value.order.product_features));
        }
    });
}


const productImageList = computed(() => {
    let data = getOrderData.value.order;

    let result = [];

    if (data) {
        const splited = data.product_image_set.split(",")

        splited.forEach(element => {
            result.push(data.product_media_url + data.product_image_path + element)
        });
    }

    return result
})

onMounted(() => {
    setupEditor();
});

onBeforeUnmount(() => {
    editor.value.destroy()
})

</script>

<style lang="css" scoped>
.product {
    display: flex;
    flex-direction: column;
    width: 80%;
}

.product-name {
    font-weight: 500;
    font-size: var(--text-size-3);
    margin-left: 1rem;
}

.product-header {
    border: 1px solid var(--border-a);
    padding: 1rem;
    border-radius: 12px;
}


.product-header img {
    width: 100px;
    height: 100px;
    padding: 0.5rem;
    border-radius: 12px;
    display: flex;
    object-fit: contain;
    justify-content: center;
    align-items: center;
}

.product-card {
    border: 1px solid var(--border-a);
    border-radius: 12px;
    padding: 1rem;
    width: 100%;
    margin-top: 1rem;
    padding: 1rem;
}

.product-card-box {
    display: block;
    width: inherit;
}

.product-card-box li {
    list-style: none;
    justify-content: space-between;
    font-size: var(--text-size-1);
    line-height: 2rem;
}

.product-card-box li div:nth-child(1) {
    color: var(--text-b);
}

.product-list {
    border: 1px solid var(--border-a);
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 12px;
}

.product-list ul {
    padding-left: 1rem;
    justify-content: space-between;
    font-size: var(--text-size-1);
}

.product-list li {
    line-height: 2.25rem;
}

.product-features {
    border: 1px solid var(--border-a);
    margin-top: 1rem;
    border-radius: 12px;
    padding: 1.5rem;
}

::v-deep(.product-features ul) {
    padding-left: 1rem;
}

::v-deep(.editor-class) {
    line-height: 2.25rem;
    font-size: var(--text-size-1);
}
</style>