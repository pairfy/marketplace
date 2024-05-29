<template>
  <div class="grid">
    <div class="grid-item" v-for="row of getter__allProducts" :key="row">
      <div class="grid-item-title">{{ row.title }}</div>

      <div class="grid-row">
        <div
          class="card"
          v-for="item in row.items"
          :key="item"
          @click="handleClick(item.id)"
        >
          <div class="card-header">
            <div class="card-image">
              <img :src="item.image" alt="" />
            </div>
          </div>

          <div class="card-body">
            <div class="card-body-name">
              <span> {{ item.name.slice(0, 60) }}...</span>
            </div>

            <div class="card-body-rating">
              <Rating
                :modelValue="item.rating_count"
                :stars="5"
                :readonly="true"
                :cancel="false"
              />
              <span>({{ item.review_count }})</span>
            </div>

            <div class="card-body-price">
              <span> {{ formatPrice(item.price) }}</span>
            </div>

            <div class="card-body-collateral">
              <span> {{ formatPrice(item.collateral) }} Coll.</span>
            </div>

            <div class="card-body-seller">
              <span>{{ item.discount_label }}</span>
              <span>
                <svg
                  class="badge"
                  viewBox="0 0 24 24"
                  width="1rem"
                  height="1rem"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.438 4.313L14.814 1.5 12 3.124 9.187 1.5 7.562 4.313H4.313v3.25L1.5 9.186 3.124 12 1.5 14.813l2.813 1.625v3.248h3.25L9.186 22.5 12 20.876l2.813 1.624 1.625-2.814h3.248v-3.248l2.814-1.624L20.876 12 22.5 9.187l-2.814-1.625V4.313h-3.248zm-.902 4.215l1.414 1.414-6.364 6.364L7.05 12.77l1.414-1.414 2.122 2.122 4.95-4.95z"
                    fill="#F0B90B"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homeAPI from "@/pages/home/composable/home-api";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const { getter__allProducts } = homeAPI();

    return { router, getter__allProducts };
  },
  methods: {
    handleClick(id) {
      this.router.push({ name: "product", params: { id } });
    },

    formatPrice(num) {
      const price = num || 0;

      const customCurrencySymbol = "ADA";

      const formattedNumber = `${price.toLocaleString(
        "en-US"
      )} ${customCurrencySymbol}`;

      return formattedNumber;
    },
  },
};
</script>

<style lang="css" scoped>
::v-deep(.p-rating-icon) {
  width: var(--text-size-a);
  height: var(--text-size-a);
}

.card-body-seller {
  text-align: left;
  font-size: var(--text-size-a);
  display: flex;
  align-items: center;
  color: var(--text-a);
  font-weight: 200;
  margin-top: 1rem;
  border: 1px solid var(--border-a);
  padding: 0 0.5rem;
  display: none;
}

.card-body-rating {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.card-body-rating span {
  font-size: var(--text-size-a);
  margin-left: 0.5rem;
  color: var(--blue-a);
}

.card-body-collateral {
  text-align: left;
  font-size: var(--text-size-b);
  display: flex;
  align-items: center;
  font-weight: 400;
  color: var(--text-a);
  margin-top: 0.25rem;
}

.card-body-price {
  font-weight: 600;
  text-align: left;
  font-size: var(--text-size-d);
  color: var(--text-a);
  margin-top: 1rem;
}

.grid-item-title {
  font-size: var(--text-size-g);
  font-weight: bold;
  text-align: start;
  color: var(--text-a);
  padding: 1rem 0;
  margin: 1rem 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(100px, auto);
  gap: 20px;
  padding: 0 2rem;
  min-height: 100vh;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  background: var(--base-a);
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1rem;
}

.card {
  width: 300px;
  height: 600px;
  transition: box-shadow 0.25s ease-in-out 0s, transform 0.25s ease 0s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  padding: 1rem;
  margin: auto;
  line-height: 1.5rem;
  border: 1px solid var(--border-b);
}

.card-header {
  flex-basis: 50%;
  overflow: hidden;
}

.card-image {
}

.card-image img {
  width: 100%;
  height: 257px;
  display: flex;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  object-fit: contain;
}

.card-body {
  flex-basis: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.card-body-name {
  color: var(--blue-c);
  font-size: var(--text-size-b);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  text-transform: capitalize;
}

.card-body-name:hover {
  text-decoration: underline;
}

.card-body-name span {
  text-align: inherit;
}

.card-body-name span::first-letter {
  text-transform: capitalize;
}

.card-body-slot {
  color: var(--text-b);
  font-size: var(--text-size-a);
  text-align: left;
  font-weight: initial;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.card-bottom {
  flex-basis: 5%;
}

.badge {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}

.card-badge {
  font-size: var(--text-size-a);
  height: 30px;
  position: relative;
  color: var(--text-b);
  font-weight: 400;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-badge span {
  position: relative;
  text-transform: capitalize;
  height: 30px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  z-index: -1;
}

.card-badge::before,
.card-badge::after {
  content: "";
  position: absolute;
  top: 0;
  width: 50%;
  height: 30px;
  transition: box-shadow 0.1s ease-in-out 0s, transform 0.25s ease 0s;
}

.card-badge::before {
  left: 0;
  transform: skewX(-45deg);
  transform-origin: bottom left;
  border-top-left-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-right: transparent;
  background: var(--base-b);
  z-index: -1;
}

.card-badge::after {
  right: 0;
  transform: skewX(45deg);
  transform-origin: bottom right;
  border-top-right-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: transparent;
  z-index: -2;
  background: transparent;
  background: var(--base-b);
}

@media only screen and (max-width: 600px) {
  .grid {
    display: none;
  }
}
</style>
@/pages/home/composable/store-api
