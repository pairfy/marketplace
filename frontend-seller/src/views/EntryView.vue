<template>
    <div class="entry">
        <Toast />
        <Dialog v-model:visible="dialogLayout" modal header="Message" :style="{ width: '25rem' }">
            <div class="dialog">
                <span>{{ dialogMessage }}</span>
            </div>

            <template #footer>
                <div>
                    <Button type="button" label="Done" @click="closeRegister" />
                </div>
            </template>
        </Dialog>

        <div class="entry-left">
            <div class="card">
                <div class="logo">
                    <img src="@/assets/logo-white.png" alt="">
                </div>
                <div class="logan">
                    <span> Buy and sell products in Cardano.</span>
                </div>
                <div class="subtext">
                    <span>Discover the largest native P2P marketplace where you can trade everything with ADA.</span>
                </div>
            </div>

            <div class="visual">
                <ul class="circles">
                    <li>
                        <img src="@/assets/lace.svg" alt="">
                    </li>
                    <li>
                        <img src="@/assets/eternl.png" alt="">
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li>
                        <img src="@/assets/vespr.png" alt="">
                    </li>
                    <li>
                        <img src="@/assets/daedalus.svg" alt="">
                    </li>
                    <li></li>
                    <li> <img src="@/assets/nami.svg" alt=""></li>
                    <li></li>
                </ul>
            </div>
        </div>

        <div class="entry-right">
            <!--LOGIN-->
            <div v-if="currentMode === 'login'" class="form">
                <div class="title">
                    <span>Welcome back!</span>
                    <span>Start managing your inventory</span>
                </div>

                <div class="email">
                    <IftaLabel>
                        <InputText id="email" v-model="loginForm.email" type="email" autofocus fluid 
                            placeholder="" style=" font-size: var(--text-size-a)" />
                        <label for="email">Email</label>
                    </IftaLabel>
                </div>

                <div class="password">
                    <Fluid>
                        <IftaLabel>
                            <Password v-model="loginForm.password" inputId="password"  toggleMask
                                :feedback="false" :inputStyle="{ fontSize: 'var(--text-size-a)' }" />
                            <label for="password">Password</label>

                        </IftaLabel>
                    </Fluid>
                </div>


                <div class="legend">
                    <span @click="navigateTo('recovery')">Forgot password?</span>
                </div>

                <div class="control">
                    <Button label="Login" fluid style=" font-size: var(--text-size-a);" @click="doLogin" />
                </div>

                <Divider layout="horizontal" fluid style=" font-size: var(--text-size-a); margin-top: 2rem; "><b>or</b>
                </Divider>

                <div class="bottom">
                    Don't you have an account? <span @click="navigateTo('register')">Sign Up</span>
                </div>
            </div>
            <!--LOGIN-->



            <!--REGISTER-->
            <div v-if="currentMode === 'register'" class="form">
                <div class="title">
                    <span>New Account.</span>
                    <span>Start managing your inventory</span>
                </div>

                <div class="email">
                    <IftaLabel>
                        <InputText id="email" v-model="registerForm.email" type="email" autofocus fluid variant="filled"
                            style=" font-size: var(--text-size-a)" placeholder="you@example.com" />
                        <label for="email">Email</label>
                    </IftaLabel>
                </div>

                <div class="username">
                    <IftaLabel>
                        <InputText id="username" v-model="registerForm.username" type="text" fluid variant="filled"
                            style=" font-size: var(--text-size-a)" v-keyfilter="/^[a-z0-9]+$/" />
                        <label for="username">Username</label>
                    </IftaLabel>
                </div>


                <div class="password">
                    <Fluid>
                        <IftaLabel>

                            <Password v-model="registerForm.password" inputId="password" toggleMask
                                :feedback="true" :inputStyle="{ fontSize: 'var(--text-size-a)' }">

                                <template #header>
                                    <div style="font-size: var(--text-size-a);">Pick a password</div>
                                </template>
                                <template #footer>
                                    <Divider />
                                    <ul style="font-size: var(--text-size-a);">
                                        <li>At least one lowercase</li>
                                        <li>At least one uppercase</li>
                                        <li>At least one numeric</li>
                                        <li>Minimum 8 characters</li>
                                    </ul>
                                </template>

                            </Password>

                            <label for="password">Password</label>

                        </IftaLabel>
                    </Fluid>
                </div>

                <div class="country">
                    <Select v-model="registerForm.country" :options="countries" filter optionLabel="name"
                        placeholder="Select a Country" fluid style='font-size: var(--text-size-a);' >
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="country-item">
                                <img :alt="slotProps.value.label" src="@/assets/flag_placeholder.png"
                                    :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
                                    style="width: 18px" />
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>

                        <template #dropdownicon>
                            <i class="pi pi-map-marker" />
                        </template>
                        <template #option="slotProps">
                            <div class="country-item">
                                <img :alt="slotProps.option.label" src="@/assets/flag_placeholder.png"
                                    :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
                                    style="width: 18px" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="terms">
                    <Checkbox v-model="registerForm.terms_accepted" binary />
                    <span>I accept the
                        <a href="">Terms of Use</a> and <a href="">Privacy Policies.</a>
                    </span>
                </div>

                <div class="control">
                    <Button label="Sign Up" fluid style=" font-size: var(--text-size-a);" @click="doRegister" />
                </div>

                <Divider layout="horizontal" fluid style=" font-size: var(--text-size-a); margin-top: 2rem; "><b>or</b>
                </Divider>

                <div class="bottom">
                    Do you have an account? <span @click="navigateTo('login')">Sign In</span>
                </div>
            </div>
            <!--REGISTER-->
            <!--RECOVER-->
            <div v-if="currentMode === 'recovery'" class="form">
                <div class="title">
                    <span>Restore Your Account.</span>
                    <span>Receive a recovery email.</span>
                </div>

                <div class="email">
                    <IftaLabel>
                        <InputText id="email" v-model="recoveryForm.email" type="email" autofocus fluid variant="filled"
                            style=" font-size: var(--text-size-a)" />
                        <label for="email">Email</label>
                    </IftaLabel>
                </div>


                <div class="control">
                    <Button label="Submit" fluid style=" font-size: var(--text-size-a);" />
                </div>

                <Divider layout="horizontal" fluid style=" font-size: var(--text-size-a); margin-top: 2rem; "><b>or</b>
                </Divider>

                <div class="bottom">
                    Don't you have an account? <span @click="navigateTo('register')">Sign Up</span>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import dashboardAPI from '@/views/api/index';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";

