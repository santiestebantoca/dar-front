<script setup>
const props = defineProps({ outdated: Boolean })
</script>

<template>
  <bs-btn-footer label="Actualizar" icon="arrow-clockwise" :class="{ outdated }" />
</template>

<style scoped>
.btn.outdated {
  color: var(--bs-danger) !important;
  background: rgba(var(--bs-danger-rgb), .1);
}
</style>