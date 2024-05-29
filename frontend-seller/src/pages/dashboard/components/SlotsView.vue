<template>
  <div class="slots">
    <!--DIALOG SECTION-->
    <Dialog
      v-model:visible="messageModalVisible"
      modal
      header="Message"
      :draggable="false"
      :style="{ width: '35rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <p>{{ messageModal }}</p>

      <p v-for="e in errorModal" :key="e">{{ e }}</p>

      <template #footer>
        <div class="modal-footer">
          <Button type="button" label="Ok" @click="closeAllModals" />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '425px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteProductDialog = false"
        />
        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '425px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete the selected slots?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          text
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="createSlotDialogVisible"
      :style="{ width: '425px' }"
      header="Create slots"
      :modal="true"
      :draggable="false"
    >
      <div class="createslot">
        <LoadingBars v-if="createSlotLoader" />

        <div class="createslot-wrap" v-if="!createSlotLoader">
          <div class="field">
            <label for="batch_mode" class="field-label">
              <span>Batch Mode</span>
              <i
                class="pi pi-info-circle"
                v-tooltip.top="
                  'Allows to add discounts for the purchase of multiple units.'
                "
              />
            </label>
            <InputSwitch id="batch_mode" v-model="createSlotForm.batch_mode" />
          </div>

          <div class="field">
            <label for="units" class="field-label">
              <span>Units</span>
              <i
                class="pi pi-info-circle"
                v-tooltip.top="'Number of slots to create.'"
              />
            </label>
            <InputNumber
              id="units"
              v-model="createSlotForm.product_units"
              showButtons
              integeronly
              locale="en-US"
              :min="0"
              :class="{ invalid: createSlotFormErrors.product_units }"
            />
            <small class="p-error" v-if="createSlotFormErrors.product_units">
              The unit is required and greater than 0.
            </small>
          </div>

          <div class="field">
            <label for="batch" class="field-label">
              <span>Batch</span>
              <i
                class="pi pi-info-circle"
                v-tooltip.top="
                  'Each batch contains the chosen number of units.'
                "
              />
            </label>
            <InputNumber
              id="batch"
              v-model="createSlotForm.batch_number"
              showButtons
              :disabled="!createSlotForm.batch_mode"
              integeronly
              locale="en-US"
              :min="0"
              :class="{ invalid: createSlotFormErrors.batch_number }"
            />
            <small class="p-error" v-if="createSlotFormErrors.batch_number">
              The batch must be greater than 0.
            </small>
          </div>

          <div class="field">
            <label for="unitDiscount" class="field-label">
              <span>Discount</span>
              <i
                class="pi pi-info-circle"
                v-tooltip.top="'Discount per unit in batch mode.'"
              />
            </label>
            <InputNumber
              id="unitDiscount"
              v-model="createSlotForm.product_discount"
              showButtons
              :disabled="!createSlotForm.batch_mode"
              integeronly
              suffix=" % OFF"
              locale="en-US"
              :min="0"
              :max="100"
              :class="{ invalid: createSlotFormErrors.product_discount }"
            />
            <small class="p-error" v-if="createSlotFormErrors.product_discount"
              >The discount is required.</small
            >
          </div>

          <div class="createslot-b-total">
            <p>Total slots {{ computedSlots }}</p>
            <p>Stock: {{ productList[createSlotIndex].stock }}</p>
            <p>Total Units: {{ computedUnits }}</p>
            <p>Total Collateral: {{ computedCollateral }}</p>
            <p>Unit Price: {{ computedPrice }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="closeProductDialog" />
        <Button label="Create" text @click="createSlots" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="slotListDialogVisible"
      :style="{ width: '90vw' }"
      maximizable
      modal
      :draggable="false"
      :contentStyle="{ height: '80vw' }"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">Product slots</span>
          <div class="network-analyzer">
            <div class="loader" />
            <span>Scanning network 5s</span>
          </div>
        </div>
      </template>

      <DataTable
        :value="productList[slotListDialogIndex].slots"
        stripedRows
        scrollable
        scrollHeight="flex"
        tableStyle="min-width: 50rem;"
      >
        <Column
          field="created_at"
          header="Date"
          sortable
          style="max-width: 8rem"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column
          field="mode"
          header="Mode"
          sortable
          style="max-width: 5rem"
        ></Column>

        <Column
          field="status"
          header="Status"
          style="max-width: 5rem"
          sortable
        ></Column>

        <Column
          field="contract_units"
          header="Units"
          sortable
          style="max-width: 5rem"
        ></Column>

        <Column field="contract_price" header="Price" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.contract_price) }}
          </template>
        </Column>

        <Column
          field="contract_collateral"
          header="Collateral"
          style="max-width: 5rem"
          sortable
        >
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.contract_collateral) }}
          </template>
        </Column>

        <Column
          field="actived"
          header="Actived"
          style="max-width: 5rem"
          sortable
        >
          <template #body="slotProps">
            <div class="switch-group">
              <InputSwitch
                v-tooltip.top="
                  'Generate the transaction to send to the network.'
                "
                :disabled="slotProps.data.actived === 1 || activeSlotLoader"
                :modelValue="slotProps.data.actived === 1"
                @change="
                  (e) => activeSlot(e.target.ariaChecked, slotProps.data.id)
                "
              />

              <span
                v-if="slotProps.data.contract_utx_0 || activeSlotLoader"
                :class="{ disabled: activeSlotLoader }"
                v-tooltip.top="'⚠ Warning. Click to resend the transaction.'"
                @click="activeSlot('true', slotProps.data.contract_utx_0)"
              >
                <i v-if="activeSlotLoader" class="pi pi-spin pi-spinner" />

                <i v-if="!activeSlotLoader" class="pi pi-replay" />
              </span>
            </div>
          </template>
        </Column>

        <Column
          field="contract_state"
          header="State"
          style="min-width: 10rem"
          sortable
        >
          <template #body="slotProps">
            <div class="column-block">
              <div class="column-block-row">
                <span> {{ slotProps.data.contract_stage }}</span>
                <span> 0 Confirmations</span>
              </div>
              <ProgressBar
                :value="getStateBarValue(slotProps.data.contract_state)"
                :showValue="false"
              />
            </div>
          </template>
        </Column>

        <Column :exportable="false">
          <template #body="">
            <div class="table-buttons">
              <Button
                class="table-button"
                type="button"
                icon="pi pi-ellipsis-h"
                outlined
                rounded
                aria-haspopup="true"
                aria-controls="slot_menu"
                @click="openSlotMenu"
              />
              <Menu
                ref="slotMenuRef"
                id="slot_menu"
                :model="slotMenu"
                :popup="true"
              />

              <Button
                class="table-button"
                icon="pi pi-eye"
                outlined
                rounded
                @click="openSlotListDialog(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
      <template #footer>
        <Button label="Done" @click="slotListDialogVisible = false" />
      </template>
    </Dialog>
    <Toast />
    <!--DIALOG SECTION-->

    <!---CONTENT-->
    <div class="slots-wrap">
      <div class="slots-card">
        <DataTable
          ref="productListTable"
          resizableColumns
          :value="productList"
          v-model:expandedRows="selectedProducts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="{first} to {last} of {totalRecords} items"
        >
          <template #expansion> x </template>
          <template #header>
            <div class="slots-header">
              <div class="slots-header-left">
                <span>Product slots</span>
                <span @click="runTX">Create or modify slots and more...</span>
              </div>

              <div class="slots-header-right">
                <div class="slots-header-right-search">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>

            <Toolbar>
              <template #end>
                <Button
                  label="Export"
                  icon="pi pi-upload"
                  @click="exportCSV($event)"
                />
              </template>
            </Toolbar>
          </template>

          <Column expander style="width: 3rem" :exportable="false" />

          <Column header="Image" style="max-width: 8rem">
            <template #body="slotProps">
              <Image
                :src="
                  slotProps.data.image_base +
                  slotProps.data.image_path +
                  slotProps.data.image_main
                "
                :alt="slotProps.data.image_main"
                width="70"
                height="70"
                imageStyle="border-radius: 4px; object-fit: contain;"
                preview
              />
            </template>
          </Column>

          <Column field="id" header="Code" sortable />

          <Column
            field="name"
            header="Name"
            sortable
            style="max-width: 16rem; white-space: break-spaces"
          >
            <template #body="slotProps">
              {{ slotProps.data.name.slice(0, 30) }}...
            </template>
          </Column>

          <Column
            field="category"
            header="Category"
            sortable
            style="min-width: 8rem; text-transform: capitalize"
          >
            <template #body="slotProps">
              {{ slotProps.data.category }}
            </template>
          </Column>

          <Column field="price" header="Price" sortable style="min-width: 8rem">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>

          <Column
            field="collateral"
            header="Collateral"
            sortable
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.collateral) }}
            </template>
          </Column>

          <Column
            field="slots_count"
            header="Slots"
            sortable
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              {{ slotProps.data.slots_count }}
            </template>
          </Column>

          <Column field="stock" header="Stock" sortable style="min-width: 8rem">
            <template #body="slotProps">
              {{ slotProps.data.stock }}
            </template>
          </Column>

          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <div class="table-buttons">
                <Button
                  class="table-button"
                  type="button"
                  icon="pi pi-ellipsis-h"
                  outlined
                  rounded
                  aria-haspopup="true"
                  aria-controls="product_menu"
                  @click="openProductMenu"
                />
                <Menu
                  ref="productMenuRef"
                  id="product_menu"
                  :model="productMenu"
                  :popup="true"
                />
                <Button
                  class="table-button"
                  icon="pi pi-plus"
                  outlined
                  rounded
                  v-tooltip.top="'Enable a slot'"
                  @click="openCreateSlotDialog(slotProps.index)"
                />
                <Button
                  class="table-button"
                  icon="pi pi-receipt"
                  outlined
                  rounded
                  :disabled="slotProps.data.slots_count < 1"
                  @click="openSlotListDialog(slotProps.index)"
                >
                  <i
                    v-if="slotProps.data.slots_count > 0"
                    v-badge.secondary
                    class="pi pi-eye"
                  />
                  <i
                    v-if="slotProps.data.slots_count < 1"
                    class="pi pi-eye"
                  />
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
import { balanceTx } from "@/api/wallet-api";
import { getAddressDetails } from "lucid-cardano";
import { FilterMatchMode } from "primevue/api";
import { HOST } from "@/api/index";
import { ref } from "vue";

