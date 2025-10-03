<script setup>
import { inject } from 'vue'

const mobile = inject('app:mobile')
</script>

<template>
  <div class="overview" :class="{ mobile, large: !mobile }">
    <slot />
  </div>
</template>

<style scoped>
.mobile {
  --overview-padding: 4px;
}

.large {
  --overview-padding: 4px 16px;
}

.overview {
  padding: var(--overview-padding);
  background: var(--gg-light-2);
  display: flex;
  align-items: center;
  column-gap: 16px;
  min-height: 54px;
}
</style>