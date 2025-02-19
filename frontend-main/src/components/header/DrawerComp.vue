<template>
    <Drawer v-model:visible="drawerVisibleTemp" header="Connect" position="right" :blockScroll="false"
        :showCloseIcon="true" :dismissable="true" @hide="drawerVisibleTemp = false" style="width: 22rem">

        <section v-if="!getCurrentUser">
            <Message severity="secondary" icon="pi pi-info-circle">
                Select the Cardano wallet to make payments and login as a user.
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

            <Button label="Sign In" fluid @click="onLogin" style="margin-top: 1rem; color: var(--text-w);"
                :disabled="!enabledWallet" />
        </section>
        <section v-if="getCurrentUser">
            <Message severity="secondary" icon="pi pi-info-circle">
                Make sure you trade with the correct wallet account.
            </Message>

            <div class="user">
                <div class="user-header">
                    <img src="@/assets/user.png" alt="">
                    <span>{{ getCurrentUser.username }}</span>
                </div>


                <div class="user-item">
                    <span class="title">address</span>
                    <span> {{ formatWithDots(getCurrentUser.address, 80) }}</span>
                </div>


                <div class="user-item">
                    <span class="title">PubKeyHash</span>
                    <span>{{ getCurrentUser.pubkeyhash }}</span>
                </div>
            </div>



            <Button label="Sign Out" fluid @click="logoutUser" style="margin-top: 1rem;" :disabled="!enabledWallet"
                variant="outlined" />

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

const { panelVisible, togglePanel, loginUser, getCurrentUser, logoutUser } = headerAPI();

const drawerVisibleTemp = ref(false);

const watchDrawerA = watch(panelVisible, (e) => drawerVisibleTemp.value = e);

const watchDrawerB = watch(drawerVisibleTemp, (e) => togglePanel(e));

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

const onLogin = async () => {
    await signMessage().then(([signature, address]) =>
        loginUser({
            signature,
            address,
            terms_accepted: true,
        })
    )
        .then(() => {
            togglePanel(false);
            location.reload();
        })
        .catch((err) => console.error(err));
};


const createTransaction = async () => {
    try {
        const cbor = "84aa00d901028282582050246e04b4c361d2e4ca10b51170637422a73a942c8463c184be61cc6b83857b01825820a286fdfde875c30b10946c19754a44f597f37f0e22de883581272298c6a5004d000182a300581d70a28a9ea9a82e68a1a992efc75a6bbda32c6f6a513588ad0c66fef12101821a02625a00a1581c0a09d13dacc36caa75855765930e3f93f840f7e07ea72b05fe31ece2a14b746872656164746f6b656e01028201d81845d8799f01ff82583900a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc1415502e5c34c37200c2ae9757cf8d9ee36370f7b778ad835377a0c47a51a00c19372021a0003cef2031a04b38ddc081a04b38cb20b58206577cbc9d502999e6da050f5138eeaba75fe83c4af249f658071750e6636da9f0dd9010281825820f996ffce186e99cefaa3268be2848da9e9fe6a2a5012424c7e472a6c76363c47010ed9010281581ca239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc1411082583900a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc1415502e5c34c37200c2ae9757cf8d9ee36370f7b778ad835377a0c47a51b000000023e11cb61111a004c4b40a20581840001d87a80821a0001e6081a028a66e307d9010281590529590526010100333333323232323232322322322322322322322533300e32323232325332330143001301537540042646644646464a66603460060022a66603a60386ea80240085854ccc068c01c00454ccc074c070dd50048010b0b180d1baa008153330183001301937540042646464646464646464646464a666048601a604a6ea8c0a4c0a80304c8c8c8c94ccc0a0c044c0a4dd5000899192999815180998159baa0011323232533302d0091533302d0081533302d0071533302d002100114a029405280a503375e66e952004330304c105d8799f20ff004bd70180798171baa0023300a30103756601e605a6ea80040a4c0bcc0b0dd50008b198051bac300c302b3754032466ebcc01cc0b0dd5000980398161baa300e302c3754004605a60546ea800458cc020dd6180218149baa01723375e600a60546ea800404ccc014dd6180318141baa016020325333026301330273754002266e20068dd6981598141baa00114a06004604e6ea8c008c09cdd5180198139baa015300d375a6052604c6ea8c0a40304c8c8c8c94ccc0a0c044c0a4dd5000899192999815180998159baa001132323232533302e00a1533302e0091533302e0081533302e0031533302e002100114a029405280a5014a066ebccdd2a400866062980105d8799f01ff004bd70180818179baa0033370e64a66605a6034605c6ea8004520001375a6064605e6ea8004c94ccc0b4c068c0b8dd50008a60103d87a8000132330010013756606660606ea8008894ccc0c8004530103d87a800013233322253330333372291100003153330333371e9101000031301533037375000497ae014c0103d87a8000133006006001375c60620026eb4c0c8004c0d8008c0d0004c8cc004004dd5980898179baa00322533303100114c103d87a800013233322253330323372291100003153330323371e9101000031301433036374c00497ae014c0103d87a8000133006006001375c60600026eacc0c4004c0d4008c0cc004cdc00120111980518081bab300f302d3754002052605e60586ea800458cc028dd6180618159baa01923375e600e60586ea8004c01cc0b0dd5180718161baa002302d302a37540022c660106eb0c010c0a4dd500b919baf3005302a37540020266600a6eb0c018c0a0dd500b011192999813180998139baa0011337106eb4c0acc0a0dd500080d0a503002302737546004604e6ea8c00cc09cdd500a98069bad30293026375460520184605200246050605260526052605260526052605200244646600200200644a66605000229404cc894ccc09ccdc78010028a51133004004001375c605400260560024604c604e604e604e604e604e604e604e604e00244646600200200644a66604c002298103d87a8000133225333025300500213007330290024bd70099802002000981400098148009ba5480008c08cc090c0900048c088c08c0048c008004c004004894ccc07800452f5c026603e6038604000266004004604200266038603a60346ea8008cc07001d2f5c02c6e1d2000301a001301a301b001301637540046e1d200216301730180033016002301500230150013010375400229309b2b1bad001375a0026eb4004dd70009bae001375c002ae6955ceaab9e5573eae815d0aba24c011e581c0a09d13dacc36caa75855765930e3f93f840f7e07ea72b05fe31ece2004c011e581ca239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141004c011e581c746bff9fb367bf3bb1b25fe24a272bb288d62a2cad1aad2e37a8173f004c01051a01c9c380004c01051a00989680004c01091b00000193dbcc06ef0001f5f6"

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
    border: 1px solid var(--border-b);
}

.block-item img {
    width: 35px;
    height: 35px;
    border-radius: 8px;
}

.block-item span {
    margin-left: 1rem;
    font-size: var(--text-size-1);
    font-weight: 500;
}

.user {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border-radius: 12px;
    border: 1px solid var(--border-a);
}

.user-item {
    font-size: var(--text-size-1);

    word-break: break-all;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-top: 1px solid var(--border-a);
}

.user-item .title {
    color: var(--text-a);
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.user-header {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.user-header img {
    border-radius: 50%;
    width: 2.5rem;
}

.user-header span {
    margin-left: 1rem;
    font-weight: 500;
    font-size: var(--text-size-1);
}
</style>