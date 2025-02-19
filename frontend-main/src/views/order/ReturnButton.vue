<template>
    <Button v-if="!currentState || currentState === 0" type="button" :disabled="disableButton" @click="onReturnEndpoint"
        variant="text">

        <div class="flex">
            <ProgressSpinner v-if="loading" style="width: 1rem; margin-right: 0.5rem; height: 1rem" strokeWidth="5" fill="transparent"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />


            <span>Return Funds</span>

            <span v-if="pendingCountdown !== '00:00'" style="margin-left: 0.5rem" >
                {{ pendingCountdown }}
            </span>
        </div>
    </Button>
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from "@/views/order/api/index";
import { useMutation } from '@vue/apollo-composable';
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";
import { computed, ref, onMounted, onUnmounted } from "vue";

const toast = useToast();

const { getOrderData } = orderAPI();

const { mutate: returnEndpoint, onDone, onError } = useMutation(gql`
      mutation($returnEndpointVariable: ReturnEndpointInput!) {
        returnEndpoint(returnEndpointInput: $returnEndpointVariable) {
          success
          payload {
            cbor
          }
        }
      }
`, {
    clientId: 'gateway'
})

const loading = ref(false);

const onReturnEndpoint = () => {
    loading.value = true;

    returnEndpoint({
        "returnEndpointVariable": {
            order_id: getOrderData.value.order.id
        }
    })
}

onDone(async result => {
    console.log(result.data);

    const response = result.data;

    if (response.returnEndpoint.success === true) {
        try {
            const { cbor } = response.returnEndpoint.payload;

            showSuccess("Transaction", "Please don't close the tab. The process takes a few minutes depending on the blockchain network.", 120000);

            const txHash = await balanceTx(cbor);

            showSuccess("Submitted", `Transaction submitted with hash: ${txHash}`, 120000);

            console.log(`Transaction submitted with hash: ${txHash}`);

            loading.value = false;
        } catch (err) {
            console.error(err);

            showError(err);

            loading.value = false;
        }
    }

})

onError(error => {
    showError(error)
    loading.value = false;
})

const currentState = computed(() => getOrderData.value.order.contract_state)

const disableButton = computed(() => pendingCountdown.value !== "00:00" || getOrderData.value.order.finished);

const pendingTimeLeft = ref(Date.now());

const pendingCountdown = computed(() => {
    if (pendingTimeLeft.value <= 0) return "00:00";

    const totalSeconds = Math.floor(pendingTimeLeft.value / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
});

let pendingInterval;

const updatePendingCountdown = () => {
    pendingTimeLeft.value = getOrderData.value.order.pending_until - Date.now();
};

const showSuccess = (title, content, time) => {
    toast.add({ severity: 'success', summary: title, detail: content, life: time });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 5000 });
};

onMounted(() => {
    updatePendingCountdown();
    pendingInterval = setInterval(updatePendingCountdown, 1000);
});

onUnmounted(() => {
    clearInterval(pendingInterval);
});
</script>

<style lang="css" scoped>
::v-deep(.p-progressspinner-circle) {
    stroke: var(--primary-a) !important;
}

.button {
    display: flex;
    align-items: center;
}
</style>