<template>
    <div class="pad flex">
        <Button v-if="currentState === 0" :disabled="disableAccept" @click="onLockingEndpoint"
            style="color: var(--text-w);" :loading="true">
            <ProgressSpinner v-if="isLoading" style="width: 1rem; height: 1rem" strokeWidth="5" fill="transparent"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />

            <span>Accept Order</span>
            <span v-if="pendingCountdown !== '00:00'">
                {{ pendingCountdown }}
            </span>
        </Button>



        <DispatchForm />

        <CollectComp />
    </div>
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from "@/views/order/api/index";
import DispatchForm from '@/views/order/DispatchForm.vue';
import CollectComp from '@/views/order/CollectComp.vue';
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useMutation } from '@vue/apollo-composable'
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";

const toast = useToast();

const { getOrderData } = orderAPI();

const { mutate: lockingEndpoint, onDone: onDoneLockingEndpoint, onError: onErrorLockingEndpoint } = useMutation(gql`
      mutation($lockingEndpointVariable: LockingEndpointInput!) {
        lockingEndpoint(lockingEndpointInput: $lockingEndpointVariable) {
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

onDoneLockingEndpoint(async result => {
    console.log(result.data);

    const response = result.data;

    if (response.lockingEndpoint.success === true) {
        try {
            const { cbor } = response.lockingEndpoint.payload;

            showSuccess("Transaction", `Please don't close the tab. The process takes a few minutes depending on the blockchain network.`, 100000);

            const txHash = await balanceTx(cbor);

            showSuccess("Submitted", `Transaction Hash: (${txHash}). It takes few minutes to appear on the blockchain.`, 200000);

            console.log(`Transaction submitted with hash: ${txHash}`);

            isLoading.value = false;


        } catch (err) {
            console.error(err);

            showError(err);

            isLoading.value = false;
        }
    }

})

onErrorLockingEndpoint(error => {
    showError(error)
    isLoading.value = false;
})

const onLockingEndpoint = () => {
    isLoading.value = true;


    lockingEndpoint({
        "lockingEndpointVariable": {
            order_id: getOrderData.value.order.id
        }
    })
}


///////////////////////////////////////////////////////////////////////////////////////////

const currentState = computed(() => getOrderData.value?.order?.contract_state);

const disableAccept = computed(() => {
    if (pendingCountdown.value === "00:00") {
        return true
    }


    if (getOrderData.value?.order?.contract_state !== 0) {
        return true
    }


    if (isLoading.value === true) {
        return true
    }

    return false
})
///////////////////////////////////////////////////////////////////

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
    pendingTimeLeft.value = getOrderData.value?.order?.pending_until - Date.now();
};

/////////////////////////////////////////////////


const showSuccess = (title, content, time) => {
    toast.add({ severity: 'success', summary: title, detail: content, life: time });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
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
.pad button {
    margin-right: 1rem;
    font-weight: 600;
    font-size: var(--text-size-1);
}

::v-deep(.p-progressspinner-circle) {
    stroke: #ffffff !important;
}
</style>