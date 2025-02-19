<template>
    <Button v-if="currentState === 2 && shippingData" type="button" :disabled="disableButton" @click="onAppealEndpoint" variant="text">

        <div class="flex">
            <ProgressSpinner v-if="loading" style="width: 1rem; height: 1rem;  margin-right: 0.5rem; " strokeWidth="5"
                fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />

            <span>Appeal</span>

            <span v-if="deliveryCountdown !== '00:00'" style="margin-left: 0.5rem">
                {{ deliveryCountdown }}
            </span>
        </div>
    </Button>
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from "@/views/order/api/index";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useMutation } from '@vue/apollo-composable';
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";
import { Buffer } from 'buffer';

const toast = useToast();

const { getOrderData } = orderAPI();

const { mutate: appealEndpoint, onDone, onError } = useMutation(gql`
      mutation($appealEndpointVariable: AppealEndpointInput!) {
        appealEndpoint(appealEndpointInput: $appealEndpointVariable) {
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

const onAppealEndpoint = () => {
    loading.value = true;

    appealEndpoint({
        "appealEndpointVariable": {
            order_id: getOrderData.value.order.id
        }
    })
}

onDone(async result => {
    console.log(result.data);

    const response = result.data;

    if (response.appealEndpoint.success === true) {
        try {
            const { cbor } = response.appealEndpoint.payload;

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

const shippingData = computed(() => {
    const raw = getOrderData.value.shipping;

    if (raw) {
        const parsed = JSON.parse(Buffer.from(raw, 'base64').toString("utf-8"))
        return parsed;
    }

    return null
})

const currentState = computed(() => getOrderData.value.order.contract_state)

const disableButton = computed(() => {
    if (getOrderData.value.order.finished) {
        return true
    }

    if (deliveryCountdown.value !== "00:00") {
        return true
    }


    if(Date.now() > Number(shippingData.value?.appeal_until)){
        return true
    }


    return false
});

const deliveryTimeLeft = ref(Date.now());

const deliveryCountdown = computed(() => {
    if (deliveryTimeLeft.value <= 0) return "00:00";

    const totalSeconds = Math.floor(deliveryTimeLeft.value / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
});

let deliveryInterval;

const updateDeliveryCountdown = () => {
    deliveryTimeLeft.value = Number(shippingData.value?.date) - Date.now();
};

onMounted(() => {
    updateDeliveryCountdown();
    deliveryInterval = setInterval(updateDeliveryCountdown, 1000);
});

onUnmounted(() => {
    clearInterval(deliveryInterval);
});

const showSuccess = (title, content, time) => {
    toast.add({ severity: 'success', summary: title, detail: content, life: time });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 5000 });
};

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