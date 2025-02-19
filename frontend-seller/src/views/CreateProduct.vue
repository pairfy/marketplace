<template>
    <main>
        <div class="card">
            <div class="title">
                Create Product
            </div>

            <div class="card-wrap">
                <div class="left-column">
                    <div class="left-column-item">
                        <div class="formulary">
                            <InputText v-model="productName" type="text" placeholder="Name"
                                v-keyfilter='/^[a-zA-Z0-9("-°-–.”)/+$ ]+$/' :invalid="formErrors.name" />

                            <InputGroup>
                                <InputNumber v-model="productPrice" type="number" placeholder="Price"
                                    :invalid="formErrors.price" :min="0" :max="9999999" :useGrouping="false"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)' }" suffix=" USD" />


                                <InputText v-model="productSKU" type="text" placeholder="SKU"
                                    v-keyfilter="/^[a-zA-Z0-9-]+$/" :invalid="formErrors.sku"
                                    style="border-radius: var(--p-inputtext-border-radius); margin-left: 1rem;"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)' }"
                                    v-tooltip.right="'Stock keeping unit ID must be unique.'" />
                            </InputGroup>


                            <InputGroup>
                                <InputText v-model="productModel" type="text" placeholder="Model"
                                    style="margin-right: 1rem; border-radius: var(--p-inputtext-border-radius)"
                                    v-keyfilter="/^[a-zA-Z0-9/ -]+$/" :invalid="formErrors.model" />

                                <InputText v-model="productBrand" type="text" placeholder="Brand"
                                    v-keyfilter="/^[a-zA-Z0-9 ]+$/"
                                    style="border-radius: var(--p-inputtext-border-radius)"
                                    :invalid="formErrors.brand" />
                            </InputGroup>

                            <InputGroup>
                                <InputNumber v-model="productWeight" type="number" placeholder="Weight (kg)"
                                    :invalid="formErrors.weight" :min="0" :max="9999" :useGrouping="false"
                                    :minFractionDigits="0" :maxFractionDigits="3"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)' }" />

                                <InputNumber v-model="productLength" type="number" placeholder="Length (cm)"
                                    :invalid="formErrors.length" :min="0" :max="9999" :useGrouping="false"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)', marginLeft: '1rem' }"
                                    :minFractionDigits="0" :maxFractionDigits="2" />

                                <InputNumber v-model="productWidth" type="number" placeholder="Width (cm)"
                                    :invalid="formErrors.width" :min="0" :max="9999" :useGrouping="false"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)', marginLeft: '1rem' }"
                                    :minFractionDigits="0" :maxFractionDigits="2" />

                                <InputNumber v-model="productHeight" type="number" placeholder="Height (cm)"
                                    :invalid="formErrors.height" :min="0" :max="9999" :useGrouping="false"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)', marginLeft: '1rem' }"
                                    :minFractionDigits="0" :maxFractionDigits="2" />
                            </InputGroup>


                            <InputGroup>
                                <InputText v-model="productCity" type="text" placeholder="Origin City"
                                    v-keyfilter="{ pattern: /^[A-Za-z0-9.,'\- ]{1,100}$/, validateOnly: true }"
                                    :invalid="formErrors.origin"
                                    style="border-radius: var(--p-inputtext-border-radius);"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)' }"
                                    v-tooltip.right="'City from which the package is sent. Important to know the shipping time. Can affect your trust score.'" />

                                <InputText v-model="productPostal" type="text" placeholder="Origin Postal"
                                    v-keyfilter="{ pattern: /^[A-Za-z0-9.,'@+&/(~)°#\-\s]{1,50}$/, validateOnly: true }"
                                    :invalid="formErrors.postal"
                                    style="border-radius: var(--p-inputtext-border-radius); margin-left: 1rem;"
                                    :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)' }"
                                    v-tooltip.right="'Important to know the shipping time. Can affect your trust score.'" />
                            </InputGroup>
                        </div>
                    </div>
                    <!--/////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                    <div v-if="editor" class="editor" :class="{ invalid: formErrors.features }">
                        <div class="editor-control">
                            <div class="editor-control-group">
                                <button @click="editor.chain().focus().toggleBold().run()"
                                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                                    :class="{ 'is-active': editor.isActive('bold') }">

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linejoin="round"
                                            d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z" />
                                    </svg>
                                </button>

                                <button @click="editor.chain().focus().toggleItalic().run()"
                                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                                    :class="{ 'is-active': editor.isActive('italic') }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803" />
                                    </svg>
                                </button>

                                <button @click="editor.chain().focus().toggleStrike().run()"
                                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                                    :class="{ 'is-active': editor.isActive('strike') }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5" />
                                    </svg>
                                </button>
                            </div>

                            <div class="editor-control-group">
                                <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                                    :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.243 4.493v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501m4.501-8.627 2.25-1.5v10.126m0 0h-2.25m2.25 0h2.25" />
                                    </svg>

                                </button>
                                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M21.75 19.5H16.5v-1.609a2.25 2.25 0 0 1 1.244-2.012l2.89-1.445c.651-.326 1.116-.955 1.116-1.683 0-.498-.04-.987-.118-1.463-.135-.825-.835-1.422-1.668-1.489a15.202 15.202 0 0 0-3.464.12M2.243 4.492v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501" />
                                    </svg>

                                </button>

                                <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M20.905 14.626a4.52 4.52 0 0 1 .738 3.603c-.154.695-.794 1.143-1.504 1.208a15.194 15.194 0 0 1-3.639-.104m4.405-4.707a4.52 4.52 0 0 0 .738-3.603c-.154-.696-.794-1.144-1.504-1.209a15.19 15.19 0 0 0-3.639.104m4.405 4.708H18M2.243 4.493v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501" />
                                    </svg>
                                </button>
                            </div>

                            <div class="editor-control-group">
                                <button @click="editor.chain().focus().toggleBulletList().run()"
                                    :class="{ 'is-active': editor.isActive('bulletList') }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>

                                </button>
                                <button @click="editor.chain().focus().toggleOrderedList().run()"
                                    :class="{ 'is-active': editor.isActive('orderedList') }">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99" />
                                    </svg>
                                </button>
                            </div>

                            <span class="editor-control-counter">
                                {{ productEditorCounter }} / {{ editorLimit }}
                            </span>
                        </div>

                        <editor-content :editor="editor" />
                    </div>

                    <!--/////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                    <div class="left-column-item">
                        <div class="uploader" :class="{ invalid: formErrors.image_set }">
                            <Toast />
                            <FileUpload ref="fileupload" name="image" :url="mediaImagesURL"
                                @upload="onImagesUpload($event)" :withCredentials="true" :multiple="true"
                                accept="image/*" :maxFileSize="3000000" @select="onSelectedFiles">
                                <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                                    <div class="uploader-top">
                                        <div class="uploader-control">

                                            <Button @click="chooseCallback()" icon="pi pi-images" outlined
                                                severity="secondary" size="small" rounded />

                                            <Button @click="clearCallback()" icon="pi pi-times" outlined
                                                severity="secondary" :disabled="!files || files.length === 0"
                                                size="small" rounded />

                                            <Message severity="secondary" variant="simple"
                                                icon="pi pi-exclamation-circle">
                                                <span> The first image is the preview
                                                    thumbnail.</span>
                                            </Message>

                                            <Message severity="secondary" variant="simple"
                                                icon="pi pi-exclamation-circle">
                                                <span> {{ productImageSet.length }} /
                                                    {{ productImageSetLimit }}</span>
                                            </Message>
                                        </div>
                                    </div>
                                </template>
                                <template
                                    #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                                    <div class="uploader-content">
                                        <div v-show="files.length > 0" class="media-box" id="sortable-media">
                                            <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                                class="media-item" :data-id="file.name">
                                                <div>
                                                    <img role="presentation" :alt="file.name" :src="file.objectURL"
                                                        class="media-image" />
                                                </div>

                                                <div class="media-control">
                                                    <button
                                                        @click="onRemoveTemplatingFile(file, removeFileCallback, index)">

                                                        <i class="pi pi-times" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-show="uploadedFiles.length > 0" class="media-box">
                                            <div v-for="(file, index) of uploadedFiles"
                                                :key="file.name + file.type + file.size" class="media-item">
                                                <div>
                                                    <img role="presentation" :alt="file.name" :src="file.objectURL"
                                                        width="100" height="50" class="media-image" />
                                                </div>
                                                <Badge value="Completed" class="mt-4" severity="success" />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="uploader-empty" @click="chooseCallback()">
                                        <i class="pi pi-upload" />
                                        <p>Select images to upload.</p>
                                    </div>
                                </template>
                            </FileUpload>

                        </div>
                    </div>
                </div>
                <!--/////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                <div class="right-column">
                    <div class="box">
                        <div class="subtitle" v-tooltip="'List of important features'">
                            Bullet List
                        </div>

                        <div class="box-content">
                            <Button type="button" label="Generate" :loading="bulletListLoading"
                                @click="handleBulletList" style="font-size: var(--text-size-1); margin-bottom: 1rem"
                                variant="outlined" :disabled="!productEditorCounter" />


                            <AutoComplete inputId="productBulletList" v-model="productBulletList" multiple fluid
                                :typeahead="false" :inputStyle="{ fontSize: 'var(--text-size-1)' }"
                                :invalid="formErrors.bullet_list" size="large" placeholder=""
                                removeTokenIcon="pi pi-minus" />
                        </div>
                    </div>

                    <div class="box">
                        <div class="subtitle">
                            Category
                        </div>

                        <div class="box-content">
                            <Select v-model="productCategory" :options="productCategories" optionLabel="name"
                                placeholder="Select a category" style="font-size: var(--text-size-1)" fluid
                                :invalid="formErrors.category" />
                        </div>
                    </div>


                    <div class="box">
                        <div class="subtitle">
                            keywords
                        </div>

                        <div class="box-content">
                            <AutoComplete v-model="productKeywords" inputId="multiple-ac-2" multiple fluid
                                placeholder="Keywords" :typeahead="false"
                                :inputStyle="{ fontSize: 'var(--text-size-1)' }" :invalid="formErrors.keywords" />
                        </div>
                    </div>


                    <div class="box">
                        <div class="subtitle">
                            Color
                        </div>

                        <div class="box-content">

                            <div class="box-content-flex">
                                <InputText v-model="productColorName" type="text" placeholder="Color name"
                                    v-keyfilter="/^[a-zA-Z0-9 ]+$/" style="margin-right: 1rem;"
                                    :invalid="formErrors.color_name" />

                                <ColorPicker v-model="productColor" />
                            </div>

                        </div>
                    </div>

                    <div class="box">
                        <div class="subtitle">
                            Condition
                        </div>

                        <div class="box-content">
                            <SelectButton v-model="productQuality" :options="productQualityOptions"
                                aria-labelledby="basic" :invalid="formErrors.quality" />
                        </div>
                    </div>

                    <div class="box">
                        <div class="subtitle">
                            Discount

                            <span class="price-discount">
                                {{ discountResult }}
                            </span>
                        </div>

                        <div class="box-content">
                            <div class="box-content-flex">
                                <ToggleSwitch v-model="productDiscount" />

                                <InputNumber v-model="productDiscountValue" type="number" placeholder="OFF %"
                                    suffix=" %" showButtons :min="0" :max="99" :useGrouping="false"
                                    style="border-radius: var(--p-inputtext-border-radius); margin-left: 1rem;"
                                    :invalid="formErrors.discount" :disabled="!productDiscount" />

                            </div>
                        </div>
                    </div>


                    <div class="box">
                        <div class="subtitle" v-tooltip="'Pause the publication'">
                            Paused
                        </div>

                        <div class="box-content">
                            <ToggleSwitch v-model="productPaused" />
                        </div>
                    </div>


                    <div class="box-buttons">
                        <Button type="button" label="Discard" icon="pi pi-trash" :loading="sendMessageLoading" outlined
                            fluid />

                        <Button type="button" label="Publish" :loading="sendMessageLoading" @click="beforeCreate"
                            style="color: var(--text-w)" fluid />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import gql from 'graphql-tag';
