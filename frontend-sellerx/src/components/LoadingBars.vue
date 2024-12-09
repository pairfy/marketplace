<template>
  <div class="p-loading">
    <span class="loader"></span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
.p-loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  position: absolute;
  padding: 2rem;
}

.loader {
  width: 34px;
  height: 34px;
  border: 4px solid var(--blue-c);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
