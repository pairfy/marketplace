<template>
    <main>
    <div class="card">
        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true"
            :draggable="false">
            <div class="card-message flex">
                <span v-if="selectedProduct">Are you sure you want to delete: <b>{{ selectedProduct.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" variant="outlined" @click="deleteProductDialog = false" />
                <Button label="Yes" @click="onDeleteConfirmed" style="color: var(--text-w)" />
            </template>
        </Dialog>

        <DataTable class="card-datatable" ref="dt" :value="products" dataKey="id" :paginator="true" :rows="15"
            :filters="filters" @page="updateCursor()" @rowSelect="editProduct" selectionMode="single"
            paginatorTemplate="PrevPageLink   NextPageLink  CurrentPageReport"
            currentPageReportTemplate="Showing {first} to {last}">
            <template #paginatorstart>
                <div style="color: var(--text-b);">
                    <span>{{ productCount }} Items</span>
                </div>
            </template>

            <template #header>
                <div class="datatable-header flex">
                    <div class="datatable-control">
                        <RouterLink to="/create-product">
                            <Button label="New" icon="pi pi-plus" variant="outlined" />
                        </RouterLink>

                        <Button label="Export" icon="pi pi-upload" variant="outlined" @click="exportCSV($event)" />
                    </div>

                    <div class="datatable-search">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>

                </div>
            </template>


            <Column header="Image">
                <template #body="slotProps">
                    <img :src="buildImageUrl(slotProps.data)" :alt="slotProps.data.image" class="datatable-image" />
                </template>

            </Column>

            <Column field="id" header="Id" sortable style="max-width: 8rem">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
                <template #body="slotProps">
                    {{ formatWithDots(slotProps.data.id, 7) }}
                </template>
            </Column>

            <Column field="sku" header="Sku" sortable style="max-width: 8rem">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>

                <template #body="slotProps">
                    {{ formatSKU(slotProps.data.sku) }}
                </template>
            </Column>
            <Column field="name" header="Name" sortable style="min-width: 8rem; text-transform: capitalize;">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>

                <template #body="slotProps">
                    {{ reduceByLength(slotProps.data.name, 50) }}
                </template>


            </Column>
            <Column field="price" header="Price" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <Tag :value="formatCurrency(slotProps.data.price)" severity="secondary" />
                </template>
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="discount_value" header="Discount" sortable
                style="min-width: 8rem; text-transform: capitalize;">
                <template #body="slotProps">
                    <div v-if="slotProps.data.discount">
                        <Tag :value="`- ${slotProps.data.discount_value}%`" severity="contrast" />
                    </div>
                    <div v-else>
                        -
                    </div>
                </template>
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="category" header="Category" sortable style="min-width: 8rem; text-transform: capitalize;">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="created_at" header="Date" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    {{ convertDate(slotProps.data.created_at) }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="paused" header="Active" sortable style="min-width: 4rem; ">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.paused ? '' : ''"
                        :severity="getLabelColor(slotProps.data.paused ? 1 : 0)" />
                </template>
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column :exportable="false" style="min-width: 4rem; border-right: none;">
                <template #body="slotProps">
                    <div class="datatable-control">
                        <Button icon="pi pi-trash" outlined size="small" rounded
                            @click="beforeDeleteProduct(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</main>
</template>

<script setup>
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import { ref, computed, watch } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { inject } from 'vue';

const { formatWithDots, reduceByLength, formatCurrency } = inject('utils')

const toast = useToast();

const router = useRouter();

const navItems = ref([
    { label: 'Dashboard' },
    { label: 'Product List' }
]);

const showSuccess = (content) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: content, life: 5000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

const queryOptions = {
    pollInterval: 1500,
}

const variablesRef = ref({
    "getProductsVariable": {
        "cursor": "NOT"
    }
})

const { result: getProductsResult, onError: onGetProductsError } = useQuery(gql`
query($getProductsVariable: GetProductsInput!){
    getProducts(getProductsInput: $getProductsVariable){
        products {
            id
            name
            sku
            price
            category
            paused
            media_url
            image_path
            image_set
            discount
            discount_value            
            created_at
        }

        cursor
        count
    }
}
`,
    () => (variablesRef.value),
    queryOptions
);

onGetProductsError(error => {
    showError("The connection to the server has failed, please try again later.");
})

const updateCursor = () => {
    variablesRef.value = {
        getProductsVariable: {
            cursor: getProductsResult.value?.getProducts.cursor
        }
    }
}

const productsTemp = ref([]);

const products = computed(() => productsTemp.value);

watch(getProductsResult, value => {
    if (value) {
        productsTemp.value.push(...value.getProducts.products)
    }
}, { immediate: true })

const productCount = computed(() => getProductsResult.value?.getProducts.count);

const dt = ref();

const deleteProductDialog = ref(false);

const selectedProduct = ref(null);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const { mutate: sendDeleteProduct, onError: onErrorDeleteProduct, onDone: onDeleteProduct } = useMutation(gql`
    mutation($deleteProductVariable: DeleteProductInput!){
        deleteProduct(deleteProductInput: $deleteProductVariable){
            success
        }
}
`)

onErrorDeleteProduct(error => {
    showError(error);
})

onDeleteProduct(result => {
    showSuccess("The product has been deleted successfully.");
})

const onDeleteConfirmed = () => {
    sendDeleteProduct({
        "deleteProductVariable": {
            "id": selectedProduct.value.id
        }
    });
    productsTemp.value = []
    deleteProductDialog.value = false;
}

const formatSKU = (value) => {
    if (value) {
        return value.split(":")[0]
    }
};

const convertDate = (timestamp) => {
    const date = dayjs(parseInt(timestamp));

    return date.format('YYYY-MM-DD');
}

const buildImageUrl = (data) => {
    return data.media_url + data.image_path + data.image_set.split(",")[0]
}

const beforeDeleteProduct = (data) => {
    selectedProduct.value = data;

    deleteProductDialog.value = true;
};

const exportCSV = () => {
    dt.value.exportCSV();
};


const goBack = () => {
    router.go(-1)
}

const editProduct = (event) => {
    router.push({
        name: 'edit-product',
        params: {
            id: event.data.id
        }
    })
}

const getLabelColor = (status) => {
    switch (status) {
        case 1:
            return 'warn';
        case 0:
            return 'success';

        default:
            return null;
    }
};

</script>


<style scoped>
::v-deep(.p-datatable-header) {
    background: transparent;
    border: none;
}

::v-deep(.p-datatable-header-cell) {
    background: transparent;
    border: 1px solid var(--border-a);
    border-left: none;
    color: var(--text-a);
}

::v-deep(.p-datatable-paginator-bottom) {
    border: none;
    padding: 0.2rem;
}

::v-deep(.p-datatable-column-title) {
    font-weight: 600;
}

.card {
    display: flex;
    flex-direction: column;
}

.card-message{
    line-height: 1.75rem;
    font-size: var(--text-size-2);
}

.card-datatable {
    background: var(--background-a);
}

.datatable-header {
    display: flex;
    align-items: center;
    justify-content: center;
}

.datatable-control {
    display: flex;
    justify-content: center;
}

.datatable-control button {
    margin-right: 1rem;
}

.datatable-search {
    margin-left: auto;
}

.datatable-image {
    background: var(--background-b);
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: contain;
    border: 1px solid var(--border-a);
}

.arrow {
    font-size: 12px;
}
</style>