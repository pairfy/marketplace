<template>
  <div class="products">
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
          <Button type="button" label="Ok" @click="hideModals" />
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
        <span v-if="productData"
          >Are you sure you want to delete <b>{{ productData.name }}</b
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
        <span v-if="productData"
          >Are you sure you want to delete the selected products?</span
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
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Product details"
      :modal="true"
      :draggable="false"
      :closeOnEscape="false"
      class="p-fluid"
    >
      <Carousel
        v-if="productData.image_base"
        :value="getImages(productData)"
        :numVisible="1"
        :numScroll="1"
        orientation="horizontal"
        verticalViewPortHeight="300px"
        contentClass="flex align-items-center"
      >
        <template #item="slotProps">
          <div class="product-image-wrap">
            <div class="product-image-preview">
              <Image
                :src="slotProps.data.image"
                imageStyle="object-fit: contain;"
                alt="Image"
                width="300"
                height="300"
                preview
              />
            </div>
          </div>
        </template>
      </Carousel>

      <div v-if="productData.image_base" class="field">
        <label for="mainImage" class="field-label">
          <span>Thumbnail</span>
          <i class="pi pi-info-circle" v-tooltip.top="'First image.'" />
        </label>

        <div id="mainImage" class="product-image-main">
          <div
            v-for="item in getImages(productData)"
            :key="item"
            :class="{ mainImage: isMainImage(item.id) }"
            @click="setMainImage(item.id)"
          >
            <Image
              :src="item.image"
              imageStyle="border-radius: 6px;display: flex;align-items: center; object-fit: contain;"
              alt="Image"
              width="50"
              height="50"
            />
          </div>
        </div>
      </div>

      <div class="field">
        <label for="name" class="field-label">
          <span>Name</span>
          <i
            class="pi pi-info-circle"
            v-tooltip.top="'Declarative and descriptive name of the product.'"
          />
        </label>

        <InputText
          id="name"
          placeholder="Name"
          v-model="productData.name"
          required="true"
          autofocus
          :class="{ invalid: formValidator.value.name }"
        />

        <small class="p-error" v-if="formValidator.value.name">
          {{ formValidatorText.name }}
        </small>
      </div>

      <div class="field">
        <label for="description" class="field-label">
          <span>Description</span>
          <i
            class="pi pi-info-circle"
            v-tooltip.top="'Write a clear description about the product.'"
          />
        </label>
        <Textarea
          id="description"
          v-model="productData.description"
          placeholder=""
          required="true"
          rows="3"
          cols="20"
          autoResize
          :class="{ invalid: formValidator.value.description }"
        />
        <small
          class="p-counter"
          :class="{
            invalid: productData.description.length > descriptionLimit,
          }"
          v-if="!formValidator.value.description"
        >
          {{ productData.description.length }} / {{ descriptionLimit }}
        </small>

        <small class="p-error" v-if="formValidator.value.description"
          >{{ formValidatorText.description }}
        </small>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="category" class="field-label">
            <span>Category</span>
            <i
              class="pi pi-info-circle"
              v-tooltip.top="
                'Select the category corresponding to the product.'
              "
            />
          </label>
          <Dropdown
            v-model="productData.category"
            :options="categories"
            id="category"
            placeholder="Select"
            optionLabel="name"
            :class="{ invalid: formValidator.value.category }"
            :highlightOnSelect="false"
          />
          <small class="p-error" v-if="formValidator.value.category"
            >{{ formValidatorText.category }}
          </small>
        </div>

        <div class="field col">
          <label for="price" class="field-label">
            <span>Price</span>
            <i
              class="pi pi-info-circle"
              v-tooltip.top="'Product price in ADA.'"
            />
          </label>
          <InputNumber
            id="price"
            v-model="productData.price"
            showButtons
            integeronly
            placeholder="ADA"
            suffix=" ADA"
            locale="en-US"
            :min="1"
            :class="{ invalid: formValidator.value.price }"
          />
          <small class="p-error" v-if="formValidator.value.price">{{
            formValidatorText.price
          }}</small>
        </div>

        <div class="field col">
          <label for="collateral" class="field-label">
            <span>Collateral</span>
            <i
              class="pi pi-info-circle"
              v-tooltip.top="
                'Assign an ADA amount as your compliance guarantee.'
              "
            />
          </label>
          <InputNumber
            id="collateral"
            v-model="productData.collateral"
            showButtons
            integeronly
            placeholder="ADA"
            suffix=" ADA"
            locale="en-US"
            :min="1"
            :class="{ invalid: formValidator.value.collateral }"
          />
          <small class="p-error" v-if="formValidator.value.collateral"
            >{{ formValidatorText.collateral }}
          </small>
        </div>

        <div class="field col">
          <label for="quantity" class="field-label">
            <span>Stock</span>
            <i
              class="pi pi-info-circle"
              v-tooltip.top="'Current number of units of the product.'"
            />
          </label>
          <InputNumber
            id="quantity"
            placeholder="Stock"
            v-model="productData.stock"
            integeronly
            :min="0"
            :max="1000000"
            :class="{ invalid: formValidator.value.stock }"
          />

          <small class="p-error" v-if="formValidator.value.stock"
            >{{ formValidatorText.stock }}
          </small>
        </div>
        <div class="field col">
          <label for="keywords" class="field-label">Keywords</label>
          <Chips
            id="keywords"
            v-model="productData.keywords"
            :allowDuplicate="false"
            separator=","
            :max="3"
            placeholder="Separate with (,) or  ↵"
            :class="{ invalid: formValidator.value.keywords }"
          />
          <small class="p-error" v-if="formValidator.value.keywords">
            {{ formValidatorText.keywords }}
          </small>
        </div>
      </div>

      <!--FILEUPLOAD-->
      <div class="field">
        <div class="product-upload">
          <label for="fileupload" class="field-label">
            <span>Images</span>
            <i
              class="pi pi-info-circle"
              v-tooltip.top="'The first image is the preview image.'"
            />
          </label>
          <Toast />

          <FileUpload
            name="image"
            :customUpload="true"
            :multiple="true"
            :fileLimit="5"
            accept="image/*"
            :maxFileSize="1000000"
            @select="onSelectedFiles"
          >
            <template
              #header="{ chooseCallback, uploadCallback, clearCallback, files }"
            >
              <div class="upload-buttons">
                <div
                  class="upload-button"
                  :class="{ disabled: disableUpload }"
                  @click="chooseCallback()"
                >
                  <i class="pi pi pi-images" />
                </div>

                <div
                  class="upload-button"
                  :class="{ disabled: !files || files.length === 0 }"
                  @click="uploadEvent(uploadCallback, files)"
                >
                  <i class="pi pi-cloud-upload" />
                </div>

                <div
                  class="upload-button"
                  :class="{ disabled: !files || files.length === 0 }"
                  @click="clearCallback()"
                >
                  <i class="pi pi-times" />
                </div>
              </div>
            </template>

            <template #content="{ files, removeFileCallback }">
              <div v-if="files.length > 0">
                <div class="upload-list">
                  <div
                    v-for="(file, index) of files"
                    :key="file.name + file.type + file.size"
                    class="upload-box"
                  >
                    <img
                      role="presentation"
                      :alt="file.name"
                      :src="file.objectURL"
                      width="100"
                      height="50"
                    />

                    <span class="filename">{{ file.name }}</span>

                    <div class="filename">{{ formatSize(file.size) }}</div>

                    <div class="upload-control">
                      <div class="pending-badge">
                        <span>Pending</span>
                      </div>

                      <div
                        class="upload-remove"
                        @click="
                          onRemoveTemplatingFile(
                            file,
                            removeFileCallback,
                            index
                          )
                        "
                      >
                        Delete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #empty>
              <div v-if="filesUploaded === false" class="upload-banner">
                <i class="pi pi-cloud-upload" />
                <span>Drag and drop files to here to upload.</span>
              </div>

              <div v-if="filesUploaded === true" class="upload-banner">
                <i class="pi pi-cloud-upload" style="color: var(--green-a)" />
                <span>Successfully completed</span>
              </div>
            </template>
          </FileUpload>

          <small class="invalid" v-if="formValidator.value.images">
            {{ formValidatorText.images }}
          </small>
        </div>
      </div>
      <!--FILEUPLOAD-->

      <template #footer>
        <Button label="Cancel" text @click="hideDialog" />
        <Button label="Save" text @click="submitForm" />
      </template>
    </Dialog>
    <!--DIALOG SECTION-->

    <!---CONTENT-->
    <div class="products-wrap">
      <div class="products-card">
        <DataTable
          ref="dt"
          resizableColumns
          :value="products"
          v-model:selection="selectedProducts"
          selectionMode="single"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="{first} to {last} of {totalRecords} items"
        >
          <template #header>
            <div class="products-header">
              <div class="products-header-left">
                <span>Products</span>
                <span>Create and modify product and more...</span>
              </div>

              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search"
                />
              </span>
            </div>

            <Toolbar>
              <template #start>
                <Button label="New" icon="pi pi-plus" @click="newProduct" />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  style="margin-left: 1rem"
                  @click="confirmDeleteSelected"
                  :disabled="!selectedProducts || !selectedProducts.length"
                />
              </template>

              <template #end>
                <Button
                  label="Export"
                  icon="pi pi-upload"
                  @click="exportCSV($event)"
                />
              </template>
            </Toolbar>
          </template>

          <Column
            selectionMode="multiple"
            style="width: 3rem"
            :exportable="false"
          />

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
                imageStyle="border-radius: 6px; object-fit: contain;"
                preview
              />
            </template>
          </Column>

          <Column field="id" header="Code" sortable style="min-width: 12rem" />

          <Column
            field="name"
            header="Name"
            sortable
            style="max-width: 16rem; white-space: break-spaces"
          >
            <template #body="slotProps">
              {{ slotProps.data.name.slice(0, 50) }}...
            </template>
          </Column>

          <Column
            field="category"
            header="Category"
            sortable
            style="min-width: 8rem; text-transform: capitalize"
          >
            <template #body="slotProps">
              {{ slotProps.data.category.code || slotProps.data.category }}
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
            field="moderated"
            header="Status"
            sortable
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              <div
                class="table-tag"
                :class="{
                  pending: slotProps.data.moderated === 0,
                  moderated: slotProps.data.moderated === 1,
                }"
              >
                {{ checkModerated(slotProps.data.moderated) }}
              </div>
            </template>
          </Column>

          <Column
            field="stock_status"
            header="Stock"
            sortable
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.stock_status"
                :severity="getStatusLabel(slotProps.data.stock_status)"
              />
            </template>
          </Column>

          <Column
            field="rating"
            header="Reviews"
            sortable
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              <Rating
                :modelValue="slotProps.data.rating"
                :readonly="true"
                :cancel="false"
              />
            </template>
          </Column>

          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <div class="table-buttons">
                <Button
                  class="table-button"
                  icon="pi pi-pencil"
                  outlined
                  rounded
                  @click="editProduct(slotProps.data)"
                />
                <Button
                  class="table-button"
                  icon="pi pi-trash"
                  outlined
                  rounded
                  @click="confirmDeleteProduct(slotProps.data)"
                />
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
import { FilterMatchMode } from "primevue/api";
import { HOST } from "@/api/index";
import { ref } from "vue";
import { usePrimeVue } from "primevue/config";
import { useToast } from "primevue/usetoast";

