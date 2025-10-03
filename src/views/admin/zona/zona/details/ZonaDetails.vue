<script setup>
const props = defineProps({ back: Function })

import Actions from './DetailsActions.vue'
import useStore from '@/stores/admin-zonas'
import { computed } from 'vue'

const store = useStore().zona
const data = computed(() => store.data)
const data_ = computed(() => [
  { label: 'Nombre', value: data.value.nombre },
  { label: 'Descripción', value: data.value.descripcion },
  { label: 'Pertenece al área ', value: data.value.area.nombre },
  { label: 'Descripción del área', value: data.value.area.descripcion },
  { label: 'El área pertenece al territorio', value: data.value.area.territorio },
])
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <Actions class="ms-auto" />
    </div>
    <div v-for="{ label, value, cls } in data_" :key="value">
      <label v-text="label" class="data-label" />
      <div v-text="value" :class="cls" class="data-value" />
    </div>
    <router-view />
  </div>
</template>