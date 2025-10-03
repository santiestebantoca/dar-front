<script setup>
const props = defineProps({ reporte: Object })

import { ref, computed, inject } from 'vue'

const all = ref(null)
const mobile = inject('app:mobile')
const emit = defineEmits(['operar'])
const btns = computed(() => [
  { label: 'OPERACIONES', color: 'success', click: () => emit('operar') },
  ...!mobile.value
    ? [{
      label: all.value ? 'VER MENOS' : 'VER MÁS',
      icon: all.value ? 'arrows-collapse' : 'arrows-expand',
      class: 'text-muted',
      flat: true,
      click: () => all.value = !all.value
    }]
    : [],
])
const values = computed(() => [
  { label: 'Número telefónico', value: props.reporte.numero_telefonico, cls: 'data-title' },
  ...all.value
    ? [
      { label: 'Identifictivo', value: props.reporte.identificativo },
      { label: 'Modelo', value: props.reporte.modelo },
    ] : [],
  { label: 'Alarma', value: props.reporte.codigos_de_alarma },
  { label: 'Estado', value: props.reporte.estados_pendientes },
  { label: 'Dir', value: props.reporte.direccion },
  ...all.value
    ? [
      ...props.reporte.cerradura
        ? [{ label: 'Cerradura', value: props.reporte.cerradura }]
        : [],
      { label: 'Categoría', value: props.reporte.categoria },
      { label: 'Soporte', value: props.reporte.soporte },
      { label: 'Fecha', value: props.reporte.fecha_averia_sigetp.slice(0, -3) },
      { label: 'Tiempo', value: props.reporte.tiempo },
    ] : [],
])
const history = ref(false)
</script>

<template>
  <div class="card border-0 bg-light" :class="{ mobile }" @click="mobile && (all = !all)">
    <div class="card-body">
      <div v-for="{ label, value, cls } in values" :class="cls" class="data">
        <label v-text="label" />
        <span v-text="value" />
      </div>
      <div class="hstack gap-2 mt-4" @click.stop>
        <bs-btn v-for="btn in btns" v-bind="btn" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile>.card-body {
  padding-left: 8px;
  padding-top: 8px;
  padding-right: 8px;
}

/** .data */

.data {
  margin-bottom: 8px;
}

.data label::after {
  content: ":";
  margin-right: 4px;
}

.data.data-title {
  font-weight: 600;
}

.data:not(.data-title) label {
  color: var(--bs-gray);
}

.data:not(.data-title) label::before {
  content: '- ';
}

/** .clock-icon */

.return-icon {
  margin-right: 4px;
  color: var(--bs-teal);
}
</style>
