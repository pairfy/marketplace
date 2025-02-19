<template>
    <Button :disabled="disableReceived" label="Package Received" style="color: var(--text-w)" :loading="isLoading" @click="onReceivedPackage"/>
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from "@/views/order/api/index";
import { computed, ref } from "vue";
import { balanceTx } from "@/api/wallet";
import { useMutation } from '@vue/apollo-composable';
import { useToast } from "primevue/usetoast";

const toast = useToast();

const { getOrderData } = orderAPI();

const disableReceived = computed(() => {
    let order = getOrderData.value?.order

    if (order) {
        if (order.finished) {
            return true
        }

        if (order.contract_state !== 2) {
            return true
        }
    }

    return false
});

const isLoading = ref(false);

const { mutate: receivedEndpoint, onDone, onError } = useMutation(gql`
      mutation($receivedEndpointVariable: ReceivedEndpointInput!) {
        receivedEndpoint(receivedEndpointInput: $receivedEndpointVariable) {
          success
          payload {
            cbor
          }
        }
      }
`, {
    clientId: 'gateway'
})

const onReceivedPackage = () => {
    isLoading.value = true;

    receivedEndpoint({
        "receivedEndpointVariable": {
            order_id: getOrderData.value.order.id
        }
    })
}


onDone(async result => {
    console.log(result.data);

    const response = result.data;

    if (response.receivedEndpoint.success === true) {
        try {
            const { cbor } = response.receivedEndpoint.payload;

            showSuccess("Transaction", `Please don't close the tab. The process takes a few minutes depending on the blockchain network.`, 100000);

            const txHash = await balanceTx(cbor);

            showSuccess("Submitted", `Transaction Hash: (${txHash}). It takes approximately 5 minutes to appear on the blockchain.`, 200000);

            console.log(`Transaction submitted with hash: ${txHash}`);

            isLoading.value = false
        } catch (err) {
            console.error(err);

            showError(err);

            isLoading.value = false
        }
    }

})

onError(error => {
    showError(error)
    isLoading.value = false
})


const showSuccess = (title, content, time) => {
    toast.add({ severity: 'success', summary: title, detail: content, life: time });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

</script>

<style lang="scss" scoped></style>