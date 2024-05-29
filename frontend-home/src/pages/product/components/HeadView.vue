<template>
  <div class="head mobile">
    <!--LEFT-->

    <div class="bread">
      <Breadcrumb :home="home" :model="breadItems">
        <template #separator>
          <div class="arrow" />
        </template>
      </Breadcrumb>
    </div>

    <div class="head-body">
      <div class="head-left">
        <div class="head-gallery">
          <div class="head-gallery-boxes">
            <div
              v-for="(item, index) in images"
              :key="item"
              @click="changeGalleryImage(index)"
              @mouseover="changeGalleryImage(index)"
              :class="{ imageSelected: isGalleryImage(index) }"
            >
              <img :src="item.thumbnailImageSrc" alt="" />
            </div>

            <div>
              <span class="mask">+15</span>
            </div>

            <div>
              <span class="mask">
                <i class="pi pi-play-circle" />
              </span>
            </div>
          </div>
          <div class="head-gallery-image">
            <Galleria
              :value="galleryImage"
              :responsiveOptions="responsiveOptions"
              :numVisible="1"
              :circular="true"
              :transitionInterval="0"
              containerStyle="max-width: 60%; min-height: 500px;  margin-top: 4rem;"
              :showItemNavigators="false"
              :showThumbnails="false"
            >
              <template #item="slotProps">
                <img
                  :src="slotProps.item.itemImageSrc"
                  :alt="slotProps.item.alt"
                  style="width: 100%; display: block"
                />
              </template>
            </Galleria>
          </div>
        </div>

        <DescriptionView />
      </div>

      <!--RIGHT-->
      <div class="head-right">
        <div class="head-name">
          Samsung - Galaxy Tab S9 FE - 10.9" 128GB - Wi-Fi - with S-Pen - Gray
        </div>

        <div class="head-legend">
          <span>Model: 8430288C2C</span>

          <span>SKU: P9C3KC93CK</span>
        </div>

        <div class="head-rating">
          <Rating
            :modelValue="product.rating_count"
            :stars="5"
            :readonly="true"
            :cancel="false"
            style="margin-right: 0.5rem"
          />
          <span>{{ product.rating_count }}</span>

          <span>({{ product.review_count }} Reviews)</span>
        </div>

        <div class="head-price">
          <div class="ada-label">₳</div>
          <span> 1.720</span>
        </div>

        <div class="head-stock">
          <span>10 available / 20 in stock</span>
        </div>

        <div class="head-collateral">
          <MeterGroup :value="collateralBar" />
        </div>

        <div class="head-button">
          <div @click="buyProduct">Buy now</div>
        </div>

        <div class="head-button outline">
          <div @click="buyProduct">Add to cart</div>
        </div>

        <div class="head-seller">
          <div class="head-seller-head">
            <img
              src="https://http2.mlstatic.com/D_NQ_NP_984015-MLA74975093699_032024-G.jpg"
              alt=""
            />

            <div>
              <span>Samsung</span>
              <span>1000+ sales completed</span>
            </div>
          </div>
          <div class="head-seller-bottom">
            <div class="head-seller-badge">
              <i class="pi pi-clock" />
              <span> Products delivered on time. </span>
              <ul class="meter">
                <li class="level-1" :class="{ actived: false }" />
                <li class="level-2" :class="{ actived: false }" />
                <li class="level-3" :class="{ actived: false }" />
                <li class="level-4" :class="{ actived: false }" />
                <li class="level-5" :class="{ actived: true }" />
              </ul>
            </div>

            <div class="head-seller-badge">
              <i class="pi pi-arrow-right-arrow-left" />
              <span> Good communication. </span>
              <ul class="meter">
                <li />
                <li />
                <li />
                <li />
                <li />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productAPI from "@/pages/product/api";
import DescriptionView from "./DescriptionView.vue";

import { ref } from "vue";

