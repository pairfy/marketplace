<template>
    <div class="row">
        <div class="title flex">
            <span>{{ props.title }}</span>

            <div class="button flex">
                <i class="pi pi-arrow-right" />
            </div>
        </div>

        <div class="band flex">
            <div class="grid">
                <ItemCard v-for="(item, index) in itemList" :key="index" :content="item"
                    :style="{ minHeight: '196px', maxHeight: '100%' }" />
            </div>
        </div>
    </div>
</template>

<script setup>
import ItemCard from '@/views/home/ItemCard.vue';
import { ref, computed } from 'vue';

const props = defineProps(['content', 'title'])

const maxItems = ref(7);

const itemList = computed(() => props.content.slice(0, maxItems.value));

</script>

<style lang="css" scoped>
.row {
    margin: 2rem 0;
    width: 100%;
    display: flex;
    padding: 1rem;
    border-radius: 0px;
    box-shadow: var(--shadow-b);
    align-items: flex-start;
    flex-direction: column;
    max-width: var(--body-a);
    background: var(--background-a);
}

.title {
    justify-content: space-between;
    font-size: var(--text-size-3);
    color: var(--primary-b);
    font-weight: 700;
    width: inherit;
}

.grid {
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto;
    grid-auto-rows: auto;
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
    border-radius: 16px;
    text-align: center;
}


.button {
    background: var(--background-a);
    justify-content: center;
    font-size: var(--text-size-1);
    font-weight: 500;
    cursor: pointer;
    height: 40px;
    white-space: nowrap;
    border-radius: 999px;
    padding: 0 1rem;
}

@media (min-width: 768px) {}

@media (min-width: 1200px) {}
</style>