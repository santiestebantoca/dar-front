<script setup>
const props = defineProps({ reporte: Object })

import { ref, computed, inject } from 'vue'

const all = ref(null)
const mobile = inject('app:mobile')
const emit = defineEmits(['cerrar'])
const btns = computed(() => [
  { label: 'CERRAR', color: 'success', click: () => emit('cerrar') },
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
  { label: 'FOLIO', value: props.reporte.folio, cls: 'data-title' },
  { label: 'Servicio', value: props.reporte.telefono },
  { label: 'Cliente', value: props.reporte.nombre },
  { label: 'Dir', value: props.reporte.direccion },
  ...all.value
    ? [
      { label: 'CL', value: props.reporte.cl },
      ...props.reporte.cableP
        ? [{ label: 'Red P', value: RedPString(props.reporte) }]
        : [],
      ...props.reporte.cableS
        ? [{ label: 'Red S', value: RedSString(props.reporte) }]
        : [],
      { label: 'Rango T', value: `${props.reporte.inicio} ~ ${props.reporte.fin}` }
    ] : [],
  { label: 'Problema', value: props.reporte.problema },
  { label: 'Prueba', value: props.reporte.prueba },
  { label: 'Grupo', value: props.reporte.grupo },
  ...all.value
    ? [
      { label: 'Demora Total', value: props.reporte.demorat },
      ...props.reporte.observacion
        ? [{ label: 'Observación', value: props.reporte.observacion }]
        : [],
      ...props.reporte.telfloca
        ? [{ label: 'Localización', value: props.reporte.telfloca }]
        : [],
    ] : [],
])
const RedPString = reporte => {
  let res = `C: ${reporte.cableP}`
  if (reporte.parP) res += `, P: ${reporte.parP}`
  if (reporte.terminalP) res += `, T: ${reporte.terminalP}`
  if (reporte.direcciontP) res += `, Dir T: ${reporte.direcciontP}`
  return res
}
const RedSString = reporte => {
  let res = `C: ${reporte.cableS}`
  if (reporte.parS) res += `, P: ${reporte.parS}`
  if (reporte.terminalS) res += `, T: ${reporte.terminalS}`
  if (reporte.direcciontS) res += `, Dir T: ${reporte.direcciontS}`
  return res
}
</script>

<template>
  <div class="card border-0 bg-light" :class="{ mobile }" @click="mobile && (all = !all)">
    <div class="card-body">
      <div v-for="{ label, value, cls } in values" :class="cls" class="data">
        <label v-text="label" />
        <span v-text="value" />
      </div>
      <!-- <template v-if="all">
        <div class="data">
          <label>SMS</label>
          <div class="mb-2 d-md-none" />
          <div v-for="enfecha in reporte.enfecha" class="data ms-2 d-md-inline-block">
            <bs-icon name="arrow-return-right" class="return-icon" />
            <span v-text="enfecha.slice(0, -3)" />
          </div>
        </div>
      </template> -->
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
