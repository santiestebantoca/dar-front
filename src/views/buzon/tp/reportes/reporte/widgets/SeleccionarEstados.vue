<script setup>
const value = defineModel()

import SelectWidget from './Select.vue'
import useStore from '@/stores/buzon-tp'
import { computed, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore().reporte.options
const options = computed(() => (store.data.estados || []).map(d => ({
  ...d,
  alias: mobile.value ? d.display_name.slice(14) : d.display_name
})))
</script>

<template>
  <div>
    <label class="my-1 small fw-semibold">Causa pendiente</label>
    <SelectWidget v-model="value" :options="options" />
  </div>
</template>

<style scoped></style>
