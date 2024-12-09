<template>
    <div class="card">
        <Dialog v-model:visible="bookConfigDialog" :style="{ width: '400px' }" header="Edit Book" :modal="true"
            :draggable="false" dismissableMask>


            <template #default>
                <div class="dialog-content">
                    <div class="dialog-row">
                        <Message severity="secondary" icon="pi pi-exclamation-circle">
                            The product book allows to manage keeping stock, stock ready to sell and stock blocked by
                            active orders in the blockchain.
                        </Message>
                    </div>
                    <div class="dialog-row">
                        <div class="dialog-content-title">
                            Configuration
                        </div>
                        <InputGroup>
                            <InputNumber v-model="bookForm.keeping_stock" type="number" placeholder="Stock"
                                :invalid="bookFormErrors.keeping_stock" :min="0" :useGrouping="false"
                                :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)' }" />

                            <InputNumber v-model="bookForm.ready_stock" type="number" placeholder="Ready To Sell"
                                :invalid="bookFormErrors.ready_stock" :min="0" :useGrouping="false"
                                :inputStyle="{ borderRadius: 'var(--p-inputtext-border-radius)', marginLeft: '1rem' }" />
                        </InputGroup>
                    </div>
                    <div class="dialog-row">
                        <Message severity="secondary" icon="pi pi-exclamation-circle">
                            Disable purchases disables the option to purchase the product.
                        </Message>
                    </div>

                    <div class="dialog-row">
                        <div class="dialog-content-title">
                            Disable Purchases
                        </div>
                        <ToggleSwitch v-model="bookForm.disable_purchases" />
                    </div>
                </div>
            </template>

            <template #footer>
                <Button label="Discard" variant="outlined" @click="bookConfigDialog = false" />
                <Button label="Done" @click="onConfigDone" />
            </template>
        </Dialog>

        <!--/////////////////////////-->

        <Toolbar class="mb-6">
            <template #start>
                <Button icon="pi pi-chevron-left" class="mr-2" text severity="secondary" @click="goBack" />

                <Breadcrumb :model="navItems">
                    <template #item="{ item }">
                        <span style="font-weight: 600;">{{ item.label }}</span>
                    </template>
                    <template #separator> / </template>
                </Breadcrumb>
            </template>

            <template #end>
                <IconField style="margin-right: 1rem;">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                </IconField>

                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>


        <DataTable class="card-datatable" ref="dt" :value="books" dataKey="id" :paginator="true" :rows="15"
            :filters="filters" @page="updateCursor()" @rowSelect="goEditProduct" selectionMode="single"
            paginatorTemplate="PrevPageLink   NextPageLink  CurrentPageReport"
            currentPageReportTemplate="Showing {first} to {last}">
            <template #paginatorstart>
                <div style="color: var(--text-b);">
                    <span>{{ bookCount }} Books</span>
                </div>
            </template>

            <template #header>
                <div class="datatable-header">
                    <RouterLink to="/create-product">
                        .
                    </RouterLink>
                </div>
            </template>


            <Column header="Image">
                <template #body="slotProps">
                    <img :src="buildImageUrl(slotProps.data)" :alt="slotProps.data.image" class="datatable-image" />
                </template>

            </Column>


            <Column field="id" header="ID" sortable style="max-width: 8rem">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>

                <template #body="slotProps">
                    {{ formatWithDots(slotProps.data.id, 7) }}
                </template>
            </Column>

            <Column field="sku" header="SKU" sortable style="max-width: 8rem">
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

            <Column field="collateral" header="Collateral" sortable style="min-width: 8rem;">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.collateral) }}
                </template>
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="book_keeping_stock" header="Keeping" sortable
                style="min-width: 4rem; text-transform: capitalize;">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="book_ready_stock" header="Ready" sortable
                style="min-width: 4rem; text-transform: capitalize;">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="book_blocked_stock" header="Locked" sortable
                style="min-width: 4rem; text-transform: capitalize;">
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>

            <Column field="book_ready_stock" header="ST" sortable style="min-width: 4rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.book_ready_stock ? '' : ''"
                        :severity="getLabelColor(slotProps.data.book_ready_stock ? 1 : 0)" />
                </template>
                <template #sorticon="{ sortOrder }">
                    <i v-if="sortOrder === 0" class="pi pi-sort-alt arrow" />
                    <i v-else-if="sortOrder === 1" class="pi pi-arrow-up arrow" />
                    <i v-else-if="sortOrder === -1" class="pi pi-arrow-down arrow" />
                </template>
            </Column>


            <Column :exportable="false" style="min-width: 4rem">
                <template #body="slotProps">
                    <div class="datatable-control">
                        <Button icon="pi pi-cog" outlined size="small" rounded
                            @click="beforeEditBook(slotProps.data)" />

                        <Button icon="pi pi-eye" outlined size="small" rounded />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
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
    { label: 'Product Books' }
]);

