<template>
  <div class="p-mediacomp">
    <div class="p-mediacomp-boxes">
      <div
        v-for="(item, index) in galleryImages"
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
    <div class="p-mediacomp-gallery">
      <Galleria
        :value="galleryImage"
        :responsiveOptions="responsiveOptions"
        :numVisible="1"
        :circular="true"
        :transitionInterval="0"
        containerStyle="max-width: 60%;   margin-top: 4rem; "
        :showItemNavigators="false"
        :showThumbnails="false"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.itemImageSrc"
            :alt="slotProps.item.alt"
            class="p-mediacomp-gallery-image"
          />
        </template>
      </Galleria>
    </div>
  </div>
</template>

<script>
import productAPI from "@/pages/product/api/index";
import { ref, computed } from "vue";

export default {
  setup() {
    const { getProductData } = productAPI();

    const buildURL = (id) => {
      return (
        getProductData.value.media_url + getProductData.value.media_path + id
      );
    };

    const galleryImages = computed(() => {
      const images = getProductData.value.image_set.split(",");
     
      return images.map((id) => {
        return {
          itemImageSrc: buildURL(id),
          thumbnailImageSrc: buildURL(id),
          alt: "Description for Image 1",
          title: "Title 1",
        };
      });
    });

    const galleryImage = ref([galleryImages.value[0]]);

    const galleryImageIndex = ref(0);

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

    return {
      galleryImages,
      responsiveOptions,
      galleryImage,
      galleryImageIndex,
      getProductData,
    };
  },

  methods: {
    isGalleryImage(index) {
      return this.galleryImageIndex === index;
    },

    changeGalleryImage(index) {
      this.galleryImageIndex = index;
      this.galleryImage[0] = this.galleryImages[this.galleryImageIndex];
    },
  },
};
</script>

<style lang="css" scoped>
.p-mediacomp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.p-mediacomp .p-mediacomp-boxes {
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

.p-mediacomp .p-mediacomp-boxes div {
  border: 1px solid var(--border-b);
  border-radius: 6px;
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

.p-mediacomp .p-mediacomp-boxes div.imageSelected {
  outline: 2px solid black;
}

.p-mediacomp .p-mediacomp-boxes div img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.p-mediacomp .p-mediacomp-gallery {
  width: 100%;
  display: flex;
  justify-content: center;
}

.p-mediacomp-gallery-image {
  width: 100%;
  display: block;
  min-height: 350px;
  max-height: 350px;
  object-fit: contain;
}
</style>
