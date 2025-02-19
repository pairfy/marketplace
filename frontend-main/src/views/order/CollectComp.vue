<template>
    <Button v-if="isEnabled" type="button" label="Collect Funds" @click="onCollect"
    :loading="loading" :disabled="isDisabled" style="color: var(--text-w);" />
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from "@/views/order/api/index";
import { computed, ref } from "vue";
import { useMutation } from '@vue/apollo-composable'
import { useToast } from "primevue/usetoast";
import { balanceTx } from "@/api/wallet";
import { Buffer } from 'buffer';

const toast = useToast();

const { getOrderData } = orderAPI();

const shippingData = computed(() => {
    const raw = getOrderData.value?.shipping;

    if (raw) {
        const parsed = JSON.parse(Buffer.from(raw, 'base64').toString("utf-8"))

        return parsed;
    }

    return null
});

const currentState = computed(() => getOrderData.value?.order?.contract_state);

const isDisabled = computed(() => {
    if (currentState.value === 3) {
        return false
    }

    let now = Date.now();

    let appealExpired = BigInt(now) > BigInt(shippingData.value?.appeal_until)

    if (currentState.value === 2 && appealExpired) {
        return false
    }

    return true
});

const isEnabled = computed(() => {
    if (currentState.value === 2) {
        return true
    }

    if (currentState.value === 3) {
        return true
    }

    if (currentState.value === 4) {
        return true
    }

    return false
})



const { mutate: collectEndpoint, onDone, onError } = useMutation(gql`
      mutation($collectEndpointVariable: CollectEndpointInput!) {
        collectEndpoint(collectEndpointInput: $collectEndpointVariable) {
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

onDone(async result => {
    console.log(result.data);

    const response = result.data;

    if (response.collectEndpoint.success === true) {
        try {

            const { cbor } = response.collectEndpoint.payload;

            showSuccess("Transaction", `Please don't close the tab. The process takes a few minutes depending on the blockchain network.`, 100000);

            const txHash = await balanceTx(cbor);

            showSuccess("Submitted", `Transaction Hash: (${txHash}). It takes approximately 5 minutes to appear on the blockchain.`, 200000);

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

const onCollect = () => {

    loading.value = true;

    collectEndpoint({
        "collectEndpointVariable": {
            order_id: getOrderData.value.order.id,
        }
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
</style>