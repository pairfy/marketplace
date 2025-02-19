<template>
    <Dialog v-model:visible="dialogVisible" modal :style="{ width: '25rem' }" :draggable="false" :closable="false">
        <template #header>
            <span class="dialog-header flex">
                Deliver to
                <i class="pi pi-map-marker" />
            </span>
        </template>
        <div class="body">
            <Message severity="secondary">
                Hello Cardano Community, currently there is only logistics for the USA.
                The other countries will be added progressively.
            </Message>

            <div class="dialog-row">
                <IftaLabel>
                    <Select v-model="selectedCountry" :options="countriesOptions" filter optionLabel="name" fluid
                        id="country" scrollHeight="30rem" @change="onCountrychange">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="item flex">
                                <img :alt="slotProps.value.code" src="@/assets/flag_placeholder.png"
                                    :class="`flag flag-${slotProps.value.code.toLowerCase()}`" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex">
                                <img :alt="slotProps.option.label" src="@/assets/flag_placeholder.png"
                                    :class="`flag flag-${slotProps.option.code.toLowerCase()}`" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Select>
                    <label for="country">Country</label>
                </IftaLabel>
            </div>

            <div class="dialog-row">
                <IftaLabel>
                    <InputText id="city" v-model="selectedCity" fluid v-keyfilter="/^[a-zA-Z0-9 ]*$/" />
                    <label for="city">City</label>
                </IftaLabel>
            </div>

            <div class="dialog-row">
                <IftaLabel>
                    <InputText id="postal" v-model="selectedPostal" fluid v-keyfilter="/^[a-zA-Z0-9- ]*$/" />
                    <label for="postal">ZIP/Postal</label>
                </IftaLabel>
            </div>


        </div>
        <div class="dialog-footer flex">
            <Button type="button" label="Save" :disabled="disableSave" @click="onSaveLocation"
                style="color: var(--text-w)" />
        </div>
    </Dialog>

    <div class="location flex" @click="dialogVisible = true">
        <div class="icon flex">
            <i class="pi pi-map-marker" />
        </div>
        <div class="box">
            <span class="flex">Deliver to
                <img :alt="getLocationData?.country" src="@/assets/flag_placeholder.png"
                    :class="`flag flag-${getLocationData?.country.toLowerCase()} flag-mini`" />
            </span>
            <span>{{ getLocationData?.name }}</span>
        </div>
    </div>
</template>

<script setup>
import headerAPI from '@/components/header/api/index';
import { onBeforeUnmount, ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const { getLocationData } = headerAPI();

const dialogVisible = ref(false);

const defaultCountry = { name: 'United States', code: 'US' }

const selectedCountry = ref(defaultCountry);

const selectedCity = ref(null);

const selectedPostal = ref(null);

const watchLocation = watch(getLocationData, (data) => {
    if (data) {
        selectedCountry.value = { name: data.name, code: data.country }

        selectedCity.value = data.city

        selectedPostal.value = data.postal
    }
},
    { immediate: true }
)

const countriesOptions = ref([
    { name: 'United States', code: 'US' }
]);

const disableSave = computed(() => {
    if (selectedCountry.value.code === 'US' || selectedCountry.value.code === 'CO') {
        return false
    }

    return true
})

const onCountrychange = () => {
    selectedCity.value = null
    selectedPostal.value = null
}

const onSaveLocation = () => {
    let currentRoute = router.currentRoute.value;

    let scheme = { city: selectedCity.value, region: null, country: selectedCountry.value.code, postal: selectedPostal.value, name: selectedCountry.value.name }

    localStorage.setItem('location', JSON.stringify(scheme))

    dialogVisible.value = false

    if (scheme.country.toLowerCase() === currentRoute.params.country) {
        location.reload()
    } else {
        router.push({
            name: currentRoute.name,
            params: {
                ...currentRoute.params,
                country: selectedCountry.value.code.toLowerCase()
            },
            query: currentRoute.query
        });
    }
}

const setupLocation = () => {
    let result = localStorage.getItem('location');

    if (!result) {
        dialogVisible.value = true
    }
}

onMounted(() => {
    setupLocation()
})

onBeforeUnmount(() => {
    watchLocation()
})
</script>

<style lang="css" scoped>
.location {
    height: 42px;
    color: inherit;
    white-space: nowrap;
    text-align: start;
    margin: 0 auto;
    cursor: pointer;
}

.icon {
    width: 30px;
    height: inherit;
}

.icon i {
    font-size: var(--text-size-3);
}

.box {
    display: flex;
    flex-direction: column;
}

.box span img {
    margin-left: 0.5rem;
}

.box span:nth-child(1) {
    font-size: var(--text-size-0);
}

.box span:nth-child(2) {
    font-size: var(--text-size-0);
}

.body {
    height: 500px;
}

.flag {
    width: 1.5rem;
    margin-right: 1rem;
}

.flag-mini {
    width: 1.25rem;
}

.dialog-row {
    margin-top: 1rem;
}

.dialog-footer {
    justify-content: flex-end;
}

.dialog-footer button {
    margin-left: 1rem;
}

.dialog-header {
    font-weight: 600;
    padding: 0.5rem 0;
}

.dialog-header i {
    margin-left: 0.5rem;
}
</style>