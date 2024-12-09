<template>
  <div class="card">
    <Dialog
      v-model:visible="messageModalVisible"
      modal
      header="Message"
      :draggable="false"
      :style="{ width: '35rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <p>{{ messageModal }}</p>

      <p v-for="e in errorModal" :key="e">{{ e }}</p>

      <template #footer>
        <div class="modal-footer">
          <Button type="button" label="Ok" @click="hideModals" />
        </div>
      </template>
    </Dialog>

    <!----->
    <div class="title">Sign In</div>

    <div class="field">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-envelope" />
        </InputGroupAddon>
        <InputText
          placeholder="Email"
          v-model="email"
          :class="{ invalid: invalidEmail }"
        />
      </InputGroup>
    </div>

    <div class="field">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock" />
        </InputGroupAddon>
        <Password
          v-model="password"
          placeholder="Password"
          toggleMask
          :feedback="false"
        />
      </InputGroup>
    </div>

    <Button type="submit" label="Login" class="button" @click="handleSubmit" />

    <div class="legend">
      <span @click="handleMode('register')">Create an account</span>
      <span @click="handleMode('recovery')">Reset password</span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import entryAPI from "@/pages/entry/api/index";

export default {
  setup() {
    const email = ref(null);
    const password = ref(null);

    const { loginUser  } = entryAPI();

    const messageModalVisible = ref(false);
    const messageModal = ref(null);
    const errorModal = ref(null);

    const invalidEmail = ref(false);

    return {
      email,
      password,
      loginUser,
      invalidEmail,
      messageModalVisible,
      messageModal,
      errorModal,
    };
  },
  methods: {
    handleMode(e) {
      this.$router
        .push({ name: "entry", query: { mode: e } })
        .then(() => window.location.reload(true))
        .catch((err) => {
          if (err.name !== "NavigationDuplicated") {
            throw err;
          }
        });
    },
    hideModals() {
      this.messageModalVisible = false;
    },
    handleMessage(type, message) {
      this.messageModalVisible = true;

      console.log(type, message);

      if (type === "response") {
        this.messageModal = message.response.message;
      }
      if (type === "error") {
        this.errorModal = message.response.errors;
      }
    },

    async handleSubmit() {
      this.invalidEmail = !this.validateEmail(this.email);

      const params = {
        email: this.email,
        password: this.password,
      };

      console.log(params);

      await this.loginUser(params)
        .then(() => {
          this.$router.push({ name: "dashboard" }).catch((err) => {
            if (err.name !== "NavigationDuplicated") {
              throw err;
            }
          });
        })
        .catch((err) => this.handleMessage("error", err));
    },
    validateEmail(value) {
      const emailInput = value;
      const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(emailInput);
    },
  },
};
</script>
<style src="../assets/flags.css" />

<style lang="css" scoped>
.legend span:hover {
  text-decoration: underline;
}

.invalid {
  border: 1px solid red;
}
.card {
  background: var(--base-a);
  padding: 1.5rem;
  border-radius: 18px;
  display: block;
}

.field {
  margin: 1rem 0;
  width: 300px;
}

.button {
  width: 100%;
  margin-top: 1rem;
}

.title {
  font-weight: 700;
  font-size: var(--text-size-g);
  text-align: left;
  margin-bottom: 2rem;
}

.legend {
  text-align: left;
  font-size: var(--text-size-b);
  cursor: pointer;
  color: var(--blue-c);
  margin-top: 1rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
}

.legend span {
  margin-top: 0.75rem;
}

p {
  font-size: var(--text-size-a);
  line-height: 1.75;
  margin: 0 !important;
}

ul {
  font-size: var(--text-size-a);
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
}

.dropdown-item div {
  margin-left: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
}

.modal-footer button {
  margin-left: 1rem;
}
</style>
