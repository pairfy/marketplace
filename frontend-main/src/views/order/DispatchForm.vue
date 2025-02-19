<template>
    <Dialog v-model:visible="dispatchDialog" modal header="Shipping Data" :style="{ width: '20vw' }" :draggable="false"
        :blockScroll="true" :dismissableMask="false" :closable="true">
        <template #header>
        </template>
        <div class="card">
            <div class="form">
                <div class="title">
                    <span>Fill out the form.</span>
                </div>

                <div class="row">
                    <IftaLabel>
                        <InputText id="guide" v-model="dispatchForm.guide" type="text" autofocus fluid
                            :invalid="dispatchFormErrors.guide" variant="filled" />
                        <label for="guide">Tracking Number or ID</label>
                    </IftaLabel>
                </div>

                <div class="row">
                    <IftaLabel>
                        <DatePicker v-model="dispatchForm.date" inputId="date" showIcon iconDisplay="input"
                            variant="filled" fluid :minDate="tomorrow" />
                        <label for="date">Delivery Date</label>
                    </IftaLabel>
                </div>

                <div class="row">
                    <IftaLabel>
                        <InputText id="website" v-model="dispatchForm.website" type="text" autofocus fluid
                            :invalid="dispatchFormErrors.website" variant="filled" />
                        <label for="website">Tracking Website</label>
                    </IftaLabel>
                </div>
                <div class="row">
                    <IftaLabel>
                        <Textarea id="notes" v-model="dispatchForm.notes" rows="5" cols="30" style="resize: none"
                            fluid />
                        <label for="notes">Notes</label>
                    </IftaLabel>
                </div>

                <div class="message">
                    <Message size="small" severity="secondary">
                        This information is immutable please check before sending.
                        Please write future changes in the chat.
                    </Message>
                </div>

                <div class="control">
                    <Button label="Submit" fluid @click="onShippingEndpoint" :loading="isLoading"
                        style="color: var(--text-w);" />
                </div>
            </div>
        </div>
    </Dialog>

    <Button v-if="currentState === 1" type="button" label="Dispatched" :disabled="disableDispatched"
        @click="dispatchDialog = true" :loading="isLoading" style="color: var(--text-w);" />
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from "@/views/order/api/index";
import { computed, ref } from "vue";
import { useMutation } from '@vue/apollo-composable'
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";
import { reactive } from "vue";

const toast = useToast();

const { getOrderData } = orderAPI();

const currentState = computed(() => getOrderData.value?.order?.contract_state);

const dispatchForm = reactive({
    guide: null,
    date: null,
    website: null,
    notes: null,
});

const dispatchFormErrors = reactive({
    guide: false,
    date: false,
    website: false,
    notes: false,
});

const tomorrow = computed(() => {

    const today = new Date();
    const tomo = new Date(today);
    tomo.setDate(today.getDate() + 1);

    return tomo
})

const dispatchDialog = ref(false);

const disableDispatched = computed(() => getOrderData.value?.order?.contract_state !== 1);

const { mutate: shippingEndpoint, onDone: onDoneShippingEndpoint, onError: onErrorShippingEndpoint } = useMutation(gql`
      mutation($shippingEndpointVariable: ShippingEndpointInput!) {
        shippingEndpoint(shippingEndpointInput: $shippingEndpointVariable) {
          success
          payload {
            cbor
          }
        }
      }
`, {
    clientId: 'gateway'
})

const isLoading = ref(false);

onDoneShippingEndpoint(async result => {
    console.log(result.data);

    const response = result.data;

    if (response.shippingEndpoint.success === true) {
        try {

            const { cbor } = response.shippingEndpoint.payload;

            showSuccess("Transaction", `Please don't close the tab. The process takes a few minutes depending on the blockchain network.`, 100000);

            const txHash = await balanceTx(cbor);

            showSuccess("Submitted", `Transaction Hash: (${txHash}). It takes approximately 5 minutes to appear on the blockchain.`, 200000);

            console.log(`Transaction submitted with hash: ${txHash}`);

            isLoading.value = false;

            dispatchDialog.value = false;

        } catch (err) {
            console.error(err);

            showError(err);

            isLoading.value = false;
        }
    }

})

onErrorShippingEndpoint(error => {
    showError(error)

    isLoading.value = false;
})

const onShippingEndpoint = () => {
    console.log(dispatchForm)

    isLoading.value = true;

    const deliveryDate = new Date(dispatchForm.date).getTime().toString();

    const scheme = {
        order_id: getOrderData.value.order.id,
        guide: dispatchForm.guide,
        date: deliveryDate,
        website: dispatchForm.website,
        notes: dispatchForm.notes,
    }

    shippingEndpoint({
        "shippingEndpointVariable": scheme
    })
}

const showSuccess = (title, content, time) => {
    toast.add({ severity: 'success', summary: title, detail: content, life: time });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

</script>

<style lang="css" scoped>
button {
    margin-right: 1rem;
    font-weight: 600;
}

.card {
    display: flex;
    justify-content: center;
    align-items: center;
}


.title {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.title span:nth-child(1) {
    font-size: var(--text-size-3);
    font-weight: 500;
}

.title span:nth-child(2) {
    color: var(--text-b);
    line-height: 2rem;
    font-size: var(--text-size-2);
    margin-top: 0.5rem;
}

.row {
    margin-bottom: 1rem;
}

.legend {
    display: flex;
    justify-content: flex-end;
    color: var(--primary-c);
    font-size: var(--text-size-a);
    line-height: 3rem;
}

.legend span {
    font-weight: 600;
    cursor: pointer;
}

.control {
    margin-top: 1rem;
}

.message {
    margin-top: 1rem;
    word-break: break-word;
    text-align: left;
}
</style>