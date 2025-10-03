<script setup>
const value = defineModel()

import useStore from '@/stores/buzon-tp'
import { computed, watch } from 'vue'

const store = useStore().reporte.options
const options = computed(() => [
  { value: '', display_name: '---------' },
  ...(store.data.mantenimiento || [])
])
watch(value, val => !val && (value.value = ''), { immediate: true })
</script>

<template>
  <div style="max-width: fit-content;">
    <label class="my-1 small fw-semibold">Mantenimiento</label>
    <bs-select v-model="value" :options="options" optionLabel="display_name" />
  </div>
</template>

<style scoped></style>
