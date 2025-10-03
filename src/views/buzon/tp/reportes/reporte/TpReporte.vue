<script setup>
const props = defineProps({
  id: String,
  back: Function,
})

import SeleccionarEstados from './widgets/SeleccionarEstados.vue'
import SeleccionarPiezasPendientes from './widgets/SeleccionarPiezasPendientes.vue'
import SeleccionarCierre from './widgets/SeleccionarCierre.vue'
import SeleccionarPiezasCierre from './widgets/SeleccionarPiezasCierre.vue'
import SeleccionarMantenimiento from './widgets/SeleccionarMantenimiento.vue'
import SeleccionarPiezasMantenimiento from './widgets/SeleccionarPiezasMantenimiento.vue'
import useSnackbar from '@/stores/snackbar'
import useStore from '@/stores/buzon-tp'
import { computed, ref, inject } from 'vue'

const loading = inject('app:loading')
const mobile = inject('app:mobile')
const store = useStore().reporte
const form = ref({ // los valores por defecto son los del get
  estados: [], // Show in `Pendiente` UI
  piezas_pendientes: [], // Show in `Pendiente` UI
  cierre: '', // API (Boolean) / sigetp control: {'', '1'}
  mantenimiento: [], // Show in `Mantenimiento` UI
  piezas_cierre: [], // Show in `Cierre` UI
  piezas_mtto: [] // Show in `Mtto` UI
})
const dialog = ref(null)
const sending = ref(null)
const tab = ref(null)
const tabs = computed(() => {
  const showPendiente = !store.data.borrado_de_alarma
  const showCierre = store.data.borrado_de_alarma
    || store.data.codigos_de_alarma?.split('-').some(d => !isNaN(d))
  return [
    ...showPendiente ? [{ name: 'pendiente', label: 'Pendiente' }] : [],
    ...showCierre ? [{ name: 'cierre', label: 'Cierre' }] : [],
    { name: 'mtto', label: mobile.value ? 'Mtto' : 'Mantenimiento' },
  ]
})
const init = () => {
  if (store.data.id) { // If `id` doesn't exist, store.data = {}
    // `Pendiente` UI
    form.value.estados = estadosValues(store.data.estados)
    form.value.piezas_pendientes = piezas_pendientesValues(store.data.piezas_pendientes)
    // `Cierre` UI
    form.value.piezas_cierre = piezas_cierreValues(store.data.piezas_cierre) // may be unnecessary
    // `Mantenimiento` UI
    form.value.piezas_mtto = piezas_mttoValues(store.data.piezas_mtto) // may be unnecessary
    form.value.mantenimiento = store.data.mantenimiento // may be unnecessary
    //
    const showPendiente = !store.data.borrado_de_alarma
    tab.value = showPendiente ? 'pendiente' : 'cierre'
    dialog.value = true
  }
  else {
    const snackbar = useSnackbar()
    snackbar.add({
      text: 'Avería no existe',
      color: 'danger',
      icon: 'exclamation-triangle-fill'
    })
    loading.value++
    useStore().reportes
      .get() // update `reportes`
      .then(() => loading.value--)
    props.back()
  }
  loading.value--
}
// str to values
const estadosValues = strVal => {
  const discarded = ['PENDIENTE POR VISITAR', 'PENDIENTE POR FRAUDE EN CIERRE ANTERIOR']
  return strVal
    ? strVal
      .replace(', ', ', PENDIENTE POR ') // from the second element, they does'nt send `PENDIENTE POR ` 
      .split(', ')
      .filter(name => !discarded.includes(name)) // discarded are not associated to any value
      .map(name => store.options.data.estados.find(d => d.display_name === name).value)
    : []
}
const piezas_pendientesValues = strVal => strVal
  ? strVal
    .split(', ')
    .map(name => store.options.data.piezas_pendientes.find(d => d.display_name === name).value)
  : []
const piezas_cierreValues = strVal => strVal
  ? strVal
    .split(', ')
    .map(name => store.options.data.piezas_cierre.find(d => d.display_name === name).value)
  : []
const piezas_mttoValues = strVal => strVal
  ? strVal
    .split(', ')
    .map(name => store.options.data.piezas_mtto.find(d => d.display_name === name).value)
  : []
