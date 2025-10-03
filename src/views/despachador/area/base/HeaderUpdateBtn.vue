<script setup>
const props = defineProps({ outdated: Boolean })
</script>

<template>
  <bs-btn-icon size="26px" square :flat="!outdated" :color="outdated && 'danger'" :class="{ outdated }">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-clockwise"
      viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
    </svg>
    <span class="small mx-2">Actualizar</span>
    <bs-tooltip placement="bottom" offset="0,10">Actualizar</bs-tooltip>
  </bs-btn-icon>
</template>

<style scoped>
.btn:not(.outdated) {
  color: var(--bs-gray-700);
  background-color: var(--bs-gray-400);
}
</style>