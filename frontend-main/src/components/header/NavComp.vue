<template>
    <section class="flex">
        <div class="menu">
            <div class="nav flex">
                <span>Best Sellers</span>
                <span>Discounts</span>
                <span>Rewards</span>
                <span>Support</span>
                <span>Sell</span>
                <span>
                    <a href="https://cardano-ecommerce.gitbook.io/marketplace" target="_blank"
                        rel="noopener noreferrer">Docs</a>
                </span>
                <span>Electronics</span>
                <span>Garden</span>
                <span>Office</span>
            </div>
        </div>
    </section>


</template>

<script setup>
</script>

<style lang="css" scoped>
section {
    border-bottom: 1px solid var(--border-a);
    justify-content: center;   
    height: 2.5rem;
    width: inherit;
}

.menu {
    max-width: calc(var(--body-a) - 10rem);
    color: inherit;
    width: 100%;
}

.nav {
    justify-content: space-between;
    font-size: var(--text-size-0);
    width: inherit;
    color: inherit;
    cursor: pointer;
    font-weight: 400;
}

.price {
    white-space: nowrap;
    font-weight: 500;
}

.arrow i {
    font-size: var(--text-size-2);
}
</style>