const toast = useToast();

const { loginUser, createUser } = dashboardAPI();

const loginForm = ref({
    email: "",
    password: ""
});

const countries = ref([
    { name: 'Colombia', code: 'CO' },
    { name: 'United States', code: 'US' }
]);

const registerForm = ref({
    email: "",
    username: "",
    password: "",
    country: "",
    terms_accepted: false
});

const recoveryForm = ref({
    email: ""
});

const router = useRouter()

const route = useRoute()

const layoutModes = ["register", "login", "recovery", "confirmation"];

let currentMode = ref('login');

const setupRoute = (mode) => {
    if (!mode || !layoutModes.includes(mode)) {
        (currentMode = "login")
        return navigateTo("login");
    }

    currentMode = mode;
}

watch(
    () => route.query,
    (e) => setupRoute(e.mode),
    { immediate: true }
);

const showSuccess = (content) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: content, life: 3000 });
};

const showError = (content) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: content, life: 3000 });
};

const dialogLayout = ref(false);

let dialogMessage = ref("");

const showDialog = (e) => {
    dialogLayout.value = e;
};

const closeRegister = () => {
    showDialog(false);
    navigateTo('login');
};

const doLogin = async () => {
    const { ok, response } = await loginUser(loginForm.value);

    if (ok) {
        router.push({
            name: 'home',
            query: {
            },
        })
    } else {
        showError(response.errors.map(item => item.message))
    }
}

const doRegister = async () => {
    const { ok, response } = await createUser(registerForm.value);

    if (ok) {
        dialogMessage.value = "Please check the verification email."
        showDialog(true);
    } else {
        showError(response.errors.map(item => item.message))
    }
}

function navigateTo(mode) {
    router.push({
        name: 'entry',
        query: {
            mode
        },
    })
}



</script>

<style lang="css" scoped>
::v-deep(.p-button-label) {
    font-weight: 600;
}

::v-deep(.p-divider-content) {
    color: var(--text-b);
}

.dialog {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.dialog span {
    line-height: 3rem;
}

.entry {
    display: flex;
    height: 100vh;
}

.entry-left {
    width: 30%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--primary-a);
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    padding: 3rem;
}

.logo {
    padding: 1rem;
}

.logan {
    font-weight: 600 !important;
    font-size: var(--text-size-g);
    padding: 1rem;
    color: var(--text-w);
    font-kerning: normal;
    border-radius: 1rem;
    margin-top: 2rem;

}

.subtext {
    font-size: var(--text-size-d);
    color: var(--text-w);
    padding: 1rem;
    margin-top: 1rem;
}

.visual {
    width: 100%;
    height: 100vh;
    position: absolute;
}

.circles {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.circles li img {
    width: 100%;
    padding: 10%;
    border-radius: 2rem;
}

.circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
}


.circles li:nth-child(2) {
    left: 10%;
    width: 40px;
    height: 40px;
    animation-delay: 2s;
    animation-duration: 12s;
}

.circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
}

.circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
}

.circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6) {
    left: 75%;
    width: 100px;
    height: 100px;
    animation-delay: 3s;
}

.circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9) {
    left: 20%;
    width: 40px;
    height: 40px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}

@keyframes animate {

    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }

    100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }

}

.entry-right {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form {
    min-width: 325px;
    min-height: 600px;
}

.title {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
}

.title span:nth-child(1) {
    font-size: var(--text-size-d);
    font-weight: 600;
}

.title span:nth-child(2) {
    color: var(--text-b);
    font-size: var(--text-size-a);
}

.username {
    margin-top: 2rem;
}

.password {
    margin-top: 2rem;
}

.country {
    margin-top: 2rem;
}

.legend {
    display: flex;
    justify-content: flex-end;
    color: var(--primary-c);
    font-size: var(--text-size-a);
    line-height: 3rem;
}

.legend span {
    font-weight: 600;
    cursor: pointer;
}

.terms {
    margin-top: 2rem;
}

.terms span {
    margin-left: 1rem;
    font-size: var(--text-size-a);
    color: var(--text-b);
}

.control {
    margin-top: 2rem;
}

.bottom {
    font-size: var(--text-size-a);
    color: var(--text-b);
    font-weight: 600;
    text-align: center;
}

.bottom span {
    color: var(--primary-c);
    margin-left: 0.5rem;
    cursor: pointer;
}

.country-item {
    display: flex;
    align-items: center;
}

.country-item div {
    margin-left: 0.5rem;
}
</style>