export default {
  components: {
    DescriptionView,
  },
  setup() {
    const { lockingEndpoint } = productAPI();

    const galleryImage = ref([]);

    const galleryImageIndex = ref(0);

    const collateralBar = ref([
      {
        label: "Collateral 500 ADA",
        color: "#60a5fa",
        value: 30,
        icon: "pi pi-crown",
      },
      {
        label: "Protected Purchase",
        color: "#34d399",
        value: 100,
        icon: "pi pi-box",
      },
    ]);

    const images = ref([
      {
        itemImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6557/6557718_sd.jpg",
        thumbnailImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6557/6557718_sd.jpg",
        alt: "Description for Image 1",
        title: "Title 1",
      },
      {
        itemImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6553/6553101_sd.jpg",
        thumbnailImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6553/6553101_sd.jpg",
        alt: "Description for Image 2",
        title: "Title 2",
      },
      {
        itemImageSrc:
          "https://pisces.bbystatic.com/image3/BestBuy_US/images/products/6537/6537363_sd.jpg",
        thumbnailImageSrc:
          "https://pisces.bbystatic.com/image3/BestBuy_US/images/products/6537/6537363_sd.jpg",
        alt: "Description for Image 3",
        title: "Title 3",
      },
      {
        itemImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6566/6566196_sd.jpg",
        thumbnailImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6566/6566196_sd.jpg",
        alt: "Description for Image 4",
        title: "Title 4",
      },
    ]);

    const responsiveOptions = ref([
      {
        breakpoint: "991px",
        numVisible: 4,
      },
      {
        breakpoint: "767px",
        numVisible: 3,
      },
      {
        breakpoint: "575px",
        numVisible: 1,
      },
    ]);

    const product = ref({
      rating_count: 4.8,
      review_count: 558,
    });

    const seller = ref({
      name: "Samsung",
      sales_completed: 1000,
      delivered_on_time: 5,
      good_communication: 4,
    });

    const breadItems = ref([
      { label: "Electronics" },
      { label: "TV & Accessories" },
      { label: "TVs" },
    ]);

    return {
      images,
      product,
      seller,
      breadItems,
      galleryImage,
      lockingEndpoint,
      collateralBar,
      responsiveOptions,
      galleryImageIndex,
    };
  },
  data() {
    return {
      lucid: null,
      slot_id: "",
      buyer_pubkeyhash: "",
      tx1: "84a400800181a300581d70c11355d423aed1273fa29eb0aaae09f63f025890f03fedd6ade0b4f5011a01312d0b028201d8185841d8799f004777616974696e67d87980d87980d87980581c4068ce72a0f73e850f19899a10b82ec534a55a6d860e5c5267dca2b9d87a801a01c9c38b1a01312d0bff02000e81581c4068ce72a0f73e850f19899a10b82ec534a55a6d860e5c5267dca2b9a0f5f6",
      tx2: "",
    };
  },

  created() {
    this.$watch(
      () => this.$route.params,
      (e) => (this.slot_id = e.id),
      { immediate: true }
    )();
  },
  methods: {
    isGalleryImage(index) {
      return this.galleryImageIndex === index;
    },
    setupData() {
      this.galleryImage[0] = this.images[0];
    },
    changeGalleryImage(index) {
      this.galleryImageIndex = index;
      this.galleryImage[0] = this.images[this.galleryImageIndex];
    },
  },

  mounted() {
    this.setupData();
  },
};
</script>

<style lang="css" scoped>
::v-deep(.p-accordion-toggle-icon) {
  display: none;
}

.bread {
  display: flex;
  justify-content: flex-start;
  width: inherit;
  padding-top: 2rem;
  padding-bottom: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--border-b);
}

.head-stock {
  font-size: var(--text-size-a);
  font-weight: 400;
  text-align: left;
  margin-top: 1rem;
  color: var(--text-b);
}

.meter {
  display: flex;
  margin-left: auto;
}

.meter li {
  width: 1rem;
  height: 0.5rem;
  background: var(--base-c);
  margin-left: 0.25rem;
  list-style: none;
}

.meter .level-1 {
  background: #fff0f0;
}

.meter .level-2 {
  background: #fff5e8;
}

.meter .level-3 {
  background: #fffcda;
}

.meter .level-4 {
  background: #f1fdd7;
}

.meter .level-5 {
  background: #edf8ee;
}

.meter .level-5.actived {
  background: var(--green-c);
}

