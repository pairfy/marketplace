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

    <Dialog
      v-model:visible="termsModalVisible"
      modal
      :draggable="false"
      header="Terms of use"
      :style="{ width: '35rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p>
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
        quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
        eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
        voluptas nulla pariatur?
      </p>
      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est
        laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
        distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
        cumque nihil impedit quo minus id quod maxime placeat facere possimus,
        omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
        quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
        ut et voluptates repudiandae sint et molestiae non recusandae. Itaque
        earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
        voluptatibus maiores alias consequatur aut perferendis doloribus
        asperiores repellat.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <template #footer>
        <div class="modal-footer">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="termsModalVisible = false"
          />
          <Button type="button" label="Save" @click="handleSubmit(true)" />
        </div>
      </template>
    </Dialog>

    <!----->
    <div class="title">Recovery</div>

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
          <i class="pi pi-user" />
        </InputGroupAddon>
        <InputText
          v-model="username"
          placeholder="Username"
          :class="{ invalid: invalidUsername }"
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
          :class="{ invalid: invalidPassword }"
        >
          <template #header>
            <p class="mt-2">Suggestions</p>
          </template>
          <template #footer>
            <Divider />
            <p class="mt-2">Suggestions</p>
            <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
              <li>At least one lowercase</li>
              <li>At least one uppercase</li>
              <li>At least one numeric</li>
              <li>Minimum 8 characters</li>
            </ul>
          </template>
        </Password>
      </InputGroup>
    </div>

    <div class="field">
      <Dropdown
        v-model="selectedCountry"
        :options="countries"
        optionLabel="name"
        placeholder="Operations area"
        :class="{ invalid: invalidCountry }"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="dropdown-item">
            <img
              :alt="slotProps.value.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
            />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="dropdown-item">
            <img
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>
    </div>

    <Button
      type="submit"
      label="Register"
      class="button"
      @click="displayTermsModal"
    />

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
    const username = ref(null);
    const email = ref(null);
    const password = ref(null);

    const { createUser } = entryAPI();

    const selectedCountry = ref(null);

    const countries = ref([
      { name: "United States", code: "US", number: "840" },
      { name: "Chile", code: "CL", number: "152" },
      { name: "Argentina", code: "AR", number: "032" },
      { name: "Venezuela", code: "VE", number: "862" },
      { name: "Colombia", code: "CO", number: "170" },
    ]);

    const termsModalVisible = ref(false);
    const messageModalVisible = ref(false);
    const messageModal = ref(null);
    const errorModal = ref(null);

    const invalidEmail = ref(false);
    const invalidUsername = ref(false);
    const invalidPassword = ref(false);
    const invalidCountry = ref(false);

    return {
      username,
      email,
      password,
      createUser,
      selectedCountry,
      countries,
      termsModalVisible,
      invalidEmail,
      invalidUsername,
      invalidPassword,
      messageModalVisible,
      messageModal,
      invalidCountry,
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
      this.termsModalVisible = false;
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
    displayTermsModal() {
      this.termsModalVisible = !this.termsModalVisible;
    },

    async handleSubmit(isAccepted) {
      this.invalidEmail = !this.validateEmail(this.email);
      this.invalidUsername = !this.validateUsername(this.username);
      this.invalidPassword = !this.validatePassword(this.password);
      this.invalidCountry = !this.validateCountry(this.selectedCountry);

      const form = [
        this.invalidEmail,
        this.invalidUsername,
        this.invalidPassword,
        this.invalidCountry,
      ];

      if (form.includes(true)) {
        return (this.termsModalVisible = false);
      }

      const params = {
        username: this.username,
        email: this.email,
        password: this.password,
        country: this.selectedCountry.number,
        terms_accepted: isAccepted,
      };

      console.log(params);

      await this.createUser(params)
        .then((res) => this.handleMessage("response", res))
        .catch((err) => this.handleMessage("error", err));
    },
    validateEmail(value) {
      const emailInput = value;
      const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(emailInput);
    },
    validateUsername(value) {
      const usernameInput = value;
      const usernameRegex = /^[a-zA-Z0-9]{7,}$/;
      return usernameRegex.test(usernameInput);
    },

    validatePassword(value) {
      const passwordInput = value;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return passwordRegex.test(passwordInput);
    },
    validateCountry(value) {
      return !value ? false : true;
    },
  },
};
</script>
<style src="../assets/flags.css" />

<style lang="css" scoped>
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
  color: var(--blue-a);
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
