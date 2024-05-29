<template>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :baseZIndex="10"
    dismissableMask
    closeOnEscape
    header="Country"
    :style="{ width: '23rem' }"
  >
    <div class="country">
      <div class="country-title">
        Choose a country to search and deliver products.
      </div>

      <Dropdown
        v-model="selectedCountry"
        :options="countries"
        filter
        optionLabel="name"
        placeholder="Country"
        class="country-dropdown"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="country-dropdown-item">
            <img
              :alt="slotProps.value.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
            />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="country-dropdown-item">
            <img
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>

      <Dropdown
        v-model="selectedLanguage"
        :options="languages"
        filter
        optionLabel="name"
        placeholder="Country"
        class="country-dropdown"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="country-dropdown-item">
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="country-dropdown-item">
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        text
        severity="secondary"
        @click="visible = false"
        autofocus
      />
      <Button
        label="Save"
        severity="secondary"
        @click="visible = false"
        autofocus
      />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="walletVisible"
    modal
    :draggable="false"
    :baseZIndex="10"
    dismissableMask
    closeOnEscape
    header="Wallet"
    :style="{ width: '23rem' }"
  >
    <div class="wallet">
      <div class="wallet-title">Choose a Cardano wallet.</div>

      <div class="wallet-grid">
        <div class="wallet-icon" @click="connectWallet('nami')">
          <img src="@/assets/nami.svg" alt="logo" />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Done"
        severity="secondary"
        @click="walletVisible = false"
        autofocus
      />
    </template>
  </Dialog>

  <!---HEADER-->

  <header class="header responsive">
    <div class="header-left">
      <img
        class="header-left-logo white"
        @click="reloadPage"
        src="@/assets/logo-white.png"
        alt="logo"
      />

      <img
        class="header-left-logo blue"
        @click="reloadPage"
        src="@/assets/logo-blue.png"
        alt="logo"
      />

      <div class="header-button left" @click="visible = true">
        <label for=""> <img src="@/assets/location.svg" alt="" /></label>
        <div>
          <span>{{ selectedLanguage.code }}</span>
          <span>{{ selectedCountry.name }}</span>
        </div>
      </div>

      <div class="header-button left">
        <div>
          <span>Sell a</span>
          <span>Product</span>
        </div>
      </div>
    </div>

    <!--CENTER-->

    <div class="header-center">
      <div class="header-center-search">
        <input
          type="text"
          maxlength="200"
          placeholder="What do you need to find today?"
        />

        <div>
          <i class="pi pi-search" />
        </div>
      </div>
    </div>

    <!--CENTER-END-->

    <div class="header-right">
      <div class="header-button right">
        <label v-badge.secondary for="">
          <img src="@/assets/gift.svg" alt=""
        /></label>
        <div>
          <span>Be a</span>
          <span>Mediator</span>
        </div>
      </div>

      <div class="header-button right">
        <label for=""> <img src="@/assets/cart.svg" alt="" /></label>

        <div class="header-right-count">
          <span>0</span>
        </div>
      </div>

      <div class="header-button right">
        <button @click="openWalletDialog">
          <i class="pi pi-bars" />
          <img src="@/assets/user.svg" alt="" />
        </button>
      </div>
    </div>

    <!--SUBMENU-->

    <div class="header-menu" :class="{ blue: currentRoute === 'product' }">
      <div class="header-menu-col left">
        <div class="header-menu-nav">
          <div
            v-for="item in navTabs"
            :key="item"
            :class="{ selected: selectedTab === item.value }"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="header-menu-col center" />
      <div class="header-menu-col right" />
    </div>
  </header>
</template>

<script>
import { walletAPI, CardanoWasm, balanceTx } from "@/api/wallet-api";
import { ref } from "vue";

