<template>
    <div class="button">
        <span class="cart">0</span>
        <span class="text">Items</span>
    </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.button {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    margin: auto;
    justify-content: center;
}

.button span {
    line-height: initial;
}

.cart {
    background: var(--black-a);
    color: var(--text-w);
    font-size: var(--text-size-0);
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    padding: 0 0.5rem;
    display: flex;
    height: 16px;
}

.text{
    background: transparent;
    font-size: var(--text-size-0);
    font-weight: 500;
    margin-top: 0.25rem;
}
</style>