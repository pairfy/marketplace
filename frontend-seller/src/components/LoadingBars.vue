<template>
  <div class="p-loading">
   <div class="p-loading-wrap">
    <span class="bars"/>
   </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
.p-loading{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  position: absolute;
}

.p-loading-wrap{
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bars {
  width: 8px;
  height: 40px;
  display: inline-block;
  position: relative;
  left: calc(50% - 90px);
  top: 0;
  border-radius: 4px;
  color: var(--base-c);
  box-sizing: border-box;
  animation: animbars 0.6s linear infinite;
}

@keyframes animbars {
  0% {
    box-shadow: 20px -10px, 40px 10px, 60px 0px;
  }
  25% {
    box-shadow: 20px 0px, 40px 0px, 60px 10px;
  }
  50% {
    box-shadow: 20px 10px, 40px -10px, 60px 0px;
  }
  75% {
    box-shadow: 20px 0px, 40px 0px, 60px -10px;
  }
  100% {
    box-shadow: 20px -10px, 40px 10px, 60px 0px;
  }
}
</style>
