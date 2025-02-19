<template>
  <div class="grid">
    <ItemCard v-for="item, index in content" :key="index" :content="item" :style="{ minHeight: '231.09px', maxHeight: '100%' }"/>
  </div>
</template>

<script setup>
import ItemCard from '@/views/home/ItemCard.vue';
import { ref } from 'vue';

const props = defineProps(['content'])


</script>

<style lang="css" scoped>
.grid {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  background: var(--background-a);
  box-shadow: var(--shadow-b);
  max-width: var(--body-a);
  padding: 1rem;
  display: grid;
  gap: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  width: 100%;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>