<template>
    <div class="message">
        <div class="bubble" v-tooltip.left="date">
            {{ props.data.content }}
            <span class="marker" :class="{ seen: props.data.seen }"></span>
        </div>
    </div>
</template>

<script setup>
import { inject, computed } from 'vue';

const { convertDate } = inject('utils');

const date = computed(() => convertDate(props.data.created_at, 2))

const props = defineProps(['data'])


</script>

<style lang="css" scoped>
.message {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.bubble {
    padding: 1rem;
    border-radius: 12px;
    border-bottom-right-radius: 0px;
    background: var(--primary-a);
    position: relative;
    box-sizing: border-box;
    color: var(--text-w);
}

.marker {
    font-size: var(--text-size-0);
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 4px;
    height: 4px;
    background: var(--text-b);
    opacity: 0;
    border-radius: 3px;
}

.marker.seen {
    opacity: 0.5;
    background: #ffffff;
}
</style>