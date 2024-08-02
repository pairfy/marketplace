<template>
  <div class="banner">
    <div class="banner-mask" />
    <Carousel
      :value="products"
      :numVisible="1"
      :numScroll="1"
      :page="0"
      :responsiveOptions="responsiveOptions"
      :showNavigators="false"
      :showIndicators="false"
      verticalViewPortHeight="400px"
      :autoplayInterval="5000"
      circular
    >
      <template #item>
        <img class="image" src="./header1.png" />
      </template>
    </Carousel>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const products = ref([
      {
        name: "1",
        image:
          "https://http2.mlstatic.com/D_NQ_811032-MLA77443388376_072024-OO.webp",
      },

      {
        name: "2",
        image: "https://http2.mlstatic.com/D_NQ_811032-MLA77443388376_072024-OO.webp",
      },

      {
        name: "3",
        image: "https://http2.mlstatic.com/D_NQ_811032-MLA77443388376_072024-OO.webp",
      },

      {
        name: "4",
        image: "https://http2.mlstatic.com/D_NQ_811032-MLA77443388376_072024-OO.webp",
      },
    ]);
    const responsiveOptions = ref([
      {
        breakpoint: "1400px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "1199px",
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "575px",
        numVisible: 1,
        numScroll: 1,
      },
    ]);

    return { products, responsiveOptions };
  },
};
</script>

<style lang="css" scoped>
.image {
  height: 400px;
  object-fit: cover;
  width: 100%;
  position: relative;
  object-position: center;
}

.banner {
  width: inherit;
  height: 400px;
  min-height: 400px;
  z-index: 1;
  position: relative;
  inset: 0px 0px -1px;
  background-size: contain;
  display: flex;
  flex-direction: column;
  margin-top: 106px;
  border-top: 1px solid var(--border-a);
}

.banner-mask {
  width: inherit;
  height: inherit;
  height: 10px;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 3;
  position: absolute;
  backdrop-filter: blur(0px);
  background: linear-gradient(180deg, transparent 0%, var(--primary-a) 100%);
}

.banner-screen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  z-index: 100;
  padding: 0 4rem;
}

@media only screen and (max-width: 767px) {
  .store {
    background: var(--base-b);
  }

  .banner {
    height: 400px;
    min-height: 400px;
  }

  .banner-mask {
    display: none;
  }
}
</style>
