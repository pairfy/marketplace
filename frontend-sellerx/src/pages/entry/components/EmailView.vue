<template>
  <div class="card">
    <div class="title">Please verify email</div>

    <div class="subtitle">Check your spam box or all</div>

    <div class="circle-icon">
      <i class="pi pi-envelope" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
.card {
  background: var(--base-a);
  padding: 1.5rem;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-icon {
  margin: 1rem 0;
  width: 300px;
  height: 300px;
  color: var(--blue);
  background: var(--base-b);
  border-radius: 50%;
  justify-content: center;
  display: flex;
  align-items: center;
}

.circle-icon i {
  font-size: 100px;
  font-weight: 100;
  color: var(--blue-s);
}

.title {
  font-weight: 700;
  font-size: var(--text-size-g);
  text-align: left;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: var(--text-size-d);
  text-align: left;
  color: var(--text-b);
}
</style>
