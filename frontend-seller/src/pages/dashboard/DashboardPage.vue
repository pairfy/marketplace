<template>
  <div class="dashboard">
    <div class="dashboard-nav">
      <div class="dashboard-nav-logo">
        <img src="./assets/logo.png" alt="" />
      </div>

      <div
        class="dashboard-nav-item"
        :class="{ selected: selectedNav === item.name }"
        v-for="item in navTabs"
        :key="item"
        @click="selectTab(item.name)"
      >
        <i :class="item.icon" />
        <span>{{ item.text }}</span>
      </div>

      <div class="dashboard-nav-item" @click="getPubKeyHash">
        <i class="pi pi-wallet" />

        <span>Wallets</span>
      </div>

      <div class="dashboard-nav-item bottom">
        <img
          class="avatar"
          src="https://api.dicebear.com/7.x/initials/svg?seed=tester1&backgroundColor=b6e3f4"
          alt=""
        />

        <span>{{ getUserData?.username }}</span>
      </div>
    </div>

    <ProductsView v-show="selectedNav === 'products'" />
    <SlotsView v-show="selectedNav === 'slots'" />
  </div>
</template>

<script>
import ProductsView from "./components/ProductsView.vue";
import entryAPI from "@/pages/entry/api";
import dashboardAPI from "@/pages/dashboard/api";
import SlotsView from "./components/SlotsView.vue";
import { Lucid, getAddressDetails } from "lucid-cardano";

export default {
  components: {
    ProductsView,
    SlotsView,
  },

  setup() {
    const { getUserData } = entryAPI();
    const { getProducts, getSlots, setupLucid, getLucid } = dashboardAPI();

    const update = {
      lucid: async () => setupLucid(await Lucid.new()),
      products: () =>
        getProducts()
          .then(() => console.info("products:updated"))
          .catch((err) => console.log(err)),

      slots: () =>
        getSlots()
          .then(() => console.info("slots:updated"))
          .catch((err) => console.log(err)),
    };

    document.addEventListener("productEvents", (event) => {
      console.log(event.detail.data.type);
      if (event.detail.data.type === "product:created") {
        update.products();
      }
    });

    document.addEventListener("gateEvents", (event) => {
      console.log(event.detail.data.type);
      if (event.detail.data.type === "slot:created") {
        update.slots();
      }
    });

    document.addEventListener("getWalletEvent", (event) => {
      console.log(event);
    });

    update.lucid();
    update.products();
    update.slots();
    return {
      getUserData,
      setupLucid,
      getLucid,
    };
  },
  data() {
    return {
      selectedNav: "slots",  
      lucidClient: null,
      navTabs: [
        {
          name: "home",
          text: "Home",
          icon: "pi pi-home",
          index: 0,
          path: "",
        },
        {
          name: "products",
          text: "Products",
          icon: "pi pi-table",
          index: 1,
          path: "",
        },
        {
          name: "slots",
          text: "Slots",
          icon: "pi pi-folder",
          index: 1,
          path: "",
        },
        {
          name: "configuration",
          text: "Configuration",
          icon: "pi pi-cog",
          index: 1,
          path: "",
        },
      ],
    };
  },
  methods: {
    selectTab(e) {
      this.selectedNav = e;
    },
    async getPubKeyHash() {
      const addr = await this.getLucid.wallet.address();
      const details = await getAddressDetails(addr);
      console.log(details);
      console.log(details.paymentCredential.hash);
    },
  },

  async mounted() {
    const api = await window.cardano.nami.enable();

    this.getLucid.selectWallet(api);
  },
};
</script>

<style lang="css" scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.dashboard-nav {
  padding: 8px;
  width: 56px;
  transition: 0.2s cubic-bezier(0.08, 0.52, 0.52, 1);
  box-shadow: var(--shadow-a);
  position: fixed;
  min-height: 100vh;
  overflow: hidden;
  z-index: 1000;
  background: var(--base-a);
}

.dashboard-nav:hover {
  width: 212px;
}

.dashboard-nav-item {
  display: flex;
  border-radius: 6px;
  min-height: 40px;
  color: var(--text-a);
  padding: 8px;
  align-items: center;
  overflow: hidden;
  margin-bottom: 0.5rem;
  cursor: default;
}

.dashboard-nav-item:hover {
  background: var(--base-b);
}
.dashboard-nav-item.selected {
  background-color: #283943;
  color: var(--text-w);
}
.dashboard-nav-item span {
  margin-left: 1rem;
  font-size: var(--text-size-a);
  font-weight: 600;
}

.dashboard-nav-item i {
  margin-left: 1rem;
  margin-left: 3px;
  font-size: var(--text-size-c);
  font-weight: 100;
}

.dashboard-nav-logo {
  margin: 1rem 0;
  justify-content: flex-start;
  display: flex;
}

.dashboard-nav-item.bottom {
  position: absolute;
  bottom: 1rem;
  padding: 0;
}

.dashboard-nav-item.bottom span {
  font-size: var(--text-size-b);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
