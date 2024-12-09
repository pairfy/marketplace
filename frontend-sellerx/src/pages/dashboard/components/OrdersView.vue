<template>
  <div class="orders">
    <!--////////////////////////////////////////////////////////////////////////-->

    <!--////////////////////////////////////////////////////////////////////////-->
    <Dialog v-model:visible="messageModalVisible" modal header="Message" :draggable="false" :style="{ width: '35rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <p>{{ messageModal }}</p>

      <p v-for="e in errorModal" :key="e">{{ e }}</p>

      <template #footer>
        <div class="modal-footer">
          <Button type="button" label="Ok" @click="closeAllModals" />
        </div>
      </template>
    </Dialog>
    <!--////////////////////////////////////////////////////////////////////////-->

    <!--////////////////////////////////////////////////////////////////////////-->
    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '425px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
      </template>
    </Dialog>
    <!--////////////////////////////////////////////////////////////////////////-->

    <!--////////////////////////////////////////////////////////////////////////-->
    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '425px' }" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete the selected orders?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
      </template>
    </Dialog>
    <!--////////////////////////////////////////////////////////////////////////-->

    <!--////////////////////////////////////////////////////////////////////////-->
    <Dialog v-model:visible="createOrderDialog" :style="{ width: '400px' }" header="Create orders" :modal="true"
      dismissableMask :draggable="false">
      <div class="createslot">
        <LoadingBars v-if="createOrderLoader" />

        <div class="createslot-wrap" v-if="!createOrderLoader">
          <div class="total">
            <p>Total orders {{ computedTotalOrders }}</p>
            <p>Units = {{ computedUnits }}</p>
            <p>Collateral = {{ computedCollateral }}</p>
            <p>Product Price = {{ computedPrice }}</p>
          </div>

          <div class="field">
            <label for="batchMode" class="field-label">
              <span>Batch</span>
              <i class="pi pi-info-circle" v-tooltip.top="'Batch mode allows to add discounts for multiple units.'
                " />
            </label>
            <InputSwitch id="batchMode" v-model="orderForm.batchMode" @change="() => resetSlotForm()" />
          </div>

          <div class="field">
            <label for="units" class="field-label">
              <span>Units</span>
              <i class="pi pi-info-circle" v-tooltip.top="'Number of units available for sale.'" />
            </label>
            <InputNumber id="units" v-model="orderForm.productUnits" showButtons placeholder="" integeronly
              locale="en-US" :min="0" :class="{ invalid: orderFormErrors.productUnits }" />
            <small class="p-error" v-if="orderFormErrors.productUnits">
              The unit is required and greater than 0.
            </small>
          </div>

          <div class="field">
            <label for="batch" class="field-label">
              <span>Batch</span>
              <i class="pi pi-info-circle" v-tooltip.top="'Each batch contains the chosen number of units.'
                " />
            </label>
            <InputNumber id="batch" v-model="orderForm.batchNumber" showButtons placeholder=""
              :disabled="!orderForm.batchMode" integeronly locale="en-US" :min="0"
              :class="{ invalid: orderFormErrors.batchNumber }" />
            <small class="p-error" v-if="orderFormErrors.batchNumber">
              The batch must be greater than 0.
            </small>
          </div>

          <div class="field">
            <label for="unitDiscount" class="field-label">
              <span>Discount</span>
              <i class="pi pi-info-circle" v-tooltip.top="'Discount per unit in batch mode.'" />
            </label>
            <InputNumber id="unitDiscount" v-model="orderForm.productDiscount" showButtons
              placeholder="Select A Percentage" :disabled="!orderForm.batchMode" integeronly suffix=" % OFF"
              locale="en-US" :min="0" :max="100" :class="{ invalid: orderFormErrors.productDiscount }" />
            <small class="p-error" v-if="orderFormErrors.productDiscount">
              The discount must be greater than 0.</small>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="closeProductDialog" />
        <Button label="Create" text @click="createOrders" />
      </template>
    </Dialog>
    <!--////////////////////////////////////////////////////////////////////////-->

    <!--////////////////////////////////////////////////////////////////////////-->
    <Dialog v-model:visible="orderListDialogVisible" :style="{ width: '75vw' }" maximizable modal dismissableMask
      :draggable="false" :contentStyle="{ height: '80vw' }">
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">Product orders</span>
          <div class="network-analyzer">
            <div class="loader" />
            <span>Scanning network</span>
          </div>
        </div>
      </template>

      <DataTable :value="productList[orderListDialogIndex].orders" stripedRows scrollable scrollHeight="flex"
        tableStyle="min-width: 50rem;">
        <Column field="created_at" header="Date" sortable style="max-width: 10rem">
          <template #body="orderProps">
            {{ formatDate(orderProps.data.created_at) }}
          </template>
        </Column>
        <Column field="id" header="Code" sortable></Column>

        <Column field="status" header="Status" sortable></Column>

        <Column field="mode" header="Mode" sortable>
          <template #body="orderProps">
            <span>{{ orderProps.data.mode }}</span>
          </template>
        </Column>


        <Column field="contract_units" header="Units" sortable></Column>

        <Column field="contract_price" header="Price" sortable>
          <template #body="orderProps">
            {{ formatLovelace(orderProps.data.contract_price) }}
          </template>
        </Column>

        <Column field="contract_collateral" header="Collateral" sortable>
          <template #body="orderProps">
            {{ formatLovelace(orderProps.data.contract_collateral) }}
          </template>
        </Column>

        <Column field="contract_0_tx" :exportable="false" header="Actions" sortable>
          <template #body="orderProps">
            <div class="table-buttons">

              <Button class="switch-button table-button canceled" v-if="orderProps.data.status === 'canceled'">
                Canceled
              </Button>

              <Button class="switch-button table-button actived"
                v-if="orderProps.data.status === 'waiting' || orderProps.data.contract_0_tx">
                Actived
              </Button>

              <Button class="switch-button table-button" v-if="orderProps.data.status === 'created'"
                @click="deployTransaction(orderProps.data.id)">
                Deploy
              </Button>

              <Button class="table-button" icon="pi pi-times" v-tooltip.top="'Cancel'"
                :disabled="orderProps.data.status !== 'waiting'" outlined rounded
                @click="cancelTransaction(orderProps.data.id)" />

              <Button class="table-button" icon="pi pi-arrow-up-right" v-tooltip.top="'Show the negotiation session.'"
                outlined rounded @click="openSessionPage(orderProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
      <template #footer>
        <Button label="Done" @click="orderListDialogVisible = false" />
      </template>
    </Dialog>
    <Toast />
    <!--////////////////////////////////////////////////////////////////////////-->

    <!--////////////////////////////////////////////////////////////////////////-->
    <div class="orders-wrap">
      <div class="orders-card">
        <DataTable ref="productListTable" resizableColumns :value="productList" v-model:expandedRows="selectedProducts"
          dataKey="id" :paginator="true" :rows="10" :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate="{first} to {last} of {totalRecords} items">
          <template #expansion> x </template>
          <template #header>
            <div class="orders-header">
              <div class="orders-header-left">
                <span>Create orders</span>
                <span>Choose the product and the quantity available for sale.</span>
              </div>

              <div class="orders-header-right">
                <div class="orders-header-right-search">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Search" />
                </div>
              </div>
            </div>

            <Toolbar>
              <template #end>
                <Button label="Export" icon="pi pi-upload" @click="exportCSV($event)" />
              </template>
            </Toolbar>
          </template>

          <Column style="width: 3rem" :exportable="false" />

          <Column header="Image" style="max-width: 8rem">
            <template #body="orderProps">
              <Image :src="orderProps.data.media_url +
                orderProps.data.media_path +
                orderProps.data.image_main
                " :alt="orderProps.data.image_main" width="70" height="70"
                imageStyle="border-radius: 8px; object-fit: contain; border: 1px solid var(--border-b);" preview />
            </template>
          </Column>

          <Column field="id" header="Code" sortable>
            <template #body="orderProps">
              <div v-tooltip.top="'Copy'" style="cursor: pointer" @click="copy(orderProps.data.id)">
                {{ orderProps.data.id }}
              </div>
            </template>
          </Column>

          <Column field="name" header="Name" sortable style="max-width: 16rem; white-space: break-spaces">
            <template #body="orderProps">
              <div v-tooltip.top="'Copy'" style="cursor: pointer" @click="copy(orderProps.data.name)">
                {{ orderProps.data.name.slice(0, 30) }}...
              </div>
            </template>
          </Column>

          <Column field="category" header="Category" sortable style="min-width: 8rem; text-transform: capitalize">
            <template #body="orderProps">
              {{ orderProps.data.category }}
            </template>
          </Column>

          <Column field="price" header="Price" sortable style="min-width: 8rem">
            <template #body="orderProps">
              {{ formatCurrency(orderProps.data.price) }}
            </template>
          </Column>

          <Column field="collateral" header="Collateral" sortable style="min-width: 8rem">
            <template #body="orderProps">
              {{ formatCurrency(orderProps.data.collateral) }}
            </template>
          </Column>

          <Column field="order_count" header="Orders" sortable style="min-width: 8rem">
            <template #body="orderProps">
              {{ orderProps.data.order_count }}
            </template>
          </Column>

          <Column :exportable="false" style="min-width: 8rem" header="Actions">
            <template #body="orderProps">
              <div class="table-buttons">

                <Button class="table-button" icon="pi pi-plus" outlined rounded v-tooltip.top="'Create orders'"
                  @click="openCreateSlotDialog(orderProps.index)" />

                <Button class="table-button" icon="pi pi-receipt" outlined rounded v-tooltip.top="'Show orders'"
                  :disabled="orderProps.data.order_count < 1" @click="openOrderListDialog(orderProps.index)">
                  <i class="pi pi-folder" />
                </Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import dashboardAPI from "@/pages/dashboard/api/index";