import Sortable from 'sortablejs';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import dashboardAPI from "@/views/api"
import categories from '@/assets/categories.json'
import { onMounted, ref, nextTick, computed, onBeforeUnmount } from 'vue';
import { useToast } from "primevue/usetoast";
import { useMutation } from '@vue/apollo-composable';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { useRouter } from 'vue-router';
import { HOST } from '@/api';

const categoryList = ref(categories);

const { getBulletList } = dashboardAPI();

const fileupload = ref();

const uploadImages = () => {
    fileupload.value.upload();
}

const toast = useToast();

const router = useRouter();

const mediaImagesURL = computed(() => HOST + '/api/media/create-image')

////////////////////////////////////////////////////////////////

const productName = ref(null);

const productPrice = ref(null);

const productSKU = ref(null);

const productModel = ref(null);

const productBrand = ref(null);

const productWeight = ref(null);

const productLength = ref(null);

const productWidth = ref(null);

const productHeight = ref(null);

const productCity = ref(null);

const productPostal = ref(null);

const productBulletList = ref(null);

const productCategories = ref(
    Object.values(categoryList.value).map(item => ({
        name: item.name,
        code: item.name
    }))
);

const productCategory = ref(null);

const productKeywords = ref(null);

const productColor = ref("000000");

const productColorName = ref(null);

