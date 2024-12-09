<template>
  <div class="wrapper">
    <Toast closeIcon="false" />
    <NavMenu v-if="getUserData" />

    <div class="wrapper-content">
      <RouterView />
    </div>
  </div>

</template>

<script setup>
import NavMenu from './components/NavMenu.vue'
import dashboardAPI from '@/views/api/index';
import { RouterView } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { provide } from 'vue';
import { ApolloClients } from '@vue/apollo-composable';
import { productClient, gatewayClient } from './graphql/index';
import { formatWithDots, reduceByLength, formatCurrency } from "./utils/index"

provide(ApolloClients, {
  default: productClient,
  product: productClient,
  gateway: gatewayClient,
})

provide('utils', {
  formatWithDots,
  reduceByLength,
  formatCurrency
});

const toast = useToast();

const { getUserData, getUser } = dashboardAPI();

const showSuccess = (content) => {
  toast.add({ severity: 'secondary', summary: '', detail: content, life: 3000, closable: false });
};


const showError = (content) => {
  toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

getUser().then(() => console.log('👋 Welcome')).catch(() => showError('AUTH_ERROR'))

</script>

<style scoped>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.wrapper {
  height: 100vh;
  display: flex;
  transition: all .2s ease;
}

.wrapper-content {
  flex: 1;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