export default {
  setup() {
    const { getProductsData, createProduct, createImages } = dashboardAPI();

    let productData = ref({
      id: null,
      seller_id: null,
      name: null,
      description: "",
      category: null,
      price: null,
      collateral: null,
      stock: null,
      stock_status: null,
      slots: null,
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
    });

    let formValidator = ref({
      name: false,
      description: false,
      category: false,
      price: false,
      collateral: false,
      stock: false,
      keywords: false,
      images: false,
    });

    let messageModalVisible = ref(false);
    let messageModal = ref(null);
    let errorModal = ref(null);
    let disableUpload = ref(false);

    const resetForm = () => {
      productData.value = {
        id: null,
        seller_id: null,
        name: null,
        description: "",
        category: null,
        price: null,
        collateral: null,
        stock: null,
        stock_status: null,
        slots: null,
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
      };

      formValidator.value = ref({
        name: false,
        description: false,
        category: false,
        price: false,
        collateral: false,
        stock: false,
        keywords: false,
        images: false,
      });

      messageModalVisible.value = false;
      messageModal.value = null;
      errorModal.value = null;
      disableUpload.value = false;
    };

    const totalSize = ref(0);
    const totalSizePercent = ref(0);
    const files = ref([]);

    const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
      removeFileCallback(index);
      totalSize.value -= parseInt(formatSize(file.size));
      totalSizePercent.value = totalSize.value / 10;
    };

    const onClearTemplatingUpload = (clear) => {
      clear();
      totalSize.value = 0;
      totalSizePercent.value = 0;
    };

    const onSelectedFiles = (event) => {
      files.value = event.files;
      files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
      });
    };

    const maxProductImages = ref(5);

    const minProductImages = ref(5);

    const uploadEvent = async (callback, files) => {
      totalSizePercent.value = totalSize.value / 10;

      if (files.length < maxProductImages.value) {
        return toast.add({
          severity: "error",
          summary: "Try Again",
          detail: "Select at least (5) images",
          life: 10000,
        });
      }

      if (files.length > maxProductImages.value) {
        return toast.add({
          severity: "error",
          summary: "Try Again",
          detail: "Select only (5) images",
          life: 10000,
        });
      }

      const formData = new FormData();

      files.forEach((file, index) => {
        console.log(index);

        formData.append(`image`, file, file.name);
      });

      await createImages(formData).then((res) => {
        const data = res.response;

        if (data.success === true) {
          productData.value.image_set.push(...data.payload);
          disableUpload.value = true;
          filesUploaded.value = true;
          callback();

          toast.add({
            severity: "info",
            summary: "Success",
            detail: "Files Uploaded",
            life: 5000,
          });
        }
      });
    };

    const formatSize = (bytes) => {
      const k = 1024;
      const dm = 3;
      const sizes = $primevue.config.locale.fileSizeTypes;

      if (bytes === 0) {
        return `0 ${sizes[0]}`;
      }

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

      return `${formattedSize} ${sizes[i]}`;
    };

    const $primevue = usePrimeVue();

    const toast = useToast();

    const nameLimit = ref(200);

    const descriptionLimit = ref(1000);

    const filesUploaded = ref(false);

    const formValidatorText = ref({
      name:
        "The name is required and max " + nameLimit.value + " characters long.",
      description:
        "The description is required and no maximum " +
        descriptionLimit.value +
        " characters.",

      category: "The category is required.",
      price: "The price is required.",
      collateral: "The collateral is required.",
      stock: "The current stock is required.",
      keywords: "3 keywords are required.",
      images:
        productData.value.image_set.length +
        " / " +
        minProductImages.value +
        "images are required.",
    });

    return {
      descriptionLimit,
      filesUploaded,
      formValidatorText,
      onRemoveTemplatingFile,
      onClearTemplatingUpload,
      onSelectedFiles,
      usePrimeVue,
      formatSize,
      uploadEvent,
      productData,
      disableUpload,
      resetForm,
      messageModalVisible,
      messageModal,
      errorModal,
      totalSizePercent,
      formValidator,
      getProductsData,
      createProduct,
      createImages,
      minProductImages,
      nameLimit,
    };
  },
  data() {
    return {
      mediaHostURL: HOST + "/api/media/create-image",
      products: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
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
  mounted() {
    this.products = this.getProductsData;
  },
  methods: {
    handleMessage(type, message) {
      this.messageModalVisible = true;

      if (type === "response") {
        this.messageModal = message.response.message;
      }

      if (type === "error") {
        this.errorModal = message.response.errors;
      }
    },
    hideModals() {
      this.messageModalVisible = false;
    },

    onFileRemoved(e) {
      console.log(e.files.length);

      if (e.files.length < this.maxProductImages) {
        this.disableUpload = false;
      }
    },
    onUpload(e) {
      const response = JSON.parse(e.xhr.response);

      if (response.success === true) {
        if (this.productData.image_set.length < this.maxProductImages) {
          this.productData.image_set.push(...response.payload);
        } else {
          this.disableUpload = true;
        }
      }
    },
    formatCurrency(value) {
      if (value) {
        return value + " ADA";
      }
    },
    newProduct() {
      this.resetForm();
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
    },
    async submitForm() {
      this.formValidator.value = {
        name: this.validateName(this.productData.name),
        description: this.validateDescription(this.productData.description),
        category: this.validateCategory(this.productData.category),
        price: this.validatePrice(this.productData.price),
        collateral: this.validateCollateral(this.productData.collateral),
        stock: this.validateStock(this.productData.stock),
        keywords: this.validateKeywords(this.productData.keywords),
        images: this.validateImages(this.productData.image_set),
      };

      console.log(this.formValidator.value);

      if (Object.values(this.formValidator.value).includes(true)) {
        return;
      }

      const params = {
        name: this.productData.name,
        description: this.productData.description,
        category: this.productData.category.code,
        price: this.productData.price,
        collateral: this.productData.collateral,
        stock: this.productData.stock,
        keywords: this.productData.keywords.join(","),
        image_set: this.productData.image_set.join(","),
      };

      await this.createProduct(params).then((res) => {
        if (res.response.success === true) {
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000,
          });

          this.resetForm();
          this.productDialog = false;
        }
      });
    },

    editProduct(productData) {
      productData.keywords =
        typeof productData.keywords === "string"
          ? productData.keywords.split(",")
          : productData.keywords;

      productData.image_set =
        typeof productData.image_set === "string"
          ? productData.image_set.split(",")
          : productData.image_set;

      let categoryCode = productData.category;

      let categoryName =
        categoryCode.charAt(0).toUpperCase() + categoryCode.slice(1);

      productData.category = {
        name: categoryName,
        code: categoryCode,
      };

      this.productData = productData;

      this.productDialog = true;
    },

    confirmDeleteProduct(productData) {
      this.productData = productData;
      this.deleteProductDialog = true;
    },

    deleteProduct() {
      this.products = this.products.filter(
        (val) => val.id !== this.productData.id
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
    isMainImage(e) {
      return this.productData.image_main === e;
    },
    setMainImage(e) {
      this.productData.image_main = e;
    },
    getImages(productData) {
      const data = productData.image_set;

      return data.map((imageId) => ({
        main: productData.image_main,
        id: imageId,
        image: productData.image_base + productData.image_path + imageId,
      }));
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteProductsDialog = true;
    },
    deleteSelectedProducts() {
      this.products = this.products.filter(
        (e) => !this.selectedProducts.includes(e)
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

    validateName(e) {
      if (!e) {
        return true;
      }

      if (e.length > this.nameLimit) {
        return true;
      }

      return false;
    },
    validateDescription(e) {
      if (!e) {
        return true;
      }

      if (e.length < 1) {
        return true;
      }

      if (e.length > this.descriptionLimit) {
        return true;
      }

      return false;
    },

    validateCategory(e) {
      return !e ? true : false;
    },

    validatePrice(e) {
      if (typeof e !== "number") {
        return true;
      }

      if (!Number.isInteger(e)) {
        return true;
      }

      if (e < 1) {
        return true;
      }

      return false;
    },
    validateCollateral(e) {
      if (typeof e !== "number") {
        return true;
      }

      if (!Number.isInteger(e)) {
        return true;
      }

      if (e < 1) {
        return true;
      }

      return false;
    },
    validateStock(e) {
      if (typeof e !== "number") {
        return true;
      }

      if (!Number.isInteger(e)) {
        return true;
      }

      if (e < 1) {
        return true;
      }

      return false;
    },
    validateKeywords(e) {
      if (!e) {
        return true;
      }

      if (e.length < 3) {
        return true;
      }

      return false;
    },
    validateImages(e) {
      if (!e) {
        return true;
      }

      if (e.length < this.minProductImages) {
        return true;
      }

      return false;
    },
    checkModerated(e) {
      if (e === 0) {
        return "Pending";
      }
      if (e === 1) {
        return "Published";
      }
    },
  },
};
</script>

<style lang="css" scoped>
.pending-badge,
.completed-badge {
  background: var(--yellow-b);
  text-align: center;
  border-radius: 999px;
  font-size: var(--text-size-a);
  padding: 0.25rem;
  width: 100px;
}

.completed-badge {
  background: var(--green-a);
}

.upload-list {
  display: flex;
  flex-direction: column;
}

.upload-box {
  border: 1px solid var(--border-a);
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  border-radius: 8px;
  padding: 1rem;
  flex-direction: column;
}

.upload-control {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.upload-remove {
  padding: 0.25rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border-b);
  margin-left: 0.5rem;
  font-size: var(--text-size-a);
  cursor: pointer;
}

.upload-banner {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: center;
  align-items: center;
}

.upload-banner i {
  font-size: 4rem;
}

.upload-banner span {
  margin-top: 1rem;
}

.upload-box img {
  border: 1px solid var(--border-a);
  border-radius: 8px;
  height: 125px;
  object-fit: contain;
  width: 125px;
  padding: 0.5rem;
}

.upload-box .filename {
  font-size: var(--text-size-a);
  margin-top: 0.5rem;
}

.upload-buttons {
  display: flex;
  align-items: center;
}

.upload-button.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.upload-button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-right: 1rem;
  border: 1px solid var(--border-a);
}

.product-image-main {
  display: flex;
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

.table-tag.moderated {
}

.table-tag.pending {
}
.table-buttons {
  display: flex;
  align-items: center;
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

.products {
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

.products-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem 2rem;
}

.products-card {
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
  margin-bottom: 1.5rem;
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
  font-weight: 500;
  display: flex;
  align-items: center;
}

.field-label i {
  font-size: var(--text-size-a);
  margin-left: 0.5rem;
  margin-top: 3px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-a);
  padding: 1rem 0;
}

.products-header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 0;
}

.products-header-left span:nth-child(1) {
  font-weight: 700;
  font-size: var(--text-size-f);
}

.products-header-left span:nth-child(2) {
  font-weight: 400;
  font-size: var(--text-size-c);
  text-align: left;
}

::v-deep(.p-dropdown) {
  width: initial;
}

@media only screen and (max-width: 767px) {
  .products-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .products-card {
    padding: 0 1rem;
  }

  .products-wrap{
    padding: 1rem;
  }
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .products-header {
    flex-direction: column;
    align-items: flex-start;
  }



  .products-wrap{
    padding: 1rem;
  }
}

@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .products-header {
    flex-direction: column;
    align-items: flex-start;
  }



  .products-wrap{
    padding: 1rem;
  }
}

@media only screen and (min-width: 1200px) {


}
</style>