const productQualityOptions = ref(['New', 'Used', 'Refurbished']);

const productQuality = ref(null);

const productDiscount = ref(false);

const productDiscountValue = ref(0);

const productPaused = ref(false);

/////////////////////////////////////////////////////

const files = ref([]);

const editor = ref(null);

const editorLimit = ref(6000);

let sortableJs = null;

const setupSortable = async () => {
    await nextTick(() => {
        sortableJs = new Sortable(document.getElementById('sortable-media'), {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function (evt) {
                var items = document.querySelectorAll('.media-item');
                var orderArray = [];

                items.forEach(function (item) {
                    orderArray.push(item.getAttribute('data-id'));
                });


                files.value = orderArray.map(fileName => {
                    return files.value.find(file => file.name === fileName);
                });
            }
        });
    });
}

const setupEditor = async () => {
    await nextTick(() => {
        editor.value = new Editor({
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: 'Product description, terms of sale, warranty and others...',
                }),
                CharacterCount.configure({
                    limit: editorLimit.value,
                }),
                TextStyle.configure({ types: [ListItem.name] }),
            ],
            editorProps: {
                attributes: {
                    class: 'editor-class',
                },
            },
            content: ``,
        })
    });
}

onMounted(() => {
    setupSortable();

    setupEditor();
})


