<template>
        <div class="selector flex">
            <span>All</span>
            <div class="arrow flex">
                <i class="pi pi-sort-down-fill" />
            </div>
        </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.selector {
    border-right: 1px solid var(--border-a);
    background: var(--background-b);
    font-size: var(--text-size-0);
    height: inherit;
    padding: 0 1rem;
    white-space: nowrap;
    color: var(--text-b);
}

.selector .arrow{
    margin-left: 0.5rem;
}

.selector i{
    font-size: 10px;
}
</style>