export default {
  components: {
    LoadingBars,
  },
  setup() {
    const { getSlotsData, createProduct, createSlot, getLucid, startEndpoint } =
      dashboardAPI();

    const productList = ref(getSlotsData.value);

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
      slots: [],
      slots_count: null,
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
        slots: [],
        slots_count: null,
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
    const productMenuRef = ref();

    const productMenu = ref([
      {
        label: "Options",
        items: [
          {
            label: "Refresh",
            icon: "",
          },
          {
            label: "Export",
            icon: "",
          },
        ],
      },
    ]);

    const slotMenuRef = ref();

    const slotMenu = ref([
      {
        label: "Options",
        items: [
          {
            label: "Transactions",
            icon: "",
          },
          {
            label: "Delete",
            icon: "",
          },
          {
            label: "Appeal",
            icon: "",
          },
          {
            label: "Sign",
            icon: "",
          },
        ],
      },
    ]);
    const openProductMenu = (event) => {
      productMenuRef.value.toggle(event);
    };
    const openSlotMenu = (event) => {
      slotMenuRef.value.toggle(event);
    };

    const createSlotForm = ref({
      batch_mode: false,
      product_units: 0,
      batch_number: 0,
      product_discount: 0,
    });

    const createSlotFormErrors = ref({
      batch_mode: false,
      product_units: false,
      batch_number: false,
      product_discount: false,
    });

    return {
      createSlotFormErrors,
      createSlotForm,
      createSlot,
      productList,
      startEndpoint,
      getLucid,
      openProductMenu,
      product,
      productMenu,
      productMenuRef,
      disableUpload,
      slotMenuRef,
      openSlotMenu,
      slotMenu,
      resetForm,
      messageModalVisible,
      messageModal,
      errorModal,
      getSlotsData,
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
      createSlotLoader: false,
      activeSlotLoader: false,
      createSlotDialogVisible: false,
      createSlotIndex: null,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      descriptionLengthLimit: 1000,
      nameLengthLimit: 200,
      minProductImages: 5,
      slotListDialogVisible: false,
      slotListDialogIndex: null,
      customers: [
        {
          id: 1000,
          name: "James Butt",
          country: {
            name: "Algeria",
            code: "dz",
          },
          company: "Benton, John B Jr",
          date: "2015-09-13",
          status: "unqualified",
          verified: true,
          activity: 17,
          representative: {
            name: "Ioni Bowcher",
            image: "ionibowcher.png",
          },
          balance: 70663,
        },
        {
          id: 1001,
          name: "Josephine Darakjy",
          country: {
            name: "Egypt",
            code: "eg",
          },
          company: "Chanay, Jeffrey A Esq",
          date: "2019-02-09",
          status: "proposal",
          verified: true,
          activity: 0,
          representative: {
            name: "Amy Elsner",
            image: "amyelsner.png",
          },
          balance: 82429,
        },
        {
          id: 1002,
          name: "Art Venere",
          country: {
            name: "Panama",
            code: "pa",
          },
          company: "Chemel, James L Cpa",
          date: "2017-05-13",
          status: "qualified",
          verified: false,
          activity: 63,
          representative: {
            name: "Asiya Javayant",
            image: "asiyajavayant.png",
          },
          balance: 28334,
        },
        {
          id: 1003,
          name: "Lenna Paprocki",
          country: {
            name: "Slovenia",
            code: "si",
          },
          company: "Feltz Printing Service",
          date: "2020-09-15",
          status: "new",
          verified: false,
          activity: 37,
          representative: {
            name: "Xuxue Feng",
            image: "xuxuefeng.png",
          },
          balance: 88521,
        },
        {
          id: 1004,
          name: "Donette Foller",
          country: {
            name: "South Africa",
            code: "za",
          },
          company: "Printing Dimensions",
          date: "2016-05-20",
          status: "proposal",
          verified: true,
          activity: 33,
          representative: {
            name: "Asiya Javayant",
            image: "asiyajavayant.png",
          },
          balance: 93905,
        },
        {
          id: 1005,
          name: "Simona Morasca",
          country: {
            name: "Egypt",
            code: "eg",
          },
          company: "Chapman, Ross E Esq",
          date: "2018-02-16",
          status: "qualified",
          verified: false,
          activity: 68,
          representative: {
            name: "Ivan Magalhaes",
            image: "ivanmagalhaes.png",
          },
          balance: 50041,
        },
      ],
      maxProductImages: 5,
      selectedProducts: null,
      filters: {},
      categories: [
        { name: "Home", code: "home" },
        { name: "Electronics", code: "electronics" },
        { name: "Fashion", code: "fashion" },
        { name: "Beauty", code: "beauty" },
        { name: "Toys", code: "toys" },
        { name: "Tools", code: "tools" },
        { name: "Sports", code: "sports" },
        { name: "Health", code: "health" },
        { name: "Books", code: "books" },
        { name: "Automotive", code: "automotive" },
        { name: "Appliances", code: "appliances" },
        { name: "Furniture", code: "furniture" },
      ],
      statuses: [
        { label: "STOCK", value: "stock" },
        { label: "LOW", value: "low" },
        { label: "OUT", value: "out" },
      ],
    };
  },
  created() {
    this.setupFilters();
  },
  computed: {
    computedMode() {
      return this.createSlotForm.batch_mode ? "batch" : "unit";
    },
    computedSlots() {
      if (!this.createSlotForm.batch_mode) {
        return this.createSlotForm.product_units;
      }

      if (this.createSlotForm.batch_mode) {
        return this.createSlotForm.batch_number;
      }

      return 0;
    },

    computedUnits() {
      if (!this.createSlotForm.batch_mode) {
        return this.createSlotForm.product_units;
      }

      if (this.createSlotForm.batch_mode) {
        return (
          this.createSlotForm.product_units * this.createSlotForm.batch_number
        );
      }

      return 0;
    },

    computedCollateral() {
      if (!this.createSlotForm.batch_mode) {
        let total =
          this.productList[this.createSlotIndex].collateral *
          this.createSlotForm.product_units;
        return `${total} ADA`;
      }

      if (this.createSlotForm.batch_mode) {
        let units =
          this.createSlotForm.product_units * this.createSlotForm.batch_number;
        let total = this.productList[this.createSlotIndex].collateral * units;
        return `${total} ADA`;
      }

      return 0;
    },

    computedPrice() {
      if (!this.createSlotForm.batch_mode) {
        let total = this.productList[this.createSlotIndex].price;
        return `${total} ADA`;
      }

      if (this.createSlotForm.batch_mode) {
        let originalPrice = this.productList[this.createSlotIndex].price;

        let discountPercentage = this.createSlotForm.product_discount;

        let discountAmount = (originalPrice * discountPercentage) / 100;

        let discountedPrice = originalPrice - discountAmount;

        return `${originalPrice} ADA - ${discountPercentage} % = ${discountedPrice} ADA`;
      }

      return 0;
    },
  },
  methods: {
    async runTX() {
      const tx =
        "84a400800181a300581d701fb4024cc499be27f67a2901b4d116dde050c0e5f6564222ed19adff011a08f0d180028201d8185845d8799f004777616974696e67d87980d87980d87980581c4068ce72a0f73e850f19899a10b82ec534a55a6d860e5c5267dca2b9d87a801b00000001a13b86001a08f0d180ff02000e81581c4068ce72a0f73e850f19899a10b82ec534a55a6d860e5c5267dca2b9a0f5f6";
      const res = await balanceTx(tx);

      console.log(res);
    },
    async activeSlot(actived, data) {
      this.activeSlotLoader = true;

      if (actived === "false") {
        const addr = await this.getLucid.wallet.address();
        const address = await getAddressDetails(addr);

        const params = {
          slot_id: data,
          seller_pubkeyhash: address.paymentCredential.hash,
        };

        await this.startEndpoint(params)
          .then((res) => balanceTx(res.response.payload.transaction))
          .then((tx) => {
            console.log(tx);

            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Transaction sent to the network.",
              life: 5000,
            });
          })
          .catch((err) => {
            console.error(err);

            this.$toast.add({
              severity: "error",
              summary: "Error Message",
              detail: "Try again later.",
              life: 5000,
            });
          });
      }

      if (actived === "true") {
        await balanceTx(data)
          .then((tx) => {
            console.log(tx);

            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Transaction sent to the network.",
              life: 5000,
            });
          })
          .catch((err) => {
            console.error(err);

            this.$toast.add({
              severity: "error",
              summary: "Error Message",
              detail: "Transaction canceled.",
              life: 5000,
            });
          });
      }

      this.activeSlotLoader = false;
    },
    getStateBarValue(e) {
      return e * 20;
    },
    openSlotListDialog(productIndex) {
      if (this.productList[productIndex].slots_count < 1) {
        return;
      }

      this.slotListDialogIndex = productIndex;
      this.slotListDialogVisible = true;
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
    openProductDialog() {
      this.resetForm();
      this.createSlotDialogVisible = true;
    },
    closeProductDialog() {
      this.createSlotDialogVisible = false;
    },
    async createSlots() {
      this.createSlotFormErrors.product_units = this.checkUnitNumber(
        this.createSlotForm.product_units
      );

      this.createSlotFormErrors.batch_number = this.checkBatchNumber(
        this.createSlotForm.batch_mode,
        this.createSlotForm.batch_number
      );

      this.createSlotFormErrors.product_discount = this.checkProductDiscount(
        this.createSlotForm.product_discount
      );

      if (Object.values(this.createSlotFormErrors).includes(true)) {
        return;
      }

      const params = {
        wallet_id: "c08b3754a3fc2c4cb063e12295e903d14edc899d",
        product_id: this.productList[this.createSlotIndex].id,
        ...this.createSlotForm,
      };

      console.log(params);

      this.createSlotLoader = true;

      await this.createSlot(params)
        .then((res) => {
          if (res.response.success === true) {
            this.createSlotDialogVisible = false;

            this.openSlotListDialog(this.createSlotIndex);

            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Check the slot folder.",
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
        })
        .finally(() => (this.createSlotLoader = false));
    },
    checkUnitNumber(value) {
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
    checkBatchNumber(batchMode, value) {
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
    checkProductDiscount(value) {
      if (value < 0) {
        return true;
      }

      if (typeof value !== "number") {
        return true;
      }

      return false;
    },

    openCreateSlotDialog(productIndex) {
      this.createSlotIndex = productIndex;
      this.createSlotDialogVisible = true;
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
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    getStatusLabel(status) {
      switch (status) {
        case "stock":
          return "success";

        case "low":
          return "warning";

        case "out":
          return "danger";

        default:
          return null;
      }
    },
  },
};
</script>

<style lang="css" scoped>
::v-deep(.p-progressbar) {
  height: 4px;
}

.column-block-row {
  display: flex;
  justify-content: space-between;
}

.column-block-row span:nth-child(2) {
  color: var(--text-b);
  font-size: var(--text-size-a);
  font-weight: 500;
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
  font-weight: 500;
  color: var(--blue-c);
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

.createslot-b-form {
  margin-bottom: 0rem;
}

.column-block {
  display: block;
}

.column-block div:nth-child(1) {
  line-height: 3rem;
  font-weight: 400;
  font-size: var(--text-size-b);
}
.createslot {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 685px;
}

.createslot-wrap {
  width: 100%;
}

.createslot-b-total {
  color: var(--text-w);
  margin-top: 0rem;
  margin-bottom: 0rem;
  background: var(--blue-c);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow-b);
}

.createslot-b-total p {
  line-height: 1rem;
}

.createslot-b-total p:nth-child(1) {
  font-size: var(--text-size-f);
  font-weight: 600;
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
.table-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
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
.slots {
  display: flex;
  justify-content: center;
  padding-left: 56px;
  width: 100%;
  background-size: 156.45vw 99.03vw, 156.45vw 99.03vw, 156.45vw 99.03vw,
    226.86vw 145.44vw, 226.86vw 145.44vw, 226.86vw 145.44vw, 171.96vw 110.31vw,
    171.96vw 110.31vw, 171.96vw 110.31vw, 130.29vw 83.58vw, 130.29vw 83.58vw,
    130.29vw 83.58vw, 198vw 126.9vw, 198vw 126.9vw, 198vw 126.9vw, 300vw 192vw,
    300vw 192vw, 300vw 192vw;

  background-position: 37.97vw calc(((300vw - 100vh) / 2 - 85.77vw) * -1),
    37.97vw calc(((300vw - 100vh) / 2 - 85.77vw) * -1),
    37.97vw calc(((300vw - 100vh) / 2 - 85.77vw) * -1),
    -100vw calc(((300vw - 100vh) / 2 - 154.56vw) * -1),
    -100vw calc(((300vw - 100vh) / 2 - 154.56vw) * -1),
    -100vw calc(((300vw - 100vh) / 2 - 154.56vw) * -1),
    13.34vw calc(((300vw - 100vh) / 2 - 53.88vw) * -1),
    13.34vw calc(((300vw - 100vh) / 2 - 53.88vw) * -1),
    13.34vw calc(((300vw - 100vh) / 2 - 53.88vw) * -1),
    10.64vw calc(((300vw - 100vh) / 2 - 17.19vw) * -1),
    10.64vw calc(((300vw - 100vh) / 2 - 17.19vw) * -1),
    10.64vw calc(((300vw - 100vh) / 2 - 17.19vw) * -1),
    -49vw calc(((300vw - 100vh) / 2 - 41.1vw) * -1),
    -49vw calc(((300vw - 100vh) / 2 - 41.1vw) * -1),
    -49vw calc(((300vw - 100vh) / 2 - 41.1vw) * -1),
    -100vw calc(((300vw - 100vh) / 2 - 78vw) * -1),
    -100vw calc(((300vw - 100vh) / 2 - 78vw) * -1),
    -100vw calc(((300vw - 100vh) / 2 - 78vw) * -1);

  background-image: radial-gradient(
      50% 50% at 50% 50%,
      rgba(160, 51, 255, 0.024) 0,
      rgba(160, 51, 255, 0) 50%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(160, 51, 255, 0.04) 0,
      rgba(160, 51, 255, 0) 75%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(160, 51, 255, 0.064) 0,
      rgba(160, 51, 255, 0) 100%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(24, 119, 242, 0.024) 0,
      rgba(24, 119, 242, 0) 50%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(24, 119, 242, 0.04) 0,
      rgba(24, 119, 242, 0) 75%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(24, 119, 242, 0.064) 0,
      rgba(24, 119, 242, 0) 100%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(255, 108, 92, 0.024) 0,
      rgba(255, 108, 92, 0) 50%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(255, 108, 92, 0.04) 0,
      rgba(255, 108, 92, 0) 75%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(255, 108, 92, 0.064) 0,
      rgba(255, 108, 92, 0) 100%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(245, 206, 51, 0.024) 0,
      rgba(245, 206, 51, 0) 50%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(245, 206, 51, 0.04) 0,
      rgba(245, 206, 51, 0) 75%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(245, 206, 51, 0.064) 0,
      rgba(245, 206, 51, 0) 100%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(37, 211, 102, 0.024) 0,
      rgba(37, 211, 102, 0) 50%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(37, 211, 102, 0.04) 0,
      rgba(37, 211, 102, 0) 75%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(37, 211, 102, 0.064) 0,
      rgba(37, 211, 102, 0) 100%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(24, 119, 242, 0.024) 0,
      rgba(24, 119, 242, 0) 50%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(24, 119, 242, 0.04) 0,
      rgba(24, 119, 242, 0) 75%
    ),
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(24, 119, 242, 0.064) 0,
      rgba(24, 119, 242, 0) 100%
    );
}

.slots-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem 2rem;
}

.slots-card {
  width: inherit;
  border-radius: 18px;
  box-shadow: var(--shadow-a);
  padding: 0 2rem;
  background: var(--base-a);
  overflow-y: hide;
}

.product-upload {
  margin-top: 1rem;
}
.table-button {
  margin-left: 1rem;
}

.field {
  margin-bottom: 1rem;
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
  font-weight: 600;
  display: flex;
  align-items: center;
}

.field-label i {
  font-size: var(--text-size-a);
  margin-left: 0.5rem;
  margin-top: 3px;
}

.slots-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-a);
  padding: 0.5rem 0;
}

.slots-header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 0;
  text-align: left;
}

.slots-header-left span:nth-child(1) {
  font-weight: 700;
  font-size: var(--text-size-f);
}

.slots-header-left span:nth-child(2) {
  font-weight: 400;
  line-height: 2rem;
  font-size: var(--text-size-c);
}

.slots-header-right-search {
  display: flex;
  align-items: center;
  position: relative;
}

.slots-header-right-search i {
  right: 0;
  position: absolute;
  margin-right: 1rem;
}

::v-deep(.p-dropdown) {
  width: initial;
}

@media only screen and (max-width: 767px) {
  .slots-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .slots-card {
    padding: 0 1rem;
  }

  .slots-wrap {
    padding: 1rem;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .slots-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .slots-card {
    padding: 0 1rem;
  }

  .slots-wrap {
    padding: 1rem;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .slots-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .slots-card {
    padding: 0 1rem;
  }

  .slots-wrap {
    padding: 1rem;
  }
}

@media only screen and (min-width: 1200px) {
}
</style>
