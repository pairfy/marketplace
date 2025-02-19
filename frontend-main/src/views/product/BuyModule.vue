<template>
    <Skeleton v-if="!getProductData" width="100%" height="500px" />

    <div class="card" v-if="getProductData">
        <Dialog v-model:visible="toggleDialog" modal header="Payment" :style="{ width: '56rem', height: '60rem' }"
            :draggable="false" dismissableMask>

            <div class="dialog">
                <div class="grid">
                    <div class="grid-item left">
                        <div class="dialog-row">
                            <div class="dialog-title flex">
                                Shipping Address
                            </div>

                            <div class="dialog-country flex">
                                <img :alt="getLocationData?.country" src="@/assets/flag_placeholder.png"
                                    :class="`flag flag-${getLocationData?.country.toLowerCase()}`" />

                                <span>{{ getLocationData?.name }}, {{ getLocationData?.country }}</span>
                            </div>


                            <div class="dialog-input">
                                <IftaLabel>
                                    <InputText id="city" v-model="orderForm.city" fluid placeholder="Miami, Florida"
                                        :invalid="orderFormErrors.city" autofocus
                                        v-keyfilter="{ pattern: /^[A-Za-z0-9.'\- ]{1,100}$/, validateOnly: true }" />

                                    <label for="city">City / State / Department</label>
                                </IftaLabel>
                            </div>

                            <div class="dialog-input">
                                <IftaLabel>
                                    <InputText id="address" v-model="orderForm.address" fluid placeholder=""
                                        :invalid="orderFormErrors.address"
                                        v-keyfilter="{ pattern: /^[A-Za-z0-9.,'@+&/()°#\-\s]{1,150}$/, validateOnly: true }" />

                                    <label for="address">Address</label>
                                </IftaLabel>
                            </div>

                            <div class="dialog-input">
                                <IftaLabel>
                                    <InputText id="name" v-model="orderForm.receiver" fluid
                                        :invalid="orderFormErrors.receiver"
                                        v-keyfilter="{ pattern: /^[A-Za-z0-9 ]{1,100}$/, validateOnly: true }" />
                                    <label for="name">Receiver Name</label>
                                </IftaLabel>
                            </div>

                            <div class="dialog-input">
                                <IftaLabel>
                                    <InputText id="postal" v-model="orderForm.postal" fluid
                                        :invalid="orderFormErrors.postal"
                                        v-keyfilter="{ pattern: /^[A-Za-z0-9.,'@+&/(~)°#\-\s]{1,50}$/, validateOnly: true }" />
                                    <label for="postal">ZIP/Postal</label>
                                </IftaLabel>
                            </div>

                            <div class="dialog-input">
                                <IftaLabel>
                                    <InputText id="indications" v-model="orderForm.other" fluid
                                        v-keyfilter="{ pattern: /^[A-Za-z0-9 ]{1,100}$/, validateOnly: true }" />
                                    <label for="name">Other Indications / Contact ( optional )</label>
                                </IftaLabel>
                            </div>

                            <div class="dialog-message">
                                <Message severity="secondary">
                                    Data is encrypted and decrypted end-to-end for shipping using AES256-4096 / RSA /
                                    PGP.

                                    <a href="https://www.lace.io/bugbountyprogram" target="_blank"
                                        rel="noopener noreferrer">
                                        Read more about 1M USD Lace wallet challenge with PGP encryptation.
                                    </a>
                                </Message>
                            </div>
                        </div>

                        <Divider />

                        <div class="dialog-row">
                            <div class="dialog-title flex">
                                Payment method
                            </div>

                            <div class="payments">
                                <div class="payment-item selected">
                                    <span>ADA</span>
                                </div>
                                <div class="payment-item disabled">
                                    <span>IUSD</span>
                                </div>
                                <div class="payment-item disabled">

                                    <span>USDM</span>
                                </div>
                                <div class="payment-item disabled">
                                    <span>USDA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid-item right">
                        <div class="dialog-title flex">
                            Total
                        </div>

                        <div class="dialog-values flex">
                            <span>Protected</span>

                            <span>Yes</span>
                        </div>

                        <div class="dialog-values flex">
                            <span>Shipping Cost</span>

                            <span>Free</span>
                        </div>

                        <div class="dialog-values flex">
                            <span>Total Fiat Price</span>

                            <span>{{ computedTotalFiat }} USD</span>
                        </div>

                        <div class="dialog-values flex">
                            <span>Exchange Rate</span>

                            <span>{{ getADAprice }} USD</span>
                        </div>

                        <div class="dialog-values flex">
                            <span>Quantity</span>

                            <span>{{ selectedQuantity }}</span>
                        </div>

                        <Divider />

                        <div class="dialog-values flex">
                            <span>Total Asset</span>
                            <span>{{ computedTotalPrice }} ADA</span>
                        </div>

                        <div class="dialog-control">
                            <Button label="Buy" @click="onBuyHandle" style="color: var(--text-w);" :loading="isLoading"
                                fluid />
                        </div>
                    </div>
                </div>

            </div>
        </Dialog>


        <div class="card-brand">
            <span>{{ getProductData.brand }}</span>
        </div>

        <div class="card-stock" :class="{ red: getProductData.available < 1 }">
            <span>{{ getStockLabel(getProductData.available) }}</span>
        </div>

        <div class="card-rating flex">
            <Rating v-model="productRating" :stars="5" readonly />
            <span>{{ getProductData.rating }}</span>
            <div class="reviews">{{ getProductData.reviews }} reviews</div>
        </div>

        <div class="card-full flex green">
            <span>free shipping</span>
        </div>

        <div class="card-within">
            <span> Arrives on {{ arrivalDate }} buying within the next</span>

            <span>{{ withinRange }}</span>
        </div>

        <div class="card-available">
            <span>Available ({{ getProductData.available }})</span>
        </div>

        <div class="card-control">
            <InputNumber v-model="selectedQuantity" inputId="horizontal-buttons" showButtons buttonLayout="horizontal"
                :step="1" fluid :format="false" :min="1" :max="10">
                <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                </template>
                <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                </template>
            </InputNumber>

            <Button label="Buy Now" fluid @click="onBuyProduct()" style="color: var(--text-w);"
                :disabled="getProductData.available < 1" />
            <Button label="Add To Cart" fluid variant="outlined" severity="secondary" />
        </div>

        <div class="card-terms flex">
            <div class="card-terms-icon">
                <span>✓</span>
                <i class="pi pi-shield" />
            </div>
            <div class="card-terms-box">
                <span class="term-title">Purchase Protection.</span> Receive the product you expected or get your money
                back.
            </div>
        </div>
    </div>