import LoadingBars from "@/components/LoadingBars.vue";
import { getAddressDetails } from "lucid-cardano";
import { FilterMatchMode } from "primevue/api";
import { HOST } from "@/api/index";
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { lucidClient, walletClient, balanceTx } from "@/api/wallet-api";
import { NETWORK } from "@/api/index";

export default {
  components: {
    LoadingBars,
  },
  setup() {
    const {
      getOrdersData,
      deployTx,
      createProduct,
      createOrder,
      deploy,
      cancel,
      cancelTx
    } = dashboardAPI();

    const productList = ref(getOrdersData.value);

    let product = ref({
      id: null,
      seller_id: null,
      name: null,
      description: "",
      category: null,
      price: null,
      collateral: null,
      stock: null,
      stock_status: null,
      keywords: null,
      theme: null,
      country: null,
      moderated: false,
      image_base: null,
      image_path: null,
      image_main: null,
      image_set: [],
      created_at: null,
      schema_t: null,
      schema_v: null,
      orders: [],
      order_count: null,
    });

    let invalidProductName = ref(false);
    let invalidProductDescription = ref(false);
    let invalidProductCategory = ref(false);
    let invalidSlotQuantity = ref(false);
    let invalidProductCollateral = ref(false);
    let invalidProductStock = ref(false);
    let invalidProductKeywords = ref(false);
    let invalidProductImages = ref(false);

    let messageModalVisible = ref(false);
    let messageModal = ref(null);
    let errorModal = ref(null);
    let disableUpload = ref(false);

    const resetForm = () => {
      product.value = {
        id: null,
        seller_id: null,
        name: null,
        description: "",
        category: null,
        price: null,
        collateral: null,
        stock: null,
        stock_status: null,
        keywords: null,
        theme: null,
        country: null,
        moderated: false,
        image_base: null,
        image_path: null,
        image_main: null,
        image_set: [],
        created_at: null,
        schema_t: null,
        schema_v: null,
        orders: [],
        order_count: null,
      };

      invalidProductName.value = false;
      invalidProductDescription.value = false;
      invalidProductCategory.value = false;
      invalidSlotQuantity.value = false;
      invalidProductCollateral.value = false;
      invalidProductStock.value = false;
      invalidProductKeywords.value = false;
      invalidProductImages.value = false;

      messageModalVisible.value = false;
      messageModal.value = null;
      errorModal.value = null;
      disableUpload.value = false;
    };




    const orderForm = ref({
      batchMode: false,
      productUnits: 1,
      batchNumber: 0,
      productDiscount: undefined,
    });

    const resetSlotForm = () => {
      orderForm.value = {
        batchMode: orderForm.value.batchMode,
        productUnits: 1,
        batchNumber: 0,
        productDiscount: undefined,
      };
    };

    const orderFormErrors = ref({
      batchMode: false,
      productUnits: false,
      batchNumber: false,
      productDiscount: false,
    });

    const { text, copy, copied, isSupported } = useClipboard();

    return {
      text,
      copy,
      copied,
      cancel,
      cancelTx,
      isSupported,
      deployTx,
      orderFormErrors,
      orderForm,
      createOrder,
      resetSlotForm,
      productList,
      deploy,
      product,
      disableUpload,
      resetForm,
      messageModalVisible,
      messageModal,
      errorModal,
      getOrdersData,
      createProduct,
      invalidProductName,
      invalidProductDescription,
      invalidProductCategory,
      invalidSlotQuantity,
      invalidProductCollateral,
      invalidProductStock,
      invalidProductKeywords,
      invalidProductImages,
    };
  },
  data() {
    return {
      mediaHostURL: HOST + "/api/media/create-image",
      createOrderLoader: false,
      createOrderDialog: false,
      createOrderIndex: null,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      descriptionLengthLimit: 1000,
      nameLengthLimit: 200,
      minProductImages: 5,
      orderListDialogVisible: false,
      orderListDialogIndex: null,
      orderMenu: [
        {
          label: "Options",
          items: [
            {
              label: "Cancel",
              icon: "",
            },
            {
              label: "TxId",
              icon: "",
              command: () => {
                const internalUrl = `https://${NETWORK}.cardanoscan.io/transaction/${this.orderMenuData.contract_0_tx}`;
                window.open(internalUrl, "_blank");
              }
            }
          ],
        },
      ],
      maxProductImages: 5,
      selectedProducts: null,
      filters: {},
    };
  },
  created() {
    this.setupFilters();
  },
  computed: {
    computedMode() {
      return this.orderForm.batchMode ? "batch" : "unit";
    },
    computedTotalOrders() {
      if (!this.orderForm.batchMode) {
        return this.orderForm.productUnits;
      }

      if (this.orderForm.batchMode) {
        return this.orderForm.batchNumber;
      }

      return 0;
    },

    computedUnits() {
      if (!this.orderForm.batchMode) {
        return this.orderForm.productUnits;
      }

      if (this.orderForm.batchMode) {
        return this.orderForm.productUnits * this.orderForm.batchNumber;
      }

      return 0;
    },

    computedCollateral() {
      if (!this.orderForm.batchMode) {
        let total =
          this.productList[this.createOrderIndex].collateral *
          this.orderForm.productUnits;
        return `${total} ADA`;
      }

      if (this.orderForm.batchMode) {
        let units = this.orderForm.productUnits * this.orderForm.batchNumber;
        let total = this.productList[this.createOrderIndex].collateral * units;
        return `${total} ADA`;
      }

      return 0;
    },

    computedPrice() {
      if (!this.orderForm.batchMode) {
        let total = this.productList[this.createOrderIndex].price;
        return `${total} ADA`;
      }

      if (this.orderForm.batchMode) {
        let originalPrice = this.productList[this.createOrderIndex].price;

        let discountPercentage = this.orderForm.productDiscount;

        let discountAmount = (originalPrice * discountPercentage) / 100;

        let discountedPrice = originalPrice - discountAmount;

        return `${originalPrice} ADA - ${discountPercentage} % = ${discountedPrice} ADA`;
      }

      return 0;
    },
  },
  methods: {
    consoleitor(e) {
      console.log(e)
    },
    async deployTransaction(orderId) {
      const { getWallet } = walletClient();

      lucidClient.selectWallet(await getWallet());

      const addr = await lucidClient.wallet.address();
      const address = await getAddressDetails(addr);

      await this.deploy({
        order_id: orderId,
        address: address.address.bech32,
        pubkeyhash: address.paymentCredential.hash,
      }).then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => this.deployTx({ tx_hash: hash, order_id: orderId }))
        .then(() =>
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Transaction sent to the network.",
            life: 5000,
          })
        )
        .catch((err) => {
          if (err.response?.errors) {
            return this.$toast.add({
              severity: "error",
              summary: "Error Message",
              detail: err.response.errors[0].message,
              life: 5000,
            })
          }

          this.$toast.add({
            severity: "error",
            summary: "Error Message",
            detail: "Transaction Failed",
            life: 5000,
          })
        });
    },

    async cancelTransaction(orderId) {
      const { getWallet } = walletClient();

      lucidClient.selectWallet(await getWallet());

      const addr = await lucidClient.wallet.address();
      const address = await getAddressDetails(addr);

      await this.cancel({
        order_id: orderId,
        address: address.address.bech32,
      }).then((res) => balanceTx(res.response.payload.transaction))
        .then((hash) => this.cancelTx({ tx_hash: hash, order_id: orderId }))
        .then(() =>
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Transaction sent to the network.",
            life: 5000,
          })
        )
        .catch((err) => {
          if (err.response?.errors) {
            return this.$toast.add({
              severity: "error",
              summary: "Error Message",
              detail: err.response.errors[0].message,
              life: 5000,
            })
          }

          this.$toast.add({
            severity: "error",
            summary: "Error Message",
            detail: "Transaction Failed",
            life: 5000,
          })
        });
    },
    getStateBarValue(e) {
      return e * 20;
    },
    openSessionPage(orderId) {
      const internalUrl = "http://localhost:8080/session/" + orderId;
      window.open(internalUrl, "_blank");
    },
    openOrderListDialog(productIndex) {
      if (this.productList[productIndex].order_count < 1) {
        return;
      }

      this.orderListDialogIndex = productIndex;
      this.orderListDialogVisible = true;
    },
    onBeforeUpload() {
      if (this.product.image_set.length < this.maxProductImages) {
        this.disableUpload = false;
      }
    },
    openMessageDialog(type, message) {
      this.messageModalVisible = true;

      if (type === "response") {
        this.messageModal = message.response.message;
      }

      if (type === "error") {
        this.errorModal = message.response.errors;
      }
    },
    formatDate(e) {
      return e.split(".")[0];
    },
    closeAllModals() {
      this.messageModalVisible = false;
    },
    onAdvancedUpload(e) {
      const response = JSON.parse(e.xhr.response);

      if (response.success === true) {
        this.product.image_set.push(...response.payload);

        if (this.product.image_set.length >= this.maxProductImages) {
          this.disableUpload = true;
        }

        this.$toast.add({
          severity: "info",
          summary: "Success",
          detail: this.product.image_set.length + " File Uploaded",
          life: 3000,
        });
      }
    },
    formatCurrency(value) {
      if (value) {
        return value + " ADA";
      }
    },

    formatLovelace(value) {
      if (value) {
        const newValue = value / 1000000;
        return newValue + " ADA";
      }
    },
    openProductDialog() {
      this.resetForm();
      this.createOrderDialog = true;
    },
    closeProductDialog() {
      this.createOrderDialog = false;
    },
    async createOrders() {
      this.orderFormErrors.productUnits = this.unitNumber(
        this.orderForm.productUnits
      );

      this.orderFormErrors.batchNumber = this.batchNumber(
        this.orderForm.batchMode,
        this.orderForm.batchNumber
      );

      this.orderFormErrors.productDiscount = this.productDiscount(
        this.orderForm.batchMode,
        this.orderForm.productDiscount
      );

      if (Object.values(this.orderFormErrors).includes(true)) {
        return;
      }

      const params = {
        batch_mode: this.orderForm.batchMode,
        product_units: this.orderForm.productUnits,
        batch_number: this.orderForm.batchNumber,
        product_discount: this.orderForm.productDiscount,
        product_id: this.productList[this.createOrderIndex].id,
      };

      console.log(params);

      this.createOrderLoader = true;

      await this.createOrder(params)
        .then((res) => {
          if (res.response.success === true) {
            this.createOrderDialog = false;

            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Check the orders folder.",
              life: 5000,
            });
          }

          if (res.response.success === false) {
            this.$toast.add({
              severity: "error",
              summary: "Error Message",
              detail: "Try again later.",
              life: 3000,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$toast.add({
            severity: "error",
            summary: "Error Message",
            detail: "Please try again later.",
            life: 3000,
          });
        });

      this.createOrderLoader = false
    },
    unitNumber(value) {
      if (!value) {
        return true;
      }

      if (typeof value !== "number") {
        return true;
      }

      if (value < 1) {
        return true;
      }

      return false;
    },
    batchNumber(batchMode, value) {
      if (batchMode === true) {
        if (!value) {
          return true;
        }

        if (typeof value !== "number") {
          return true;
        }

        if (value < 1) {
          return true;
        }
      }

      return false;
    },
    productDiscount(batchMode, value) {
      if (batchMode === true && value === undefined) {
        return true;
      }

      if (batchMode === true && value < 1) {
        return true;
      }

      if (batchMode === true && typeof value !== "number") {
        return true;
      }

      return false;
    },

    openCreateSlotDialog(productIndex) {
      this.createOrderIndex = productIndex;
      this.createOrderDialog = true;
    },

    confirmDeleteProduct(productData) {
      this.product = productData;
      this.deleteProductDialog = true;
    },

    deleteProduct() {
      this.productList = this.productList.filter(
        (val) => val.id !== this.product.id
      );

      this.deleteProductDialog = false;

      this.resetForm();

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    },
    checkMainImage(e) {
      return this.product.image_main === e;
    },
    setMainImage(e) {
      this.product.image_main = e;
    },
    getImages(product) {
      const data = product.image_set;

      return data.map((imageId) => ({
        main: product.image_main,
        id: imageId,
        image: product.image_base + product.image_path + imageId,
      }));
    },
    exportCSV() {
      this.$refs.productListTable.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteProductsDialog = true;
    },
    deleteSelectedProducts() {
      this.productList = this.productList.filter(
        (value) => !this.selectedProducts.includes(value)
      );
      this.deleteProductsDialog = false;
      this.selectedProducts = null;
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
    },
    setupFilters() {
      this.filters = {
        global: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
      };
    }
  },
};
</script>

