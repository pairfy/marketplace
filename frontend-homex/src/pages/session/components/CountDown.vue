<template>
    <div class="countdown">
        <span>{{ hourDigits[0] }}</span>
        <span>{{ hourDigits[1] }}</span>
        <div>:</div>
        <span>{{ minuteDigits[0] }}</span>
        <span>{{ minuteDigits[1] }}</span>
    </div>
    <div class="note">Time to send the package.</div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { sessionAPI } from "@/pages/session/api";

export default {
    setup() {
        const { getOrderData, returnable } = sessionAPI();

        const hours = ref(0);
        const minutes = ref(0);
        const targetUnixTime = getOrderData.value.status === 'shipping' ? 0 : getOrderData.value.contract_range;

        const updateCountdown = (target) => {
            const timeLeft = target - Date.now();

            if (timeLeft <= 0) {
                clearInterval(intervalId);
                returnable(true)
                return;
            }

            hours.value = Math.floor(timeLeft / (1000 * 60 * 60));

            minutes.value = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        };

        const hourDigits = computed(() => String(hours.value).padStart(2, '0').split(''));
        const minuteDigits = computed(() => String(minutes.value).padStart(2, '0').split(''));

        let intervalId;

        onMounted(() => {
            intervalId = setInterval(() => updateCountdown(targetUnixTime), 1000);
        });

        return {
            hourDigits,
            minuteDigits,
            targetUnixTime
        }
    }
}
</script>

<style lang="css" scoped>
.countdown {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 2rem;
    font-weight: 700;
    font-size: var(--text-size-a);
}

.countdown span {
    background: var(--text-a);
    border-radius: 6px;
    width: 30px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.25rem;
    color: var(--text-w);
    border: 1px solid transparent;
}

.countdown div {
    margin: 0 0.5rem;
}

.note {
    padding: 1rem;
    font-size: var(--text-size-c);
}
</style>