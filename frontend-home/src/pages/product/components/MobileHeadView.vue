<template>
  <div class="head mobile">
    <!--LEFT-->
    <div class="head-name">
      LG - 65” Class UQ70 Series LED 4K UHD Smart webOS TV
    </div>

    <div class="head-legend">
      <span>Model: 8430288C2C</span>

      <span>ID: P9C3KC93CK</span>
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

    <div class="head-gallery">
      <div class="head-gallery-image">
        <Galleria
          :value="galleryImage"
          :responsiveOptions="responsiveOptions"
          :numVisible="1"
          :circular="true"
          :transitionInterval="0"
          containerStyle="max-width: 60%; min-height: 200px;  margin-top: 4rem;"
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

      <div class="head-gallery-boxes">
        <div
          v-for="(item, index) in images"
          :key="item"
          @click="changeGalleryImage(index)"
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

      <div class="head-price">
        <div class="ada-label">₳</div>
        3.258
      </div>

      <div class="head-stock">
        <span>10 Available / 20 in Stock</span>
      </div>

      <div class="head-collateral">
        <MeterGroup :value="collateralBar" />
      </div>
    </div>

    <DescriptionView />
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

    const images = ref([
      {
        itemImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6501/6501938_rd.jpg",
        thumbnailImageSrc:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6501/6501938_rd.jpg",
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
      review_count: 756,
    });

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

    return {
      images,
      product,
      galleryImage,
      lockingEndpoint,
      responsiveOptions,
      galleryImageIndex,
      collateralBar,
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
.head {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  display: none;
}

.head-stock {
  font-size: var(--text-size-a);
  font-weight: 400;
  text-align: left;
  margin-top: 1rem;
  width: 100%;
  color: var(--text-b);
}

.head-collateral {
  width: 70%;
  margin-right: auto;
  margin-top: 1rem;
}

.head .head-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.head .head-gallery .head-gallery-boxes {
  display: flex;
  justify-content: flex-start;
  position: relative;
  overflow-x: scroll;
  margin-top: 1rem;
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
  margin-right: 0.75rem;
  padding: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 10vw;
  height: 10vw;
  max-width: 70px;
  max-height: 70px;
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

.head .head-name {
  font-size: var(--text-size-f);
  font-weight: 700;
  text-align: left;
  margin-top: 2rem;
}

.head .head-legend {
  text-align: left;
  font-size: var(--text-size-a);
  margin-top: 1rem;
  color: var(--text-b);
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
  margin-right: 0.25rem;
  font-size: var(--text-size-b);
  color: var(--text-b);
  font-weight: 600;
}

.head .head-rating span:nth-child(3) {
  font-weight: 400;
}

.head .head-price {
  text-align: left;
  margin-top: 1rem;
  font-size: var(--text-size-i);
  font-weight: 700;
  display: flex;
  align-items: baseline;
  width: 100%;
}

.head .head-price .ada-label {
  font-weight: 400;
  color: var(--text-a);
  font-size: var(--text-size-e);
  margin-right: 0.5rem;
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
  margin-top: 1rem;
}

.head .head-button.outline {
  background: transparent;
  color: var(--blue-b);
  border: 1px solid var(--blue-b);
}

@media only screen and (max-width: 767px) {
  .mobile {
    display: initial;
  }
}

/* Tablets and small deskbanners */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .mobile {
    display: initial;
  }
}

/* Medium deskbanners */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .mobile {
    display: initial;
  }
}

/* Large deskbanners and widescreen monitors */
@media only screen and (min-width: 1200px) {
}
</style>