export default {
  setup() {
    window.addEventListener(
      "scroll",
      function () {
        let currentScroll =
          window.scrollY || document.documentElement.scrollTop;

        if (currentScroll <= 0) {
          document.querySelector(".header-menu").style.display = "flex";
        } else {
          document.querySelector(".header-menu").style.display = "none";
        }
      },
      false
    );

    const wallet = walletAPI();
    const selectedCountry = ref({ name: "United States", code: "US" });
    const countries = ref([
      { name: "United States", code: "US" },
      { name: "Ecuador", code: "EC" },
      { name: "Colombia", code: "CO" },
    ]);

    const selectedLanguage = ref({ name: "English", code: "EN" });
    const languages = ref([
      { name: "English", code: "EN" },
      { name: "Spanish", code: "ES" },
    ]);

    return {
      wallet,
      selectedCountry,
      countries,
      selectedLanguage,
      languages,
    };
  },
  data() {
    return {
      isScrolled: false,
      visible: false,
      walletVisible: false,
      currentRoute: "",
      selectedTab: "all",
      navTabs: [
        {
          label: "All Products",
          value: "all-products",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Last Discounts",
          value: "last-discounts",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Best Sellers",
          value: "best-sellers",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Documentation",
          value: "documentation",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "P2P",
          value: "p2p",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Bounties",
          value: "bounties",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Help",
          value: "help",
          badge: false,
          badgeLabel: "",
        },
      ],
    };
  },
  created() {
    this.$watch(
      () => this.$route.name,
      (e) => (this.currentRoute = e),
      { immediate: true }
    )();
  },
  methods: {
    connectWallet(e) {
      this.wallet.connect(e);
    },

    openWalletDialog() {
      this.walletVisible = true;
    },

    async getPubKeyHash() {
      const usedAddr = await window.cardano.getUsedAddresses();

      const addrMap = usedAddr.map((hexAddr) => {
        let byteAddr = CardanoWasm.Address.from_hex(hexAddr);
        // eslint-disable-next-line
        let pkh = CardanoWasm.BaseAddress.from_address(byteAddr)
          .payment_cred()
          .to_keyhash()
          .to_hex();

        return {
          address: byteAddr.to_bech32(),
        };
      });

      const contractAddr = "-";

      const contractAdd = CardanoWasm.Address.from_bech32(contractAddr);

      const contractPkh = CardanoWasm.BaseAddress.from_address(contractAdd)
        .payment_cred()
        .to_keyhash()
        .to_hex();

      console.log(JSON.stringify(addrMap));
      console.log("contractAddr", JSON.stringify(contractPkh));
    },

    async deploy() {
      const tx = "-";

      const result = await balanceTx(tx);
      console.log(result);
    },
  },
  mounted() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    });
  },
};
</script>

<style lang="css" scoped>
.header {
  padding: 0.75rem 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  background: initial;
  color: var(--text-a);
  background: var(--blue-b);
  box-shadow: var(--border-shadow);
}

