<template>
    <div class="buy">
        <Dialog v-model:visible="showBuyDialog" modal header="Transaction" :style="{ width: '25rem' }"
            :draggable="false">
            <template #header>

            </template>

            <div class="dialog-sub">Buy ({{ selectedQuantity.code }}) units</div>

            <div class="dialog-name">
                Razer - Blade 16 - 16" Gaming Laptop -
                OLED QHD + 240 Hz
                - Intel i9 -14900HX - NVIDIA GeForce RTX 4080 - 32 GB RAM - 1 TB SSD - Black
            </div>



            <div class="dialog-total">
                Total: {{ computedTotalPrice }} ADA
            </div>


            <div class="dialog-msg">
                <Message size="small" icon="pi pi-exclamation-circle" severity="info">
                    The transaction is valid for 5 minutes. The seller has 1 hour to respond otherwise your money will
                    be refunded.
                </Message>
            </div>


            <template #footer>
                <Button label="Cancel" text severity="secondary" @click="showBuyDialog = false" autofocus />
                <Button label="Buy" outlined severity="secondary" @click="onConfirmedBuy" autofocus />
            </template>
        </Dialog>


        <Skeleton v-if="!getProductData" width="100%" height="500px" />

        <div v-if="getProductData">
            <div class="buy-brand">
                {{ getProductData.brand }}
            </div>

            <div class="buy-sku">
                <span>SKU: {{ getProductData.sku.split(":")[0] }}</span>
            </div>

            <div class="buy-stock" :class="{ green: 15 > 0, }">
                {{ getStockLabel(15) }}
            </div>


            <div class="buy-rating flex">
                <Rating v-model="productRating" :stars="5" readonly />
                <span> 4.5 </span>
                <span style="color: var(--text-b)">(1250 reviews)</span>
            </div>

            <div class="buy-available">
                Available (15 of 20)
            </div>

            <div class="buy-control">
                <Select v-model="selectedQuantity" :options="quantityOptions" optionLabel="name" placeholder="Units"
                    variant="filled" size="small" />
                <Button label="Buy Now" fluid @click="openBuyDialog()" />
                <Button label="Add to Cart" fluid outlined />
            </div>
        </div>
    </div>
</template>

<script setup>
import headerAPI from '@/components/header/api';
import productAPI from '@/views/product/api/index';
import gql from 'graphql-tag';
import { ref, computed, inject } from "vue";
import { useMutation } from '@vue/apollo-composable';
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";

const { applyDiscount, convertUSDToADA } = inject('utils');


const { getADAprice } = headerAPI();

const { getProductData } = productAPI();

const toast = useToast();

const showSuccess = (content) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: content, life: 5000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

const selectedQuantity = ref({ name: '1', code: 1 });

const computedTotalPrice = computed(() => {
    let product = getProductData.value;

    if (product) {
        let discounted = applyDiscount(product.discount,
            product.price,
            product.discount_value
        );

        let price = convertUSDToADA(discounted, getADAprice.value);

        return price * selectedQuantity.value.code
    }

    return 0;
})

const quantityOptions = ref([
    { name: '1', code: 1 },
    { name: '2', code: 2 },
    { name: '3', code: 3 },
    { name: '4', code: 4 },
    { name: '5', code: 5 },
    { name: '6', code: 6 },
    { name: '7', code: 7 },
    { name: '8', code: 8 },
    { name: '9', code: 9 },
    { name: '10', code: 10 }
]);

const productRating = ref(4);

const getStockLabel = (readyStock) => {
    return readyStock > 0 ? "In Stock" : "Out Stock";
}

const showBuyDialog = ref(false);

const openBuyDialog = () => {
    showBuyDialog.value = true;
}

const { mutate: sendMessage, loading: sendMessageLoading, onError: onCreateOrderError, onDone: onOrderCreated } = useMutation(gql`
mutation($createOrderVariable: CreateOrderInput!){
    createOrder(createOrderInput: $createOrderVariable){
        success
        payload {
            cbor
        }
    }
}
`,
    {
        clientId: 'gateway'
    })

onCreateOrderError(error => {
    showError(error);
})


onOrderCreated(async result => {
    const response = result.data;

    if (response.createOrder.success === true) {
        try {
            const txHash = await balanceTx(response.createOrder.payload.cbor);

            showSuccess("Transaction submited");

            console.log(`Transaction submitted with hash: ${txHash}`);
        } catch (err) {
            console.error(err);

            showError(err);
        }
    }


})


const onConfirmedBuy = () => {
    sendMessage({
        "createOrderVariable": {
            "product_id": getProductData.value.id,
            "product_units": selectedQuantity.value.code,
        }
    })
}
</script>

<style lang="css" scoped>
.buy {
    border: 1px solid var(--border-a);
    border-radius: 8px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.buy-control {
    display: grid;
    gap: 0.5rem;
    margin-top: 1rem;
}

.buy-available {
    font-size: var(--text-size-a);
    font-weight: 400;
    margin-top: 1rem;
    color: var(--text-b);
}

.buy-brand {
    font-weight: 700;
    font-size: var(--text-size-a);
    text-transform: capitalize;
}

.buy-sku {
    margin-top: 1rem;
    font-size: var(--text-size-a);
}

.buy-legend {
    margin-top: 1rem;
}

.buy-rating {
    margin-top: 1rem;
}

.buy-rating span {
    margin-left: 0.5rem;
    font-size: var(--text-size-a);
}

.buy-stock {
    color: var(--red-a);
    font-weight: 600;
    margin-top: 1rem;
}

.buy-stock.green {
    color: var(--green-a);
}

.dialog-name {
    margin-top: 1rem;
}

.dialog-msg {
    margin-top: 1rem;
}

.dialog-sub {
    font-weight: 500;
}

.dialog-total {
    margin-top: 1rem;
    font-weight: 600;
    font-size: var(--text-size-c);
}
</style>