const showSuccess = (content) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: content, life: 5000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

const queryOptions = {
    pollInterval: 1500,
    clientId: "gateway"
}

const variablesRef = ref({
    "getBooksVariable": {
        "cursor": "NOT"
    }
})

const { result: getBooksResult, onError: onGetBooksError } = useQuery(gql`
query($getBooksVariable: GetBooksInput!){
    getBooks(getBooksInput: $getBooksVariable){
        books {
            id
            name
            price
            collateral
            sku
            media_url
            image_path
            image_set
            discount
            discount_value            
            created_at
            book_keeping_stock
            book_ready_stock
            book_blocked_stock
        }

        cursor
        count
    }
}
`,
    () => (variablesRef.value),
    queryOptions
);

onGetBooksError(error => {
    showError("The connection to the server has failed, please try again later.");
})

const updateCursor = () => {
    variablesRef.value = {
        getBooksVariable: {
            cursor: getBooksResult.value?.getBooks.cursor
        }
    }
}

const booksTemp = ref([]);

const books = computed(() => booksTemp.value);

watch(getBooksResult, value => {
    if (value) {
        booksTemp.value.push(...value.getBooks.books)
    }
}, { immediate: true })

const bookCount = computed(() => getBooksResult.value?.getBooks.count);

const dt = ref();

const bookConfigDialog = ref(false);

const bookForm = ref({
    keeping_stock: null,
    ready_stock: null,
    disable_purchases: false
});

const bookFormErrors = ref({
    keeping_stock: false,
    ready_stock: false,
    disable_purchases: false
});

const selectedBook = ref(null);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const { mutate: sendUpdateBook, onError: onUpdateBookError, onDone: onUpdateBook } = useMutation(gql`
    mutation($updateBookVariable: UpdateBookInput!){
        updateBook(updateBookInput: $updateBookVariable){
            success
        }
    }
`,
    {
        clientId: "gateway"
    }
)

onUpdateBookError(error => {
    showError(error);
})

onUpdateBook(result => {
    showSuccess("The book has been updated.");
})

const onConfigDone = () => {
    sendUpdateBook({
        "updateBookVariable": {
            "id": selectedBook.value.id,
            "keeping_stock": bookForm.value.keeping_stock,
            "ready_stock": bookForm.value.ready_stock,
            "disable_purchases": bookForm.value.disable_purchases
        }
    });

    booksTemp.value = [];
    bookConfigDialog.value = false;
}

const formatSKU = (value) => {
    if (value) {
        return value.split(":")[0]
    }
};

const buildImageUrl = (data) => {
    return data.media_url + data.image_path + data.image_set.split(",")[0]
}

const beforeEditBook = (data) => {
    selectedBook.value = data;

    bookConfigDialog.value = true;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const getLabelColor = (status) => {
    switch (status) {
        case 1:
            return 'success';
        case 0:
            return 'danger';

        default:
            return null;
    }
};

const goBack = () => {
    router.go(-1)
}

const goEditProduct = (event) => {
    router.push({
        name: 'edit-product',
        params: {
            id: event.data.id
        }
    })
}
</script>


<style scoped>
::v-deep(.p-toolbar) {
    padding: 0 1rem;
    background: transparent;
    border-radius: 1rem;
}

::v-deep(button) {
    font-size: var(--text-size-a);
}

::v-deep(.p-inputtext) {
    font-size: var(--text-size-a);
}


::v-deep(.p-datatable-header) {
    background: transparent;
    border: none;
}

::v-deep(.p-datatable-header-cell) {
    background: transparent;
    border-top: 1px solid var(--border-a);
}

::v-deep(.p-datatable-paginator-bottom) {
    border: none;
    padding: 0.2rem;
}

::v-deep(.p-datatable-column-title) {
    font-weight: 600;
}

.p-datatable {
    font-size: var(--text-size-a);
    border: 1px solid var(--border-a);
    border-radius: 1rem;
}

.p-tag {
    font-size: var(--text-size-a);
    font-weight: 600;
}

.card {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
}

.dialog-title {
    font-size: var(--text-size-c);
    color: var(--text-a);
    font-weight: 700;
}

.dialog-content {
    min-height: 500px;
}

.dialog-row {
    margin-bottom: 1.5rem;
}

.dialog-content-title {
    font-size: var(--text-size-a);
    margin-bottom: 0.5rem;
    color: var(--text-b);
    font-weight: 600;
}

.card-datatable {
    margin-top: 1rem;
}

.datatable-header {
    display: flex;
    align-items: center;
}

.datatable-image {
    background: var(--background-b);
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: contain;
    border: 1px solid var(--border-a);
}

.datatable-control {
    display: flex;
    justify-content: center;
}

.datatable-control button {
    margin-left: 1rem;
}


.arrow {
    font-size: 12px;
}
</style>