.head-seller {
  width: 90%;
  margin-top: 2rem;
  border: 1px solid var(--border-a);
  border-radius: 8px;
}

.head-seller-head {
  display: flex;
  padding: 1rem;
  align-items: center;
  border-bottom: 1px solid var(--border-a);
  background: var(--base-b);
}

.head-seller-head img {
  width: 3rem;
  height: 3rem;
  outline: 1px solid var(--border-b);
  outline-offset: 2px;
  border-radius: 4px;
  object-fit: contain;
}

.head-seller-head div {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 1rem;
}

.head-seller-head div span:nth-child(1) {
  font-weight: 500;
}

.head-seller-head div span:nth-child(2) {
  font-weight: 400;
  font-size: var(--text-size-a);
  color: var(--text-b);
}

.head-collateral {
  width: 50%;
  margin-top: 1rem;
}

.head-seller-badge {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: var(--text-b);
}

.head-seller-badge span {
  font-size: var(--text-size-a);
  margin-left: 1rem;
  font-weight: 200;
}

.head {
  display: flex;
  flex-direction: column;
}

.head-body {
  display: flex;
}

.arrow::before {
  border-bottom: 4px solid #0000;
  border-left: 4px solid var(--text-b);
  border-top: 4px solid #0000;
  content: " ";
  display: inline-block;
  align-items: center;
  height: 0;
  margin: 0 2px;
  width: 0;
}

.head .head-left {
  text-align: center;
  width: 70%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.head .head-gallery {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.head .head-gallery .head-gallery-boxes {
  display: flex;
  justify-content: flex-start;
  position: relative;
  flex-direction: column;
  height: 100%;
}

.mask {
  background: #55555a;
  border-radius: 4px;
  color: var(--text-w);
  font-weight: bold;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  opacity: 0.9;
}

.head .head-gallery .head-gallery-boxes div {
  border: 1px solid var(--border-b);
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 70px;
  height: 70px;
}

.head .head-gallery .head-gallery-boxes div.imageSelected {
  outline: 2px solid black;
}

.head .head-gallery .head-gallery-boxes div img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.head .head-gallery .head-gallery-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

.head .head-right {
  height: inherit;
  text-align: center;
  width: 30%;
}

.head .head-name {
  font-size: var(--text-size-g);
  font-weight: 700;
  text-align: left;
  width: 90%;
}

.head .head-legend {
  text-align: left;
  font-size: var(--text-size-a);
  margin-top: 1rem;
}

.head .head-legend span {
  margin-right: 1rem;
}

.head .head-rating {
  margin-right: 0.5rem;
  font-size: var(--text-size-c);
  align-items: center;
  margin-top: 1rem;
  display: flex;

}

.head .head-rating span {
  margin-right: 0.5rem;
  font-size: var(--text-size-b);
  color: var(--blue-a);
  font-weight: 600;
}

.head .head-rating span:nth-child(3) {
  font-weight: 400;
  font-size: var(--text-size-a);
}

.head .head-price {
  text-align: left;
  margin-top: 1rem;
  font-size: var(--text-size-h);
  font-weight: 700;
  display: flex;
  align-items: baseline;
}

.head .head-price .ada-label {
  font-weight: 400;
  color: var(--text-a);
  font-size: var(--text-size-g);
  margin-right: 0.5rem;
  margin-bottom: 2px;
}

.head .head-button {
  background: var(--blue-b);
  width: 90%;
  border-radius: 8px;
  color: var(--text-w);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  text-align: center;
  margin-top: 4rem;
}

.head .head-button.outline {
  background: transparent;
  color: var(--blue-b);
  margin-top: 1rem;
  border: 1px solid var(--blue-b);
}

@media only screen and (max-width: 767px) {
  .mobile {
    display: none;
  }

  .bread {
    padding: 1rem;
  }
}

/* Tablets and small deskbanners */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .mobile {
    display: none;
  }
}

/* Medium deskbanners */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .mobile {
    display: none;
  }
}

/* Large deskbanners and widescreen monitors */
@media only screen and (min-width: 1200px) {
  /* CSS rules for large deskbanners and widescreen monitors */
}
</style>
