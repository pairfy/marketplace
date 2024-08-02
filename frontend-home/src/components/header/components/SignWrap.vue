<template>
  <Sidebar
    v-model:visible="displayPanel"
    header="Setup Wallet"
    position="right"
    blockScroll
    :dismissable="true"
  >
    <div class="steps">
      <div
        class="steps-item"
        v-for="(item, index) in stepsList"
        :key="item"
        :class="{ active: activeStep === index }"
        @click="handleStep(index)"
      >
        <i :class="item.icon" />
      </div>
    </div>

    <div class="tab-1" v-if="activeStep === 0">
      <p class="message">
        Select the Cardano wallet of your preference. Please note that each
        wallet can have one or more accounts. If you are going to make purchase
        operations you must use a single account throughout the entire process.
      </p>

      <div class="grid-container">
        <div
          @click="selectWallet('nami')"
          class="grid-item"
          :class="{ active: enabledWallet === 'nami' }"
        >
          <img src="@/assets/nami.svg" alt="nami" />
        </div>
        <div
          @click="selectWallet('eternl')"
          class="grid-item"
          :class="{ active: enabledWallet === 'eternl' }"
        >
          <img src="@/assets/eternl.png" alt="eternl" />
        </div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
      </div>
    </div>

    <div class="tab-2" v-if="activeStep === 1">
      <div class="account">
        <div class="selector">
          <div
            @click="selectTab('user')"
            :class="{ active: activeTab === 'user' }"
          >
            User
          </div>
          <div
            @click="selectTab('seller')"
            :class="{ active: activeTab === 'seller' }"
          >
            Seller
          </div>
        </div>
        <UserLogin v-if="activeTab === 'user'" />
        <SellerLogin v-if="activeTab === 'seller'" />
      </div>
    </div>
  </Sidebar>
</template>

<script>
import { ref, watch } from "vue";
import { walletClient } from "@/api/wallet-api";
import headerAPI from "../composable/header-api";
import SellerLogin from "./SellerLogin.vue";
import UserLogin from "./UserLogin.vue";

export default {
  components: {
    SellerLogin,
    UserLogin,
  },
  setup() {
    const {
      getDisplaySetupWallet,
      displaySetupWallet,
      getCurrentSeller,
      getCurrentUser,
    } = headerAPI();



    const stepsList = ref([
      {
        label: "Connect",
        icon: "pi pi-wallet",
      },
      {
        label: "Account",
        icon: "pi pi-user",
      },
    ]);

    const displayPanel = ref(false);

    const activeStep = ref(0);

    const enabledWallet = ref(null);

    const getWalletName = () => localStorage.getItem("pairfy-wallet");

    const walletName = getWalletName();

    if (walletName !== null) {
      activeStep.value = 1;
      enabledWallet.value = walletName;
    } else {
      displayPanel.value = true;
    }

    if (!getCurrentSeller.value && !getCurrentUser.value) {
      displayPanel.value = true;
    }

    watch(getDisplaySetupWallet, (newValue) => {
      if (newValue === true) {
        displayPanel.value = true;
      }
    });

    watch(displayPanel, (newValue) => {
      if (newValue === false) {
        displaySetupWallet(false);
      }
    });

    window.addEventListener("walletEnabledEvent", () => {
      activeStep.value = 1;
    });

    const selectWallet = async (e) => {
      await walletClient().connect(e);
    };

    const handleStep = (e) => {
      activeStep.value = e;
      enabledWallet.value = getWalletName();
    };

    const activeTab = ref("user");

    if (getCurrentSeller.value) {
      activeTab.value = "seller";
    }

    if (getCurrentUser.value) {
      activeTab.value = "user";
    }

    watch(getCurrentSeller, (newValue) => {
      if (newValue) {
        activeTab.value = "seller";
        displayPanel.value = false;
      }
    });

    watch(getCurrentUser, (newValue) => {
      if (newValue) {
        activeTab.value = "user";
        displayPanel.value = false;
      }
    });

    const selectTab = (e) => {
      activeTab.value = e;
    };

    return {
      displayPanel,
      stepsList,
      selectTab,
      activeStep,
      activeTab,
      enabledWallet,
      handleStep,
      selectWallet,
      getDisplaySetupWallet,
      displaySetupWallet,
    };
  },
};
</script>

<style lang="css" scoped>
.steps {
  padding: 1rem 4rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.steps-item {
  border: 1px solid var(--border-b);
  border-radius: 6px;
  width: 50px;
  height: 50px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.steps-item i {
  font-size: var(--text-size-d);
}

.steps-item.active {
  border: 2px solid var(--primary-c);
  color: var(--primary-c);
}

.message {
  padding: 1rem;
  border: 1px solid var(--border-b);
  border-radius: 12px;
  margin-top: 1rem;
  background: var(--base-b);
  line-height: 1.75rem;
  font-size: var(--text-size-b);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 1rem;
  padding: 1rem;
  margin-top: 1rem;
}

.grid-item {
  background: var(--base-b);
  border: 1px solid transparent;
  text-align: center;
  height: 50px;
  width: 50px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--border-b);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-a);
}

.grid-item:hover {
  border: 1px solid var(--primary-c);
}
.grid-item img {
  width: 24px;
  height: 24px;
}

.grid-item.active {
  border: 1px solid var(--primary-c);
}

.tab-1 {
}

.account {
  border-radius: 12px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-b);
}

.selector {
  display: flex;
  background: var(--base-b);
  padding: 4px;
  overflow: hidden;
  border-radius: 12px;
}

.selector div {
  padding: 0.75rem;
  text-align: center;
  width: 100%;
  cursor: pointer;
  font-size: var(--text-size-b);
  font-weight: 400;
  border-radius: 6px;
  transition: 0.1s ease-in-out;
}

.selector div:hover {
  font-weight: 500;
}

.selector div.active {
  font-weight: 500;
  color: var(--primary-c);
  background: var(--base-a);
  box-shadow: var(--shadow-a);
}

@media (max-width: 600px) {
  .grid-item {
    font-size: 1.2em;
  }
}

@media (max-width: 400px) {
  .grid-item {
    font-size: 1em;
  }
}
</style>