.header .header-left {
  flex-basis: 25%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header .header-left .header-left-logo {
  cursor: pointer;
  image-rendering: optimizeQuality;
  display: initial;
}

.header .header-left .header-left-logo.blue {
  display: none;
}

.header .header-center {
  flex-basis: 50%;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header .header-center .header-center-search {
  background: var(--base-b);
  transition: var(--button-transition-a);
  cursor: text;
  display: flex;
  align-items: center;
  border-radius: 4px;
  width: 90%;
  color: var(--text-a);
  font-size: var(--text-size-b);
  border: 1px solid transparent;
  box-shadow: 0 0 5px var(--blue-c), 0 0 5px var(--blue-c),
    0 0 5px var(--blue-c);
  transition: box-shadow 0.3s ease-in-out;
}

.header .header-center .header-center-search:focus-within {
  background: var(--base-a);
  border: 1px solid rgba(0, 0, 0, 0.8);
  box-shadow: initial;
}

.header .header-center .header-center-search div {
  color: var(--text-a);
  font-size: var(--text-size-b);
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-radius: 999px;
}

.header .header-center .header-center-search div i {
  font-weight: bold;
}

.header .header-center .header-center-search input {
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: var(--text-size-b);
  color: inherit;
  padding: calc(0.5rem + 0.125rem) 1rem;
}

.header .header-center .header-center-search input::placeholder {
  color: inherit;
  font-weight: 400;
  opacity: 0.6;
}

.header .header-right {
  flex-basis: 25%;
  display: flex;
  justify-content: flex-end;
}

.header .header-right button {
  font-size: var(--text-size-a);
  border-radius: 999px;
  padding: 0.5rem;
  color: var(--text-a);
  background: var(--base-a);
  border: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header .header-right button img {
  margin-left: 1rem;
}

.header-right-count {
  background: transparent;
  border-radius: 50%;
  text-align: center;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right-count span {
  font-weight: 700 !important;
  font-size: var(--text-size-e) !important;
}

.header .header-button {
  font-weight: 500;
  font-size: var(--text-size-d);
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  color: var(--text-w);
  transition: var(--button-transition-a);
  padding: 0 1rem;
}

.header .header-button.left {
  margin: auto;
}

.header .header-button.right {
  margin: auto;
}

.header .header-button div {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  color: var(--text-w);
}

.header .header-button div:hover {
  transition: var(--button-transition-a);
}

.header .header-button span {
  font-size: var(--text-size-b);
  line-height: 1.25rem;
  text-align: left;
}

.header .header-button span:nth-child(1) {
  font-weight: 400;
  font-size: var(--text-size-a);
}

.header .header-button label {
  width: 2rem;
  height: 2rem;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.header .header-button i {
  width: 2rem;
}

i {
  line-height: 0;
}

.header-menu {
  padding: 0 5%;
  z-index: 100;
  display: flex;
  position: fixed;
  top: 72px;
  left: 0;
  width: 100%;
  align-items: center;
  background: var(--blue-b);
  color: var(--text-w);
  font-weight: 500;
  border-top: 1px solid #1a83ff;
  border-bottom: 1px solid var(--base-c);
}

.header-menu.main {
  color: var(--text-w);
  background: var(--blue-c);
  font-weight: 600;
  border-bottom: 1px solid transparent;
}

.header-menu .header-menu-col {
  flex-basis: 33.33%;
}

.header-menu .header-menu-col.left {
  flex-basis: 33.33%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header-menu .header-menu-col.right {
  flex-basis: 33.33%;
  display: flex;
  justify-content: center;
}

.header-menu .header-menu-col.center {
  flex-basis: 66.66%;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-menu .header-menu-col .header-menu-nav {
  display: flex;
  align-items: center;
}

.header-menu .header-menu-col .header-menu-button {
  cursor: pointer;
  margin-right: 1rem;
}

.header-menu .header-menu-col .header-menu-button img {
  width: var(--text-size-e);
}

.header-menu .header-menu-col .header-menu-nav div {
  font-size: var(--text-size-a);
  white-space: nowrap;
  cursor: pointer;
  padding: calc(0.75rem + 0.125rem) 1rem;
  font-weight: inherit;
  color: inherit;
  background: transparent;
  font-weight: 400;
}

.header-menu .header-menu-col .header-menu-nav div:nth-child(1) {
  padding-left: initial;
}

.header-menu .header-menu-col .header-menu-nav div:hover {
  opacity: 0.8;
}

.country,
.wallet {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
}

.country .country-title {
  font-size: var(--text-size-a);
}

.country .country-dropdown {
  margin-top: 1rem;
}

.country-dropdown-item {
  display: flex;
  align-items: center;
  font-size: var(--text-size-b);
  font-weight: 600;
}

.country-dropdown-item img.flag {
  margin-right: 1rem;
}

.wallet-title {
  font-size: var(--text-size-a);
}

.wallet-icon {
  cursor: pointer;
  border: 1px solid var(--border-a);
  border-radius: 8px;
}
.wallet-icon img {
  width: 2rem;
  height: 2rem;
}

.wallet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3rem, 1fr));
  gap: 20px;
  margin-top: 1rem;
}

.wallet-icon {
  background: var(--base-a);
  border: 1px solid var(--border-b);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 3rem;
  height: 3rem;
}

/* Mobile devices (portrait and landscape) */

@media only screen and (max-width: 767px) {
  .wallet-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  header {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .responsive {
    display: none;
  }

  .header-left {
    justify-content: space-between;
  }
  .header-left-logo.white {
    display: none;
  }

  .header-left-logo.blue {
    display: initial;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .responsive {
    display: none;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .responsive {
    display: none;
  }
}

@media only screen and (min-width: 1200px) {
  .header .header-center .header-center-search {
    width: 80%;
  }

  .header-left {
    flex-basis: 30%;
  }

  .header-center {
    flex-basis: 40%;
  }

  .header-right {
    flex-basis: 30%;
  }
}
</style>
