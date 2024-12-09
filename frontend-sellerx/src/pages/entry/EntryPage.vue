<template>
  <div class="entry">
    <RegisterView v-if="mode === 'register'" />
    <LoginView v-if="mode === 'login'" />
    <RecoveryView v-if="mode === 'recovery'" />
    <EmailView v-if="mode === 'email'" />
  </div>
</template>

<script>
import RegisterView from "@/pages/entry/components/RegisterView";
import LoginView from "@/pages/entry/components/LoginView.vue";
import RecoveryView from "@/pages/entry/components/RecoveryView.vue";
import EmailView from "@/pages/entry/components/EmailView.vue";

export default {
  components: {
    RegisterView,
    LoginView,
    RecoveryView,
    EmailView
  },
  data() {
    return {
      mode: "register",
    };
  },
  created() {
    this.$watch(
      () => this.$route.query,
      (e) => this.main(e),
      { immediate: true }
    )();
  },
  methods: {
    main(e) {
      console.log(e);

      const modes = ["register", "login", "recovery", "email"];

      if (!e.mode) {
        return (this.mode = "register");
      }

      if (!modes.includes(e.mode)) {
        return (this.mode = "register");
      }

      this.mode = e.mode;
    },
  },
};
</script>

<style lang="css" scoped>
.entry {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--blue-a);
  height: 100vh;
}
</style>