//
loading.value++
Promise.all([
  store.get(props.id),
  store.options.get(props.id)
]).then(init)
const headerData = computed(() => ([
  { label: 'Número telefónico', value: store.data.numero_telefonico },
  { label: 'Identificativo', value: store.data.identificativo },
  { label: 'Modelo', value: store.data.modelo },
  { label: 'Zona', value: store.data.zona },
]))
const pendienteData = computed(() => ([
  { label: 'Borrado de alarma', value: store.data.borrado_de_alarma ? 'True' : 'False' },
  { label: 'Código de alarma', value: store.data.codigos_de_alarma },
]))
// const cierreData = computed(() => ([
//   { label: 'Borrado de alarma', value: store.data.borrado_de_alarma ? 'True' : 'False' },
//   { label: 'Código de alarma', value: store.data.codigos_de_alarma },
// ]))
const result = ref(null)
const submit = () => {
  sending.value = true
  store.put({ id: props.id, data: form.value })
    .then(res => {
      result.value = res.data
      Promise.all([
        store.get(props.id),
        useStore().reportes.get()
      ]).then(props.back)
    })
    // .then(res => process.PUT(res.data,
    //   () => {
    //     Promise.all([
    //       store.get(props.id),
    //       useStore().reportes.get()
    //     ]).then(props.back)
    //   },
    //   errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="back" full>
    <div v-if="mobile" class="dialog-header">
      <bs-btn-back @click="dialog = false" />
      <span v-text="store.data.numero_telefonico" />
    </div>
    <bs-dialog-header v-else label="Operaciones" />
    <bs-dialog-body :class="{ mobile, large: !mobile }">
      <div v-if="!mobile" class="data-section mb-4">
        <div v-for="{ label, value } in headerData" class="data">
          <label v-text="label" class="data-label" />
          <div class="form-control disabled" v-text="value" />
        </div>
      </div>
      <bs-tabs v-model="tab" :bs="!mobile" class="mb-3">
        <bs-tab v-for="{ name, label } in tabs" :name="name" :label="label" />
      </bs-tabs>
      <bs-tab-content v-model="tab" style="max-width: 768px;">
        <!-- Pendiente -->
        <bs-tab-pane name="pendiente">
          <div class="data-section mb-2 mb-md-4">
            <div v-for="{ label, value } in pendienteData" class="data">
              <label v-text="label" class="data-label" />
              <div class="form-control disabled mark" v-text="value" />
            </div>
          </div>
          <bs-accordion borderless>
            <bs-accordion-item class="mb-1">
              <bs-accordion-header>
                <bs-accordion-btn v-slot:default="{ shown }" class="py-1">
                  <bs-btn-caret :modelValue="shown" class="me-1" />
                  <span class="fw-semibold">SELECCIONAR ESTADOS</span>
                </bs-accordion-btn>
              </bs-accordion-header>
              <bs-accordion-body class="px-0 pt-0">
                <SeleccionarEstados v-model="form.estados" />
              </bs-accordion-body>
            </bs-accordion-item>
            <bs-accordion-item class="mb-1">
              <bs-accordion-header>
                <bs-accordion-btn v-slot:default="{ shown }" class="py-1">
                  <bs-btn-caret :modelValue="shown" class="me-1" />
                  <span class="fw-semibold">SELECCIONAR PIEZAS</span>
                </bs-accordion-btn>
              </bs-accordion-header>
              <bs-accordion-body class="px-0 pt-0">
                <SeleccionarPiezasPendientes v-model="form.piezas_pendientes" />
              </bs-accordion-body>
            </bs-accordion-item>
          </bs-accordion>
        </bs-tab-pane>
        <!-- Cierre -->
        <bs-tab-pane name="cierre">
          <div class="data-section mb-2 mb-md-4">
            <div v-for="{ label, value } in cierreData" class="data">
              <label v-text="label" class="data-label" />
              <div class="form-control disabled mark" v-text="value" />
            </div>
          </div>
          <div class="mb-3">
            <SeleccionarCierre v-model="form.cierre" />
          </div>
          <bs-accordion borderless>
            <bs-accordion-item class="mb-1">
              <bs-accordion-header>
                <bs-accordion-btn v-slot:default="{ shown }" class="py-1">
                  <bs-btn-caret :modelValue="shown" class="me-1" />
                  <span class="fw-semibold">SELECCIONAR PIEZAS</span>
                </bs-accordion-btn>
              </bs-accordion-header>
              <bs-accordion-body class="px-0 pt-0">
                <SeleccionarPiezasCierre v-model="form.piezas_cierre" />
              </bs-accordion-body>
            </bs-accordion-item>
          </bs-accordion>
        </bs-tab-pane>
        <bs-tab-pane name="mtto">
          <!-- <div class="data-section mb-2 mb-md-4">
            <div v-for="{ label, value } in cierreData" class="data">
              <label v-text="label" class="data-label" />
              <div class="form-control disabled mark" v-text="value" />
            </div>
          </div> -->
          <div class="mb-4">
            <SeleccionarMantenimiento v-model="form.mantenimiento" />
          </div>
          <bs-accordion borderless>
            <bs-accordion-item class="mb-1">
              <bs-accordion-header>
                <bs-accordion-btn v-slot:default="{ shown }" class="py-1">
                  <bs-btn-caret :modelValue="shown" class="me-1" />
                  <span class="fw-semibold">SELECCIONAR PIEZAS</span>
                </bs-accordion-btn>
              </bs-accordion-header>
              <bs-accordion-body class="px-0 pt-0">
                <SeleccionarPiezasMantenimiento v-model="form.piezas_mtto" />
              </bs-accordion-body>
            </bs-accordion-item>
          </bs-accordion>
        </bs-tab-pane>
      </bs-tab-content>
    </bs-dialog-body>
    <bs-dialog-footer v-bind="{ start: !mobile, center: mobile }">
      <bs-btn label="Cancelar" color="secondary" @click="dialog = false" style="min-width:100px" />
      <bs-btn :label="sending ? 'Enviando' : 'Enviar'" color="success" style="min-width:100px" @click="submit" />
    </bs-dialog-footer>
  </bs-dialog>
  <bs-dialog v-model="result" @hidden="result = null" full>
    <bs-dialog-header label="API Response" />
    <bs-dialog-body>
      <h5>Form Data</h5>
      <pre>form</pre>
      <h5>PUT Response</h5>
      <pre>result</pre>
    </bs-dialog-body>
  </bs-dialog>
</template>

<style scoped>
.mobile {
  --bs-modal-padding: 4px 8px;
  --bs-modal-body-flex: 1 1 auto;
  --data-flex-direction: row;
  --data-label-after-content: ":";
  --data-form-control-padding: 0 .125rem;
  --data-form-control-disabled-bg: unset;
  --data-form-control-border: none;
  --data-form-control-font-weight: bold;
}

.large {
  --data-flex-direction: column;
  --data-label-font-weight: 600;
  --data-label-font-size: .875rem;
  --data-form-control-min-width: 210px;
  --data-form-control-padding: .375rem .75rem;
  --data-form-control-disabled-bg: var(--bs-secondary-bg);
  --data-form-control-border: 1px solid var(--bs-border-color);
}

.data .form-control {
  width: auto;
  min-width: var(--data-form-control-min-width);
  padding: var(--data-form-control-padding);
  border: var(--data-form-control-border);
  font-weight: var(--data-form-control-font-weight);
}

.data .form-control.disabled {
  background-color: var(--data-form-control-disabled-bg);
}

.dialog-header {
  display: flex;
  row-gap: 4px;
  align-items: center;
}

.dialog-header span {
  color: var(--bs-gray-700);
  font-weight: 600;
}

.modal-body {
  flex: var(--bs-modal-body-flex);
}

/* Data section */
.data-section {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 20px;
  margin-bottom: 8px;
}

.data {
  display: flex;
  flex-direction: var(--data-flex-direction);
  gap: 4px;
  flex-wrap: wrap;
}

.data-label {
  font-weight: var(--data-label-font-weight);
  font-size: var(--data-label-font-size);
  white-space: nowrap;
}

.data-label::after {
  content: var(--data-label-after-content);
}
</style>
