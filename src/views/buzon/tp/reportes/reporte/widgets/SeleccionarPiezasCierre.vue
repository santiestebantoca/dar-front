<script setup>
const value = defineModel()

import SelectWidget from './Select.vue'
import useStore from '@/stores/buzon-tp'
import { computed } from 'vue'

const store = useStore().reporte.options
const options = computed(() => store.data.piezas_cierre)
</script>

<template>
  <div>
    <label class="my-1 small fw-semibold">Pieza</label>
    <SelectWidget v-model="value" :options="options" />
  </div>
</template>

<style scoped></style>
