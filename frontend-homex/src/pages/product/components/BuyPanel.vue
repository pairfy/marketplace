<template>
  <Dialog v-model:visible="tableVisible" modal dismissableMask blockScroll header="Buy Options" :draggable="false"
    :style="{ width: '70vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <DataTable ref="dt" :value="orderList" v-model:selection="selectedProducts" dataKey="id" style="height: 70vh"
      :paginator="true" :rows="10" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
      <template #header>
        <div class="toolbar">
          <InputText v-model="filters['global'].value" placeholder="Search..." />
        </div>
      </template>

      <Column field="id" header="Code" sortable style="min-width: 12rem"></Column>

      <Column field="mode" header="Mode" sortable style="min-width: 10rem; text-transform: capitalize"></Column>

      <Column field="contract_units" header="Units" sortable style="min-width: 10rem"></Column>

      <Column field="contract_price" header="Price" sortable style="min-width: 10rem">
        <template #body="orderProps">
          {{ formatLovelace(orderProps.data.contract_price) }}
        </template>
      </Column>

      <Column field="contract_collateral" header="Collateral" sortable style="min-width: 10rem">
        <template #body="orderProps">
          {{ formatLovelace(orderProps.data.contract_collateral) }}
        </template>
      </Column>

      <Column field="contract_discount" header="Discount" sortable style="min-width: 10rem">
        <template #body="orderProps">
          {{ formatDiscount(orderProps.data.product_discount) }}
        </template>
      </Column>

      <Column :exportable="false" style="min-width: 10rem">
        <template #body="orderProps">
          <button class="miniBuyButton" @click="createTransaction(orderProps.data.id)">
            Buy
          </button>
        </template>
      </Column>
    </DataTable>

    <template #footer> </template>
  </Dialog>
  <!--//////////////////////////////////////////////////////////////////////////-->
  <!--//////////////////////////////////////////////////////////////////////////-->
  <div class="panel">
    <div class="panel-info">
      <span> {{ getOrdersData?.order_count }} Available</span>
    </div>

    <div class="panel-name">
      {{ getProductData.name }}
    </div>

    <div class="panel-legend">
      <span>Model: {{ getProductData.model }} </span>
      <span>SKU: {{ getProductData.id }}</span>
    </div>

    <div class="panel-rating">
      <Rating :modelValue="product.rating_count" :stars="5" :readonly="true" :cancel="false"
        style="margin-right: 0.5rem" />
      <span>{{ product.rating_count }}</span>

      <span>({{ product.review_count }} Reviews)</span>
    </div>

    <div class="panel-price">
      <div class="ada-label">₳</div>
      <span>{{ getProductData.price }}</span>
    </div>

    <InfoIcons />

    <div class="panel-button buyButton" @click="openSlotDialog">
      <div>Buy now</div>
    </div>
  </div>
</template>

<script>
import InfoIcons from "./InfoIcons.vue";
import productAPI from "@/pages/product/api/index";
import { FilterMatchMode } from "primevue/api";
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { balanceTx, lucidClient, walletClient } from "@/api/wallet-api";


export default {
  components: {
    InfoIcons,
  },

  setup() {
    const { getProductData, getOrdersData, locking, lockingTx } =
      productAPI();

    const router = useRouter();

    const product = ref({
      rating_count: 4.8,
      review_count: 558,
    });

    const tableVisible = ref(false);

    const openSlotDialog = () => {
      tableVisible.value = true;
    };

    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const orderList = computed(() => getOrdersData?.value.orders);

    const selectedProducts = ref();

    const downloadTx = (txHash, orderId) => {
      const data = [["ContractTx1", txHash]];

      const csvContent = data.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;

      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const dated = `${month}-${day}-${year}-${hours}-${minutes}`;

      a.download = `transaction-${orderId}-${dated}.csv`;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return txHash;
    };

    const errorMessage = {
      severity: "error",
      summary: "Error Message",
      detail: "Transaction canceled.",
      life: 5000,
    };
    const toast = useToast();

    const showMessage = ({ severity, summary, detail, life }) => {
      toast.add({
        severity,
        summary,
        detail,
        life,
      });
    };

    const createTransaction = async (orderId) => {
      const { getWallet } = walletClient();

      lucidClient.selectWallet(getWallet());

      await locking({ order_id: orderId })
        .then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => lockingTx({ tx_hash: hash, order_id: orderId }))
        .then(() => router.push({ name: "session", params: { id: orderId } }))
        .catch(() => showMessage(errorMessage));
    };

    const formatDiscount = (value) => {
      return `${value} %`
    }

    const formatLovelace = (value) => {
      return `${value / 1000000} ADA`
    }

    return {
      product,
      downloadTx,
      tableVisible,
      openSlotDialog,
      formatDiscount,
      formatLovelace,
      filters,
      orderList,
      createTransaction,
      selectedProducts,
      getProductData,
      getOrdersData,
    };
  },
};
</script>

<style lang="css" scoped>
.panel {
  border: 2px solid var(--border-a);
  border-radius: 8px;
  padding: 1rem;
}

.panel-info {
  font-size: var(--text-size-a);
  font-weight: 400;
  text-align: left;
  color: var(--primary-c);
}

.panel-name {
  font-size: var(--text-size-f);
  font-weight: 600;
  text-align: left;
  width: 100%;
  margin-top: 1rem;
  line-height: 2.25rem;
}

.panel-legend {
  text-align: left;
  font-size: var(--text-size-b);
  margin-top: 1rem;
  font-weight: 400;
  color: var(--text-a);
}

.panel-legend span {
  margin-right: 1rem;
}

.panel-rating {
  font-size: var(--text-size-c);
  align-items: center;
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;

}

.panel-rating span {
  margin-right: 0.5rem;
  font-size: var(--text-size-c);
  font-weight: 600;
}

.panel-rating span:nth-child(3) {
  font-weight: 400;
  font-size: var(--text-size-b);
  color: var(--text-b);
}

.panel-price {
  text-align: left;
  margin-top: initial;
  font-size: var(--text-size-h);
  font-weight: 700;
  display: flex;
  align-items: baseline;
  margin-top: 1rem;
}

.panel-price .ada-label {
  font-weight: 500;
  color: var(--text-a);
  font-size: var(--text-size-g);
  margin-right: 0.5rem;
  margin-bottom: 2px;
}

.panel-button {
  border: 1px solid var(--primary-c);
  border-radius: 999px;
  color: var(--text-w);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  text-align: center;
  margin-top: 1rem;
  transition: var(--transition-a);
  background: var(--primary-c);
  font-size: var(--text-size-b);
  box-shadow: var(--shadow-b);
}

.panel-button.buyButton {
  margin-top: 2rem;
}

.panel-button:hover {
  opacity: 0.8;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
}

.miniBuyButton {
  background: var(--primary-b);
  color: var(--text-a);
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--primary-b);
  cursor: pointer;
  padding: 0.25rem 1rem;
}
</style>
