<template>
    <div class="search" :class="{ focus: isFocus }" :style="{ backgroundColor: searchInput.length ? 'var(--background-a)' : 'var(--background-b)' }">
        <input v-model="searchInput" type="text" class="search-input"  placeholder="Search In Cardano"
            @focus="isFocus = true">
        <button class="search-button">
            <i class="pi pi-search" />
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const searchInput = ref("");

const isFocus = ref(false);

</script>

<style lang="css" scoped>
.search {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    width: 100%;
    margin: 0 auto;
    border: 1px solid var(--border-a);
    transition: 0.2s;
}

.search.focus{
    background: var(--background-b);
    border: 1px solid var(--text-a);
}

.search-input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    outline: none;
    font-size: var(--text-size-a);
    font-family: inherit;
    background: inherit;
}

.search-button {
    padding: 0 0.75rem;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-a);
}

.search-button:hover {
    background: var(--primary-a);
}

.search-icon {
    width: 20px;
    height: 20px;
}
</style>