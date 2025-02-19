<template>
  <div class="navigation" :class="{ focus: isFocus }" @mouseover="isFocus = true" @mouseleave="isFocus = false">
    <div class="navigation-item" :class="{ focus: isFocus, actived: isActive('home') }">
      <RouterLink to="/" :class="{ focus: isFocus }">
        <div class="image flex">
          <div class="mask" :class="{ actived: isActive('home') }">
            <img src="@/assets/icons/home.svg" alt="">
          </div>
        </div>
        <span class="legend" :class="{ focus: isFocus }">Home</span>
      </RouterLink>
    </div>

    <div class="navigation-item" :class="{ actived: isActive('product-list') }">
      <RouterLink to="/product-list" :class="{ focus: isFocus }">
        <div class="image flex">
          <div class="mask" :class="{ actived: isActive('product-list') }">
            <img src="@/assets/icons/market.svg" alt="">
          </div>
        </div>
        <span class="legend" :class="{ focus: isFocus }">Product List</span>
      </RouterLink>
    </div>

    <div class="navigation-item" :class="{ actived: isActive('create-product') }">
      <RouterLink to="/create-product" :class="{ focus: isFocus }">
        <div class="image flex">
          <div class="mask" :class="{ actived: isActive('create-product') }">
            <img src="@/assets/icons/plus.svg" alt="">
          </div>
        </div>
        <span class="legend" :class="{ focus: isFocus }">Create Product</span>
      </RouterLink>
    </div>

    <div class="navigation-item" :class="{ actived: isActive('product-books') }">
      <RouterLink to="/product-books" :class="{ focus: isFocus }">
        <div class="image flex">
          <div class="mask" :class="{ actived: isActive('product-books') }">
            <img src="@/assets/icons/book.svg" alt="">
          </div>
        </div>
        <span class="legend" :class="{ focus: isFocus }">Product Books</span>
      </RouterLink>
    </div>


    <div class="navigation-item" :class="{ actived: isActive('notifications') }">
      <RouterLink to="/notifications" :class="{ focus: isFocus }">
        <div class="image flex">
          <div class="mask" :class="{ actived: isActive('notifications') }">
            <img src="@/assets/icons/bell.svg" alt="">
          </div>
        </div>
        <span class="legend" :class="{ focus: isFocus }">Notifications</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentRoute = ref("/");

const unwatchRoute = watch(
  () => route.name,
  (name) => currentRoute.value = name,
  { immediate: true }
);

const isActive = (name) => {
  return currentRoute.value === name
}
const isFocus = ref(false);

onBeforeUnmount(() => {
  unwatchRoute()
});
</script>


<style scoped>
.navigation {
  background: var(--background-b);
  align-items: flex-start;
  flex-direction: column;
  -webkit-user-select: none;
  -moz-user-select: none;
  color: var(--text-b);
  user-select: none;
  transition: 0.2s;
  overflow: hidden;
  display: flex;
  margin-left: 0;
  width: 64px;
  z-index: 10;
  height: 100%;
}

.navigation.focus {
  width: 17rem;
}

.navigation .navigation-item {
  font-size: var(--text-size-2);
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 400;
  box-shadow: none;
  cursor: pointer;
  color: inherit;
}

a {
  width: 100%;
  text-decoration: none;
  justify-content: flex-start;
  border-top-left-radius: initial;
  border-bottom-left-radius: initial;
  display: flex;
  color: inherit;
  align-items: center;
  transition: 0.2s;
}

@media (hover: hover) {
  a:hover {
    background-color: var(--background-b);
  }
}

.navigation .navigation-item span {
  color: inherit;
}

.navigation .navigation-item.actived {
  color: var(--primary-a);

}

.navigation .navigation-item .image {
  justify-content: center;
  width: 64px;
  height: 64px;
}

.navigation .navigation-item .image img {
  width: var(--text-size-4);
  height: var(--text-size-4);
}

.mask {
  border-radius: 50%;
  background: transparent;
  width: 60%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mask.actived {
  background: #d3dbe561;
}

.legend {
  display: initial;
  white-space: nowrap;
  margin-left: 0;
}

</style>