const productFeatures = computed(() => JSON.stringify(editor.value.getJSON()))

const bulletListLoading = ref(false);

const handleBulletList = async () => {

    if (editor) {
        bulletListLoading.value = true

        const content = editor.value.getHTML();

        const result = await getBulletList({ content });

        const { success, payload } = result.response;

        productBulletList.value = payload.split(",");

        bulletListLoading.value = false;
    }
}

const productImageSet = ref([])

const productImageSetLimit = ref(15);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    files.value.splice(index, 1);
    removeFileCallback(index);
};

const onSelectedFiles = (event) => {
    files.value = event.files;
};

const onImagesUpload = (data) => {
    const { payload } = JSON.parse(data.xhr.response);

    productImageSet.value.push(...payload);

    files.value = [];

    submitProduct();
};

const { mutate: sendMessage, loading: sendMessageLoading, onError: onErrorProductCreated, onDone: onProductCreated } = useMutation(gql`
mutation($createProductVariable: CreateProductInput!){
    createProduct(createProductInput: $createProductVariable){
        success
    }
}
`)

onErrorProductCreated(error => {
    showError(error);
})

onProductCreated(result => {
    showSuccess("The product has been created.");
})

const formErrors = ref({
    name: false,
    price: false,
    sku: false,
    model: false,
    brand: false,
    features: false,
    category: false,
    keywords: false,
    bullet_list: false,
    paused: false,
    color: false,
    color_name: false,
    quality: false,
    image_set: false,
    video_set: false,
    discount: false,
    shipping_weight: false,
    shipping_length: false,
    shipping_width: false,
    shipping_height: false,
    shipping_city: false,
    shipping_postal: false,
    shipping_instructions: false,
    shipping_fragile: false
});

