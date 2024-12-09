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

  <header class="header mobile">
    <div class="header-top" :class="{ mobile: currentRoute === 'product' }">
      <img
        class="header-top-logo"
        @click="reloadPage"
        src="@/assets/logo-white.svg"
        alt="logo"
      />

      <div class="right-buttons">
        <div class="header-button left" @click="visible = true">
          <label> <img src="@/assets/location.svg" alt="" /></label>
          <div>
            <span>{{ selectedLanguage.code }}</span>
            <span>{{ selectedCountry.name }}</span>
          </div>
        </div>

        <div class="header-button left">
          <label v-badge.secondary>
            <img src="@/assets/gift.svg" alt=""
          /></label>
        </div>
      </div>
    </div>

    <!--CENTER-->

    <div class="header-center">
      <div class="header-button right">
        <label> <img src="@/assets/menu.svg" alt="" /></label>
      </div>

      <div class="header-center-search">
        <input type="text" maxlength="200" placeholder="Search" />

        <div>
          <i class="pi pi-search" />
        </div>
      </div>

      <div class="header-button right">
        <label> <img src="@/assets/cart.svg" alt="" /></label>
      </div>
    </div>

    <!--CENTER-END-->

    <div class="header-bottom">
      <div class="menu" :class="{ blue: currentRoute === 'product' }">
        <div class="menu-nav">
          <div
            v-for="item in navTabs"
            :key="item"
            :class="{ selected: selectedTab === item.value }"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>

    <!--SUBMENU-->
  </header>
</template>

<script>
import { walletClient, CardanoWasm, balanceTx } from "@/api/wallet-api";
import { ref } from "vue";

export default {
  setup() {
    const wallet = walletClient();
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
          label: "All",
          value: "all",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "New",
          value: "new",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Offers",
          value: "offers",
          badge: false,
          badgeLabel: "",
        },
        {
          label: "Docs",
          value: "docs",
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
          label: "P2P",
          value: "p2p",
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
      (name) => (this.currentRoute = name),
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
.right-buttons {
  display: flex;
  align-items: center;
}

.header {
  padding: 0;
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
  display: none;
}

.header .header-top {
  display: flex;
  flex-basis: 33.33%;
  padding: 0.5rem 1rem;
  align-items: center;
  border-bottom: 1px solid var(--blue-c);
  justify-content: space-between;
}

.header-top.mobile {
  display: none;
}

.header .header-top .header-top-logo {
  cursor: pointer;
  image-rendering: auto;
  display: initial;
  height: 38px;
  image-rendering: crisp-edges;
}

.header .header-center {
  flex-basis: 66.66%;
  padding: 0.5rem 1rem;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--blue-c);
}

.header .header-center .header-center-search {
  background: var(--base-b);
  transition: var(--button-transition-a);
  cursor: text;
  display: flex;
  align-items: center;
  border-radius: 4px;
  width: 100%;
  color: var(--text-a);
  font-size: var(--text-size-b);
  margin: 0 1rem;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

.header .header-center .header-center-search:focus-within {
  background: var(--base-a);
  border: 1px solid rgba(0, 0, 0, 0.8);
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
  padding: 0.25rem 1rem;
}

.header .header-center .header-center-search input::placeholder {
  color: inherit;
  font-weight: 400;
  opacity: 0.6;
}

.header .header-bottom {
  flex-basis: 33.33%;
  display: flex;
  justify-content: flex-end;
}

.header .header-bottom button {
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

.header .header-bottom button img {
  margin-left: 1rem;
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
}

.header .header-button.left {
  margin-left: 1rem;
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
  font-size: var(--text-size-a);
  text-align: left;
}

.header .header-button span:nth-child(1) {
  font-weight: 400;
  font-size: var(--text-size-a);
}

.header .header-button label {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.header .header-button img {
  width: 1.5rem;
  height: 1.5rem;
}

.header .header-button i {
  width: 2rem;
}

i {
  line-height: 0;
}

.menu {
  z-index: 100;
  display: flex;
  left: 0;
  width: 100%;
  align-items: center;
  background: var(--blue-b);
  color: var(--text-w);
  font-weight: 500;
}

.menu .menu-nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 0.125rem 0;
  scroll-behavior: smooth;
}

.menu .menu-button {
  cursor: pointer;
  margin-right: 1rem;
}

.menu .menu-button img {
  width: var(--text-size-e);
}

.menu .menu-nav div {
  font-size: var(--text-size-a);
  white-space: nowrap;
  cursor: pointer;
  padding: 0.75rem 1rem;
  font-weight: inherit;
  color: inherit;
}

.menu .menu-nav div:hover {
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

  .mobile {
    display: initial;
  }
}

/* Tablets and small desktops */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .mobile {
    display: initial;
  }
}

/* Medium desktops */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .mobile {
    display: initial;
  }
}

/* Large desktops and widescreen monitors */
@media only screen and (min-width: 1200px) {
  /* CSS rules for large desktops and widescreen monitors */
}
</style>