</template>

<script setup>
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import productAPI from '@/views/product/api/index';
import headerAPI from "@/components/header/api/index";
import { ref, computed, inject } from "vue";
import { useMutation } from '@vue/apollo-composable';
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";
import { useRouter } from 'vue-router';
import { Buffer } from 'buffer'

const { applyDiscount, convertUSDToADA } = inject('utils');

const router = useRouter();

const toast = useToast();

const { togglePanel, getADAprice, getCurrentUser, getLocationData } = headerAPI();

const { getProductData, getArrivalDate, getArrivalData } = productAPI();

getArrivalDate({
    "origin": "Bogotá, Cundinamarca, CO"
})

const orderForm = ref({
    city: getLocationData.value?.city || null,
    address: null,
    receiver: null,
    postal: getLocationData.value?.postal || null,
    other: null
});


const orderFormErrors = ref({
    city: false,
    address: false,
    receiver: false,
    postal: false,
    other: false
});

const validateForm = () => {
    orderFormErrors.value.city = [orderForm.value.city === null, orderForm.value.city?.length < 1].includes(true);
    orderFormErrors.value.address = [orderForm.value.address === null, orderForm.value.address?.length < 1].includes(true);
    orderFormErrors.value.receiver = [orderForm.value.receiver === null, orderForm.value.receiver?.length < 1].includes(true);
    orderFormErrors.value.postal = [orderForm.value.postal === null, orderForm.value.postal?.length < 1].includes(true);

    return !Object.values(orderFormErrors.value).includes(true);
}

const isLoading = ref(false)

const onBuyHandle = () => {
    isLoading.value = true;

    if (!validateForm()) {
        isLoading.value = false;

        return showError('Mandatory Fields')
    }

    console.log(orderForm.value);

    const orderData = JSON.stringify(orderForm.value);

    const data = Buffer.from(orderData).toString('base64');

    onConfirmedBuy(data);
}

const selectedQuantity = ref(1);

const computedTotalPrice = computed(() => {
    let product = getProductData.value;

    if (product) {
        let discounted = applyDiscount(product.discount,
            product.price,
            product.discount_value
        );

        let price = convertUSDToADA(discounted, getADAprice.value);

        return Math.round(price * selectedQuantity.value)
    }

    return 0;
})

const computedTotalFiat = computed(() => {
    let product = getProductData.value;

    if (product) {
        let discounted = applyDiscount(product.discount,
            product.price,
            product.discount_value
        );


        return Math.round(discounted * selectedQuantity.value)
    }

    return 0;
})

const productRating = ref(getProductData.value?.rating);

const getStockLabel = (readyStock) => {
    return readyStock > 0 ? "In Stock" : "Out Stock";
}

const toggleDialog = ref(false);

const onBuyProduct = () => {
    if (!getCurrentUser.value) {
        return togglePanel(true)
    }

    toggleDialog.value = true;
}

const { mutate: pendingEndpoint, onError: onErrorPendingEndpoint, onDone: onDonePendingEndpoint } = useMutation(gql`
mutation($pendingEndpointVariable: PendingEndpointInput!){
    pendingEndpoint(pendingEndpointInput: $pendingEndpointVariable){
        success
        payload {
            cbor
            order
        }
    }
}
`,
    {
        clientId: 'gateway'
    })

