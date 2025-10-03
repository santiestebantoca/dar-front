<script setup>
const value = defineModel()

import useDespachador from '@/stores/despachador'
import { computed, inject } from 'vue'

const mobile = inject('app:mobile')
const despachador = useDespachador()
const grupos = computed(() => despachador.grupos.data)
</script>

<template>
  <div :class="{ mobile, large: !mobile }" class="x">
    <bs-checkbox v-for="grupo in grupos" :value="grupo.nombre" :label="grupo.nombre" v-model="value" flat />
  </div>
</template>

<style scoped>
.x {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.25rem;
  color: var(--bs-success);
}

.large {
  /* 
   */
  margin: .25rem;
  padding: .5rem;
  border-radius: 5px;
  /* background-color: var(--bs-light); */
  border: solid 1px rgba(var(--bs-success-rgb), .3);
}
</style>