<template>
  <div class="seller">
    <div class="seller-head">
      <img src="https://http2.mlstatic.com/D_NQ_NP_984015-MLA74975093699_032024-G.jpg" alt="" />

      <div>
        <span>Samsung</span>
        <span>1000+ sales completed</span>
      </div>
    </div>
    <div class="seller-bottom">
      <div class="seller-badge">
        <i class="pi pi-clock" />
        <span> Time management. </span>
        <ul class="meter">
          <li class="level-1" :class="{ actived: false }" />
          <li class="level-2" :class="{ actived: false }" />
          <li class="level-3" :class="{ actived: false }" />
          <li class="level-4" :class="{ actived: false }" />
          <li class="level-5" :class="{ actived: true }" />
        </ul>
      </div>

      <div class="seller-badge">
        <i class="pi pi-thumbs-up" />
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
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const seller = ref({
      name: "Samsung",
      sales_completed: 1000,
      delivered_on_time: 5,
      good_communication: 4,
    });

    return {
      seller,
    };
  },
};
</script>

<style lang="css" scoped>
.seller {
  margin-top: 2rem;
  border: 1px solid var(--border-b);
  border-radius: 8px;
  overflow: hidden;
}

.seller-head {
  display: flex;
  padding: 1rem;
  align-items: center;
  border-bottom: 1px solid var(--border-a);
}

.seller-head img {
  width: 3rem;
  height: 3rem;
  outline: 1px solid var(--border-b);
  outline-offset: 2px;
  border-radius: 8px;
  object-fit: contain;
}

.seller-head div {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 1rem;
}

.seller-head div span {
  line-height: 1.5rem;
}

.seller-head div span:nth-child(1) {
  font-weight: 500;
}

.seller-head div span:nth-child(2) {
  font-weight: 400;
  font-size: var(--text-size-a);
  color: var(--text-b);
}

.seller-badge {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: var(--text-b);
}

.seller-badge span {
  font-size: var(--text-size-b);
  margin-left: 1rem;
  font-weight: 400;
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
  background: var(--base-b);
}

.meter .level-2 {
  background: var(--base-b);
}

.meter .level-3 {
  background: var(--base-b);
}

.meter .level-4 {
  background: var(--base-b);
}

.meter .level-5 {
  background: var(--base-b);
}

.meter .level-5.actived {
  background: var(--green-c);
}
</style>
