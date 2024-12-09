<template>
  <div class="nav" :class="{ hide: currentRoute === 'session' }">
    <div class="nav-column left">
      <div class="nav-body">
        <div
          v-for="item in navTabs"
          :key="item"
          :class="{ selected: selectedTab === item.value }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div class="nav-column center" />
    <div class="nav-column right" />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const selectedTab = "all";

    const navTabs = ref([
      {
        label: "Categories",
        value: "categories",
        badge: false,
        badgeLabel: "",
      },
      {
        label: "Discounts",
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
    ]);

    let currentRoute = ref("");

    window.addEventListener(
      "scroll",
      function () {
        let currentScroll =
          window.scrollY || document.documentElement.scrollTop;

        if (currentRoute.value === "session") {
          document.querySelector(".nav").style.display = "none";

          return;
        }

        if (currentScroll <= 0) {
          document.querySelector(".nav").style.display = "flex";
        } else {
          document.querySelector(".nav").style.display = "none";
        }
      },
      false
    );

    return { navTabs, selectedTab, currentRoute };
  },
  created() {
    this.$watch(
      () => this.$route.name,
      (routeName) => (this.currentRoute = routeName),
      { immediate: true }
    )();
  },
};
</script>

<style lang="css" scoped>
.nav {
  padding: 0 10%;
  z-index: 100;
  display: flex;
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  align-items: center;
  background: var(--primary-a);
  color: var(--text-w);
  font-weight: 500;
}

.nav.hide {
  display: none;
}

.nav .nav-column {
  flex-basis: 33.33%;
}

.nav .nav-column.left {
  flex-basis: 33.33%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.nav .nav-column.right {
  flex-basis: 33.33%;
  display: flex;
  justify-content: center;
}

.nav .nav-column.center {
  flex-basis: 66.66%;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav .nav-column .nav-body {
  display: flex;
  align-items: center;
}

.nav .nav-column .nav-button {
  cursor: pointer;
  margin-right: 1rem;
}

.nav .nav-column .nav-button img {
  width: var(--text-size-e);
}

.nav .nav-column .nav-body div {
  font-size: var(--text-size-a);
  white-space: nowrap;
  cursor: pointer;
  padding: 0.75rem;
  font-weight: inherit;
  color: inherit;
  background: transparent;
  font-weight: 500;
}

.nav .nav-column .nav-body div:nth-child(1) {
  padding-left: initial;
}

.nav .nav-column .nav-body div:hover {
  opacity: 0.8;
}
</style>
