<template>
  <Dialog v-model:visible="visible" modal :draggable="false" :baseZIndex="10" dismissableMask closeOnEscape
    header="Country" :style="{ width: '23rem' }">
    <div class="country">
      <div class="country-title">
        Choose a country to search and deliver products.
      </div>

      <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Country"
        class="country-dropdown">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="country-dropdown-item">
            <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="country-dropdown-item">
            <img :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>

      <Dropdown v-model="selectedLanguage" :options="languages" filter optionLabel="name" placeholder="Country"
        class="country-dropdown">
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
      <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
      <Button label="Save" severity="secondary" @click="visible = false" autofocus />
    </template>
  </Dialog>

  <!---HEADER-->

  <header class="header responsive">
    <div class="header-left">
      <img class="header-logo white" @click="openHome" src="@/assets/logo-white.png" alt="logo" />

      <img class="header-logo blue" @click="openHome" src="@/assets/logo-blue.png" alt="logo" />

      <div class="header-button left" @click="visible = true">
        <div>
          <span>Deliver to</span>
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
        <input type="text" maxlength="200" placeholder="What do you need to find today?" />

        <div>
          <i class="pi pi-search" />
        </div>
      </div>
    </div>

    <!--CENTER-END-->

    <div class="header-right">
      <div class="header-button right">
        <div>
          <span>Be a</span>
          <span>Mediator</span>
        </div>
      </div>

      <div class="header-button right">
        <label for=""> <img src="@/assets/cart.svg" alt="" /></label>

        <div class="header-right-count">0</div>
      </div>

      <div class="header-button right">
        <button @click="displaySetupWallet(true)">
          <i class="pi pi-bars" />
          <img src="@/assets/user.svg" alt="" />
        </button>

        <SignWrap />
      </div>
    </div>

    <!--SUBMENU-->

    <NavWrap />
  </header>
</template>

<script>
import { ref } from "vue";
import headerAPI from "./composable/header-api";
import NavWrap from "./components/NavWrap.vue";
import SignWrap from "./components/SignWrap.vue";

export default {
  components: {
    NavWrap,
    SignWrap,
  },
  setup() {
    let currentRoute = ref("");

    const { displaySetupWallet } = headerAPI();

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
      currentRoute,
      selectedCountry,
      countries,
      selectedLanguage,
      languages,
      displaySetupWallet,
    };
  },
  data() {
    return {
      visible: false
    };
  },
  created() {
    this.$watch(
      () => this.$route.name,
      (routeName) => (this.currentRoute = routeName),
      { immediate: true }
    )();
  },
  methods: {

    openHome() {
      if (this.currentRoute === "home") {
        return location.reload();
      }

      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style lang="css" scoped>
.header {
  padding: 0.5rem 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  background: var(--primary-a);
  box-shadow: var(--shadow-b);
}

.header .header-left {
  flex-basis: 25%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header .header-left .header-logo {
  cursor: pointer;
  image-rendering: optimizeQuality;
  display: initial;
  margin-right: auto;
}

.header .header-left .header-logo.blue {
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
  background: var(--base-a);
  cursor: text;
  display: flex;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  color: var(--text-a);
  font-size: var(--text-size-b);
  box-shadow: initial;
  transition: var(--transition-b);
}

.header .header-center .header-center-search:focus-within {
  background: var(--base-a);
  box-shadow: 0 0 0 2px var(--primary-b), 0 0 0 3px var(--primary-b);
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
  padding: 0.75rem 1rem;
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
  border: none;
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
  font-weight: 700;
  font-size: var(--text-size-d);
  color: var(--text-w);
}

.header .header-button {
  font-weight: 500;
  font-size: var(--text-size-d);
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  color: var(--text-w);
  transition: var(--transition-a);
}

.header .header-button.left {
  margin-right: auto;
}

.header .header-button.right {
  margin-left: auto;
}

.header .header-button div {
  display: flex;
  flex-direction: column;
}

.header .header-button div:hover {
  transition: var(--button-transition-a);
}

.header .header-button span {
  font-size: var(--text-size-a);
  line-height: 1.25rem;
  text-align: left;
  font-weight: 600;
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

.country {
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





/* Mobile devices (portrait and landscape) */

@media only screen and (max-width: 767px) {

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

  .header-logo.white {
    display: none;
  }

  .header-logo.blue {
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
    width: 100%;
  }

  .header-left {
    flex-basis: 20%;
  }

  .header-center {
    flex-basis: 40%;
  }

  .header-right {
    flex-basis: 20%;
  }
}
</style>