<style lang="css" scoped>
.switch-button {
  background: var(--blue-c);
  font-size: var(--text-size-b);
  color: var(--text-w);
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  width: 100px;
  justify-content: center;
}

.switch-button.actived {
  background: var(--green-a);
  border: 1px solid var(--green-a);
  pointer-events: none;
}

.switch-button.canceled {
  background: var(--red-a);
  border: 1px solid var(--red-a);
  pointer-events: none;
}


::v-deep(.p-progressbar) {
  height: 0.4rem;
}

.column-block {
  display: block;
}

.column-block div:nth-child(1) {
  display: flex;
  justify-content: space-between;
  line-height: 3rem;
  font-weight: 400;
  font-size: var(--text-size-a);
}

.column-block-row span {
  font-size: var(--text-size-a);
}

.disabled {
  pointer-events: none;
}

.network-analyzer {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.network-analyzer span {
  margin-left: 1rem;
  font-size: var(--text-size-a);
  font-weight: 400;
}

.dialog-title {
  font-size: var(--text-size-f);
  font-weight: bold;
}

.loader {
  width: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--blue-c);
  box-shadow: 0 0 0 0 var(--blue-s);
  animation: l1 1s infinite;
}

@keyframes l1 {
  100% {
    box-shadow: 0 0 0 20px #0000;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.switch-group {
  display: flex;
  align-items: center;
}

.switch-group span {
  margin-left: 0.5rem;
  color: var(--text-b);
  cursor: pointer;
}

.table-buttons {
  display: flex;
  align-items: center;
}

.table-button {
  margin-right: 1rem;
}

.createslot-b-form {
  margin-bottom: 0rem;
}

.createslot {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

}

.createslot-wrap {
  width: 100%;
}

.total {
  color: var(--text-a);
  margin-top: 0rem;
  margin-bottom: 0rem;
  border-radius: 6px;
  padding: 1rem;
  font-weight: 400;
  background: var(--base-b);
  border: 1px solid var(--border-b);
}

.total p {
  line-height: 1rem;
}

.total p:nth-child(1) {
  font-size: var(--text-size-d);
  font-weight: 500;
}

.product-image-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.product-image-main div {
  padding: 0.25rem;
  border: 1px solid transparent;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}

.product-image-main div.mainImage {
  border: 1px solid var(--blue-a);
}

.product-image-wrap {
  display: block;
}

.product-image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image-preview img {
  border-radius: 18px;
  width: 300px;
  height: 300px;
}

.confirmation-content {
  display: flex;
  align-items: center;
}

.confirmation-content span {
  margin-left: 1rem;
}

.table-tag {
  padding: 0.5rem 0;
}

.table-image {
  width: 80px;
  height: 80px;
}

.product-upload small {
  padding: 5px;
  line-height: 50px;
}

.p-counter {
  font-weight: 500;
  text-align: right;
  padding: 1px 5px;
}

.invalid {
  border: 1px solid red;
  color: red;
  border-radius: 6px;
}

img {
  border-radius: 8px;
}

.orders {
  display: flex;
  justify-content: center;
  padding-left: 56px;
  width: 100%;
  background-image: url("@/assets/gradient.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.orders-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2%;
}

.orders-card {
  width: inherit;
  border-radius: 12px;
  box-shadow: var(--shadow-a);
  padding: 0 2rem;
  background: var(--base-a);
  overflow-y: hidden;
}

.product-upload {
  margin-top: 1rem;
}

.field {
  margin-top: 1rem;
}

.field-radiobutton {
  display: flex;
  align-items: center;
}

.field-radiobutton label {
  margin-left: 0.25rem;
}

.field-label {
  line-height: 40px;
  color: var(--text-a);
  font-weight: 400;
  display: flex;
  align-items: center;
  font-size: var(--text-size-b);
}

.field-label i {
  font-size: var(--text-size-a);
  margin-left: 0.5rem;
  margin-top: 3px;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-a);
  padding: 1rem 0;
}

.orders-header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 0;
  text-align: left;
}

.orders-header-left span:nth-child(1) {
  font-weight: 700;
  font-size: var(--text-size-f);
}

.orders-header-left span:nth-child(2) {
  font-weight: 400;
  line-height: 2rem;
  font-size: var(--text-size-c);
}

.orders-header-right-search {
  display: flex;
  align-items: center;
  position: relative;
}

.orders-header-right-search i {
  right: 0;
  position: absolute;
  margin-right: 1rem;
}

::v-deep(.p-dropdown) {
  width: initial;
}

@media only screen and (max-width: 767px) {
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .orders-card {
    padding: 0 1rem;
  }

  .orders-wrap {
    padding: 1rem;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .orders-card {
    padding: 0 1rem;
  }

  .orders-wrap {
    padding: 1rem;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .orders-card {
    padding: 0 1rem;
  }

  .orders-wrap {
    padding: 1rem;
  }
}

@media only screen and (min-width: 1200px) {}
</style>