const checkMandatory = () => {
    formErrors.value.name = productName.value === null;
    formErrors.value.price = productPrice.value === null;
    formErrors.value.sku = productSKU.value === null;
    formErrors.value.model = productModel.value === null;
    formErrors.value.brand = productBrand.value === null;
    formErrors.value.features = editor.value.storage.characterCount.characters() === 0;
    formErrors.value.category = productCategory.value === null;
    formErrors.value.keywords = productKeywords.value === null;
    formErrors.value.bullet_list = productBulletList.value === null;
    formErrors.value.color = productColor.value === null;
    formErrors.value.color_name = productColorName.value === null;
    formErrors.value.quality = productQuality.value === null;
    formErrors.value.discount = productDiscount.value && productDiscountValue.value < 1;
    formErrors.value.shipping_weight = productWeight.value === null;
    formErrors.value.shipping_length = productLength.value === null;
    formErrors.value.shipping_width = productWidth.value === null;
    formErrors.value.shipping_height = productHeight.value === null;
    formErrors.value.shipping_city = productCity.value === null;
    formErrors.value.shipping_postal = productPostal.value === null;
    formErrors.value.image_set = productImageSet.value.length > productImageSetLimit.value || productImageSet.value.length === 0;
    formErrors.value.video_set = false;

    return Object.values(formErrors.value).some(value => value === true);
}


const beforeCreate = () => {
    if (files.value.length) {
        return uploadImages();
    }

    submitProduct();
}

const submitProduct = () => {
    if (checkMandatory()) {
        return showError('Please check the required fields.');
    };

    sendMessage({
        "createProductVariable": {
            "name": productName.value,
            "price": parseInt(productPrice.value),
            "sku": productSKU.value,
            "model": productModel.value,
            "brand": productBrand.value,
            "features": productFeatures.value,
            "category": productCategory.value.code,
            "keywords": productKeywords.value.join(','),
            "bullet_list": productBulletList.value.join(','),
            "paused": productPaused.value ? 1 : 0,
            "color": productColor.value,
            "color_name": productColorName.value,
            "variations": "none",
            "quality": productQuality.value,
            "image_set": productImageSet.value.join(','),
            "video_set": "none",
            "discount": productDiscount.value,
            "discount_value": productDiscount.value ? productDiscountValue.value : 0,
            "shipping_weight": productWeight.value,
            "shipping_length": productLength.value,
            "shipping_width": productWidth.value,
            "shipping_height": productHeight.value,
            "shipping_city": productCity.value,
            "shipping_postal": productPostal.value,
            "shipping_instructions": "none",
            "shipping_fragile": false
        }
    })
}

const discountResult = computed(() => {
    if (productDiscountValue.value < 0 || productDiscountValue.value > 100) {
        throw new Error('Discount percentage must be between 0 and 100');
    }

    const discountAmount = (productPrice.value * productDiscountValue.value) / 100;

    const discountedPrice = productPrice.value - discountAmount;

    return Math.round(discountedPrice) + " USD";
})


const productEditorCounter = computed(() => {
    if (editor) {
        return editor.value?.storage.characterCount.characters()
    } else {
        return 0
    }
})

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy();
    }
});

const showSuccess = (content) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: content, life: 5000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};
</script>

<style scoped>
::v-deep(.p-progressbar) {
    height: 0.35rem;
}

::v-deep(.p-select-label) {
    font-size: var(--text-size-1);
}

::v-deep(.p-colorpicker-preview) {
    border-radius: 50%;
}

::v-deep(.p-chip) {
    font-size: var(--text-size-1);
}

::v-deep(.p-message-text) {
    font-size: var(--text-size-1);
}

::v-deep(.p-togglebutton) {
    font-size: var(--text-size-1);
}

::v-deep(.p-fileupload-header) {
    padding: 0.5rem;
    background: transparent;
}

.card {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    background: var(--background-a);
}

.title {
    margin-bottom: 1.5rem;
    font-weight: 700;
    font-size: var(--text-size-2);
}

.card-wrap {
    display: grid;
    grid-template-columns: 70% 30%;
}

.left-column {
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    grid-template-columns: 1fr;
    gap: 1rem;
}

