
<script>
import { Icon } from "@iconify/vue";

export default { components: { Icon } };
</script>

<template>
  <div class="full-page-spinner" aria-label="loading">
    <Icon
      icon="feather:rotate-ccw"
      color="green"
      :rotate="1"
      width="100"
      style="animation: spin 1s linear infinite"
      :horizontalFlip="true"
      aria-label="loading"
    />
  </div>
</template>

<style lang="scss" scoped>
.full-page-spinner {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
}
</style>>