onErrorPendingEndpoint(error => {
    showError(error);
})


onDonePendingEndpoint(async result => {
    const response = result.data;

    if (response.pendingEndpoint.success === true) {
        try {
            const { cbor, order } = response.pendingEndpoint.payload;

            const txHash = await balanceTx(cbor);

            showSuccess("Submitted", `Transaction Hash: ${txHash}`);

            console.log(`Transaction Hash: ${txHash}`);

            router.push({
                name: 'order',
                params: {
                    id: order
                },
                query: {
                    tx: txHash
                }
            })
            isLoading.value = false
        } catch (err) {
            console.error(err);

            showError(err);
            isLoading.value = false
        }
    }


})


const onConfirmedBuy = (data) => {
    pendingEndpoint({
        "pendingEndpointVariable": {
            "product_id": getProductData.value.id,
            "product_units": selectedQuantity.value,
            "data": data
        }
    })
}

const arrivalDate = computed(() => calculateArrivalDay(getArrivalData.value?.duration));

const withinRange = computed(() => calculateRemainingTimeOfDay());

const calculateRemainingTimeOfDay = () => {

    const now = dayjs();

    const midnight = dayjs().endOf('day');

    const duration = midnight.diff(now);

    const hours = Math.floor(duration / (1000 * 60 * 60));

    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));


    return `${hours} h ${minutes} min`;
};


function calculateArrivalDay(durationInSeconds) {

    const arrivalDate = dayjs().add(durationInSeconds, 'second');

    const arrivalDay = arrivalDate.format('dddd DD');

    return arrivalDay;
};

const showSuccess = (title, content) => {
    toast.add({ severity: 'success', summary: title, detail: content, life: 5000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

</script>

<style lang="css" scoped>
a {
    font-weight: 600;
}

.card {
    border: 1px solid var(--border-a);
    min-height: 100px;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 275px;
    margin-left: auto;
    border-radius: 6px;
    max-height: 600px;
}

.card-control {
    display: grid;
    gap: 1rem;
}

.card-brand {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
    text-transform: capitalize;
    font-weight: 700;
}

.card-stock {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
    text-transform: capitalize;
    font-weight: 700;
}

.card-rating {
    margin-bottom: 1rem;
}

.card-rating span {
    margin-left: 0.5rem;
    font-size: var(--text-size-2);
    font-weight: 600;
}

.card-stock {
    font-size: var(--text-size-2);
    margin-bottom: 1rem;
    text-transform: capitalize;
    font-weight: 500;
}

.card-within {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
}

.card-within span:nth-child(2) {
    margin-left: 0.25rem;
    color: var(--text-a);
    font-weight: 600;
}

.card-available {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
    text-transform: capitalize;
    font-weight: 400;
}

.card-full {
    font-weight: 500;
    text-transform: capitalize;
    margin-bottom: 1rem;
    font-size: var(--text-size-1);
}

.card-full i {
    margin: 0 0.25rem;
}

.reviews {
    font-size: var(--text-size-0);
    margin-left: 0.5rem;
    text-decoration: underline;
}

.dialog-values {
    justify-content: space-between;
    font-weight: 500;
    font-size: var(--text-size-1);
    margin-top: 1rem;
}


.grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 2rem;
    width: 100%;
    color: var(--text-a);
}

.grid-item {
    text-align: center;
}

.grid-item.right {
    padding-left: 1rem;
    border-left: 1px dashed var(--border-a);
}

.dialog {
    padding: 0.5rem;
}

.dialog-title {
    font-weight: 600;
    line-height: 2rem;
    font-size: var(--text-size-3);
}

.dialog-control {
    margin-top: 1rem;
}

.dialog-input {
    margin-top: 1rem;
}

.dialog-row {
    margin-bottom: 1rem;
}

.payments {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, 120px);
    margin-top: 1rem;
    width: 100%;
}

.payment-item {
    width: 120px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--border-a);
    font-weight: 500;
}

.payment-item span {
    font-size: var(--text-size-1);
}

.payment-item.selected {
    border: 1px solid var(--primary-a);
}

.payment-item.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.dialog-message {
    margin-top: 1rem;
}

.dialog-country {
    margin-top: 1rem;
}

.dialog-country span {
    font-size: var(--text-size-2);
    color: var(--text-a);
    font-weight: 500;
    margin-left: 1rem;
}

.card-terms {
    margin-top: 1rem;
    height: 80px;
    box-sizing: border-box;
}

.card-terms-icon {
    width: 50px;
    display: flex;
    align-items: flex-start;
    color: var(--text-b);
    height: inherit;
    position: relative;
    padding-top: 4px;
}

.card-terms-icon span {
    position: absolute;
    right: 11px;
    top: 3px;
    font-size: 10px;
}

.card-terms-box {
    font-size: var(--text-size-0);
    color: var(--text-b);
    height: inherit;
}

.term-title {
    font-weight: 600;
    color: var(--text-a);
}
</style>