.formulary {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.right-column {
    margin-left: 2rem;
    display: flex;
    flex-direction: column;
}

.box {
    border: 1px solid var(--border-a);
    border-radius: .25rem;
    margin-bottom: 1rem
}

.subtitle {
    border-bottom: 1px solid var(--border-a);
    font-size: var(--text-size-1);
    font-weight: 700;
    padding: 1rem;
}

.box-content {
    padding: 1rem;
}

.box-content-flex {
    display: flex;
    align-items: center;
}

.box-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.media-box {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    border: 1px solid var(--border-a);
    padding: 1rem;
    margin-bottom: 1rem;
}

.media-item {
    overflow: hidden;
    height: 150px;
    text-align: center;
    border: 1px solid var(--border-a);
    cursor: grab;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.media-item button {
    border-radius: 4px;
    background: transparent;
    color: var(--text-b);
    font-size: var(--text-size-1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0.5rem;
    border: 1px solid var(--border-a);
    cursor: pointer;
}

.media-item button i {
    font-size: 12px;
}

.media-image {
    height: 90px;
    width: 90px;
    object-fit: contain;
}

.media-control {
    display: flex;
    align-items: center;
}

.media-preview {
    width: 100px;
    height: 100px;
    object-fit: contain;
}

.uploader-top {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.uploader-control {
    display: flex;
    gap: 1rem;
}

.uploader-bar {
    margin-top: 1rem;
}

.uploader-empty {
    height: 320px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: var(--text-size-1);
    color: var(--text-b);
}

.uploader-empty i {
    font-size: 4rem;
}

.uploader-empty p {
    font-size: 1rem;
    margin-top: 1rem;
}

.uploader-content {
    display: flex;
    flex-direction: column;
}

::v-deep(.editor-class) {
    height: auto;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 1rem;
    color: var(--text-a);
    font-size: var(--text-size-1);
    outline: none;
    box-sizing: border-box;
}

::v-deep(.editor-class::-webkit-scrollbar) {
    width: 13px;
}

::v-deep(.editor-class::-webkit-scrollbar-track) {
    background: transparent;
}

::v-deep(.editor-class::-webkit-scrollbar-thumb) {
    background-color: #888;
    border-radius: 4px;
    border: 2px solid #f1f1f1;
    cursor: pointer;
}

::v-deep(.editor-class::-webkit-scrollbar-thumb:hover) {
    background-color: #3b3b3b;
}

::v-deep(.is-editor-empty:first-child::before) {
    color: var(--text-b);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

.editor {
    overflow: auto;
    height: 400px;
    border: 1px solid var(--border-a);
    border-radius: 5px 5px 0 0;
    display: block;
}

.invalid {
    border: 1px solid var(--p-red-400);
    border-radius: 5px 5px 0 0;
}

.editor-control {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid var(--border-a);
}

.editor-control-group {
    display: flex;
    margin-right: 1rem
}

.editor-control button {
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: 1px solid var(--border-a);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-b);
    margin-right: 0.5rem;
    cursor: pointer;
}

.editor-control button svg {
    width: var(--text-size-2);
    height: var(--text-size-2);
}

.editor-control button.is-active {
    border: 1px solid gray;
}

.editor-control-counter {
    font-size: var(--text-size-1);
    color: var(--text-b);
}

.price-discount {
    background: var(--background-b);
    font-size: var(--text-size-1);
    margin-left: 1rem;
    padding: 5px;
    font-weight: 400;
    border-radius: 0.25rem;
    white-space: nowrap;
}



/* Extra small devices (phones, 320px and up) */
@media (min-width: 320px) {}

/* Small devices (landscape phones, 480px and up) */
@media (min-width: 480px) {}

/* Medium devices (tablets, 768px and up) */
@media (max-width: 768px) {
    .card-wrap {
        grid-template-columns: 1fr;
    }

    ::v-deep(.editor-class) {
        width: 700px;
    }
}

/* Large devices (laptops/desktops, 1024px and up) */
@media (min-width: 1024px) {}

/* Extra large devices (large laptops/desktops, 1200px and up) */
@media (min-width: 1200px) {}

/* Ultra-wide screens (1440px and up) */
@media (min-width: 1440px) {}

/* 4K screens (2560px and up) */
@media (min-width: 2560px) {}
</style>