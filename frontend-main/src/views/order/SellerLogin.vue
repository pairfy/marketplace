<template>
    <Dialog v-model:visible="loginDialog" modal header="Please Login" :style="{ width: '60vw', height: '90vh' }"
        :draggable="false">
        <template #header>

        </template>
        <div class="signin">

            <div class="form">
                <div class="title">
                    <span>Welcome</span>
                    <span>Start managing your orders</span>
                </div>

                <div class="email">
                    <IftaLabel>
                        <InputText id="email" v-model="loginForm.email" type="email" autofocus fluid
                            :invalid="loginFormErrors.email" variant="filled" />
                        <label for="email">Email</label>
                    </IftaLabel>
                </div>

                <div class="password">
                    <Fluid>
                        <IftaLabel>
                            <Password v-model="loginForm.password" inputId="password" toggleMask :feedback="false"
                                :inputStyle="{ fontSize: 'var(--text-size-a)' }" :invalid="loginFormErrors.password" />
                            <label for="password">Password</label>

                        </IftaLabel>
                    </Fluid>
                </div>


                <div class="legend">
                    <span @click="navigateTo('recovery')">Forgot password?</span>
                </div>

                <div class="wallets">
                    <div class="wallets-item" :class="{ selected: enabledWallet === 'lace' }"
                        @click="selectWallet('lace')">
                        <img src="@/assets/lace.svg" alt="">
                    </div>
                    <div class="wallets-item" :class="{ selected: enabledWallet === 'eternl' }"
                        @click="selectWallet('eternl')">
                        <img src="@/assets/eternl.png" alt="">
                    </div>
                    <div class="wallets-item" :class="{ selected: enabledWallet === 'nami' }"
                        @click="selectWallet('nami')">
                        <img src="@/assets/nami.svg" alt="">
                    </div>
                </div>

                <div class="message">
                    <Message size="small" severity="warn">
                        Please use the account corresponding to this address:

                        {{ sellerAddress }}
                    </Message>
                </div>

                <div class="control">
                    <Button label="Login" fluid @click="doLogin" style="color: var(--text-w)" />
                </div>
            </div>
        </div>
    </Dialog>

</template>

<script setup>
import headerAPI from '@/components/header/api';
import { useRoute } from 'vue-router';
import { watch, ref, onBeforeUnmount } from 'vue';
import { signMessage, walletClient } from "@/api/wallet";
import { useToast } from 'primevue';

const { getCurrentSeller, loginSeller } = headerAPI()

const route = useRoute();

const toast = useToast();

const loginForm = ref({
    email: null,
    password: null
});

const loginFormErrors = ref({
    email: false,
    password: false,
});

const sellerAddress = ref(null);

const loginDialog = ref(false);

const showloginDialog = (e) => {
    loginDialog.value = e;
}

const watchCurrentSeller = watch(() => getCurrentSeller, (data) => {
    if (data.value?.id) {
        showloginDialog(false)
    }
}, { immediate: true })


const watchCurrentRoute = watch(
    () => route,
    ({ params, query }) => {
        if (query.mode === 'seller') {
            if (!getCurrentSeller.value) {
                showloginDialog(true)
            }
        }

        if (query.address) {
            sellerAddress.value = query.address
        }
    },
    { immediate: true }
);

const selectWallet = async (e) => await walletClient().connect(e);

////////////////////////////////////////////////////////////////

const enabledWallet = ref(null);

const updateEnabledWallet = () =>
    enabledWallet.value = localStorage.getItem("enabled-wallet");

updateEnabledWallet();

window.addEventListener("walletEnabledEvent", () => updateEnabledWallet());

window.addEventListener('storage', () => updateEnabledWallet());

const watchEnabledWallet = setInterval(() => updateEnabledWallet(), 1000);

//////////////////////////////////////////////////////////////

const doLogin = async () => {
    if (!loginForm.value.email) {
        loginFormErrors.value.email = true
    }

    if (!loginForm.value.password) {
        loginFormErrors.value.password = true
    }

    if (Object.values(loginForm.value).includes(null)) {
        showError('Required Fields');
        return;
    }

    if (!enabledWallet.value) {
        showError('Select A Wallet');
        return;
    }

    await signMessage('seller').then(async ([signature, address]) =>
        loginSeller({
            signature,
            address,
            terms_accepted: true,
            ...loginForm.value
        })
    ).then((res) => {
        const { ok, response } = res;

        if (ok) {
            showloginDialog(false)
            showSuccess("Seller Logged")
            location.reload()
        } else {
            showError(response.errors.map(item => item.message))
        }
    }).catch((err) => showError(err));
};

const showSuccess = (content) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: content, life: 3000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

onBeforeUnmount(() => {
    watchCurrentSeller()
    watchCurrentRoute()
    clearInterval(watchEnabledWallet)
    window.removeEventListener("walletEnabledEvent", () => updateEnabledWallet());
    window.removeEventListener("storage", () => updateEnabledWallet());
});

</script>

<style lang="css" scoped>
.signin {
    display: flex;
    justify-content: center;
    align-items: center;
}

.form {
    min-width: 300px;
    max-width: 350px;
    min-height: 600px;
    padding: 1.5rem;
    border: 1px solid var(--border-a);
    border-radius: 20px;
    margin-top: 2rem;
}

.title {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
}

.title span:nth-child(1) {
    font-size: var(--text-size-d);
    font-weight: 600;
}

.title span:nth-child(2) {
    color: var(--text-b);
    line-height: 2rem;
    font-size: var(--text-size-b);
}

.password {
    margin-top: 2rem;
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

.wallets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    grid-auto-rows: 40px;
    gap: 0.5rem;
    margin-top: 1rem;
}

.wallets-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 1px solid var(--border-a);
    cursor: pointer;
    border-radius: 6px;
    transition: 0.2s;
}

.wallets-item img {
    height: 20px;
    width: 20px;
}

.wallets-item.selected {
    border: 1px solid var(--primary-a);
}

.control {
    margin-top: 1rem;
}

.bottom {
    font-size: var(--text-size-a);
    color: var(--text-b);
    font-weight: 600;
    text-align: center;
}

.bottom span {
    color: var(--primary-c);
    margin-left: 0.5rem;
    cursor: pointer;
}

.message {
    margin-top: 1rem;
    word-break: break-word;
    text-align: left;
}
</style>
