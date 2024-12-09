<template>
    <Drawer v-model:visible="drawerVisibleTemp" header="Connect" position="right" :blockScroll="false"
        :showCloseIcon="true" :dismissable="true" @hide="drawerVisibleTemp = false" style="width: 22rem">
        <section v-if="!getCurrentUser">
            <Message severity="warn" icon="pi pi-info-circle">
                Select the wallet to make payments and log in as a user.
            </Message>

            <div class="block">
                <div class="block-item" @click="selectWallet('nami')" :class="{ active: enabledWallet === 'nami' }">
                    <img src="@/assets/nami.svg" alt="nami" />
                    <span>Nami</span>
                </div>
                <div class="block-item" @click="selectWallet('eternl')" :class="{ active: enabledWallet === 'eternl' }">
                    <img src="@/assets/eternl.png" alt="eternl" />
                    <span>Eternl</span>
                </div>
                <div class="block-item" @click="selectWallet('lace')" :class="{ active: enabledWallet === 'lace' }">
                    <img src="@/assets/lace.svg" alt="lace" />
                    <span>Lace</span>
                </div>
            </div>

            <Button label="Sign In" fluid @click="signIn" style="margin-top: 1rem;" :disabled="!enabledWallet" />
        </section>
        <section v-if="getCurrentUser">
            <Message severity="success" icon="pi pi-info-circle">
                Make sure you trade with the correct wallet account.
            </Message>

            <div class="user">
                <div class="user-info">
                    <img src="@/assets/user.png" alt="">
                    <span>{{ getCurrentUser.username }}</span>
                </div>


                <div class="user-row address">
                    <Message severity="info">
                        {{ formatWithDots(getCurrentUser.address, 80) }}
                    </Message>
                </div>


                <div class="user-row pkh">
                    <Message severity="info">
                        {{ getCurrentUser.pubkeyhash }}
                    </Message>
                </div>
            </div>

            <Button label="Sign Out" fluid @click="logoutUser" style="margin-top: 1rem;" :disabled="!enabledWallet"
                variant="outlined" />

            <div @click="createTransaction">TXXX</div>
        </section>

    </Drawer>
</template>

<script setup>
import headerAPI from "@/components/header/api/index";
import { signMessage, balanceTx, walletClient, getBalance } from "@/api/wallet";
import { ref, watch, onBeforeUnmount, inject } from 'vue';
import { useToast } from "primevue/usetoast";

const { formatWithDots } = inject('utils');

const toast = useToast();

const { drawerVisible, showPanel, loginUser, getCurrentUser, logoutUser } = headerAPI();

const drawerVisibleTemp = ref(false);

const watchDrawerA = watch(drawerVisible, (e) => drawerVisibleTemp.value = e);

const watchDrawerB = watch(drawerVisibleTemp, (e) => showPanel(e));

//////////////////////////////////////////////

const enabledWallet = ref(null);

const updateEnabledWallet = () =>
    enabledWallet.value = localStorage.getItem("enabled-wallet");

updateEnabledWallet();

window.addEventListener("walletEnabledEvent", () => updateEnabledWallet());

window.addEventListener('storage', (event) => updateEnabledWallet());

const watchEnabledWallet = setInterval(() => updateEnabledWallet(), 1000);

//////////////////////////////////////////////

const walletBalance = ref(0);

const watchBalance = setInterval(async () => walletBalance.value = await getBalance(), 1000);

const selectWallet = async (e) => {
    await walletClient().connect(e);
};

const signIn = async () => {
    await signMessage().then(([signature, address]) =>
        loginUser({
            signature,
            address,
            terms_accepted: true,
        })
    ).catch((err) => console.error(err));
};


const createTransaction = async (cbor) => {
    try {
        const txHash = await balanceTx(cbor);

        console.log(`Transaction submitted with hash: ${txHash}`);
    } catch (err) {
        console.error(err);
        JSON.stringify(err);
    }
};

onBeforeUnmount(() => {
    watchDrawerA()
    watchDrawerB()
    clearInterval(watchEnabledWallet)
    clearInterval(watchBalance)
});

</script>

<style lang="css" scoped>
.block {
    display: flex;
    flex-direction: column;
}

.block-item {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-a);
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
}

.block-item.active {
    border: 1px solid var(--primary-c);
}

.block-item img {
    width: 35px;
    height: 35px;
    border-radius: 8px;
}

.block-item span {
    margin-left: 1rem;
    font-size: var(--text-size-a);
    font-weight: 500;
}

.user {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-a);
    margin-top: 1rem;
    border-radius: 8px;
    padding: 1rem;
}

.user-row {
    font-size: var(--text-size-a);
    font-weight: 600;
    word-break: break-all;
    margin: 1.5rem 0;
    position: relative;
}

.user-row::before {
    content: '';
    font-weight: 500;
    color: var(--primary-c);
    position: absolute;
    top: -20px;
    left: 0;
    padding-left: 0.5rem;
    background-color: var(--p-message-info-background);
    width: 120px;
    height: 30px;
    clip-path: polygon(0 0, 80% 0, 100% 100%, 0% 100%);
    border-top-left-radius: 5px;
    z-index: 1;
}

.address::before {
    content: 'Address';
}

.pkh::before {
    content: 'PubKeyHash';
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
}

.user-info img {
    border-radius: 50%;
    width: 2rem;
}

.user-info span {
    margin-left: 1rem;
    font-weight: 500;
    font-size: var(--text-size-a);
}
</style>