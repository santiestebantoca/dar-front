<script setup>
import Overview from '@/views/base/Overview.vue'
import SearchControl from '@/views/despachador/area/base/SearchControl.vue'
import OrdenCard from './OrdenCard.vue'
import Statusinfo from '@/views/despachador/base/Statusinfo.vue'
import DestinatariosDialog from '@/views/despachador/area/base/DestinatariosDialog.vue'
import useSnackbar from '@/stores/snackbar'
import useOrdenes from '@/stores/despachador-ra-ordenes'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { ref, watch, computed, onBeforeUnmount, inject } from 'vue'

const area = inject('despachador:area')
const loading = inject('app:loading')
const target = useTeleportTarget('#despachador-status')
const snackbar = useSnackbar()
const ordenes = useOrdenes()
const search = ref(null)
const selection = ref({
  ordenes: [],
  destinatarios: []
})
const destinatariosDialog = ref(null)
const reloadInterval = ref(null)
const searchFields = ref([
  { text: 'NHPLUS', value: 'tiposerv', default: 'NHPLUS', readonly: true },
  { text: 'servicio', value: 'servicio' },
  { text: 'orden', value: 'orden' },
  { text: 'oficina', value: 'oficina' },
  { text: 'movimiento', value: 'clavemov' },
  { text: 'estado', value: 'estado' },
])
const orderFields = ref([
  'fechaor',
  'orden',
  'oficina',
  'servicio',
  'clavemov',
  'estado'
])
const defaultOrderObj = { field: 'orden', direction: 'asc' }
watch(() => ordenes.showAll, () => selection.value.ordenes = [])
watch(destinatariosDialog, to => {
  if (to) stopAutoDataRefresh()
  else {
    startAutoDataRefresh()
    selection.value.destinatarios = []
  }
})
watch(search, to => {
  ordenes.search = to
  selection.value.ordenes = [] // That is the normal behavior of google
})

ordenes.orderObj = defaultOrderObj
ordenes.search = null // to clear previous searches
const getOrdenes = () => ordenes.get(area.value.id)
const ready = ref(false)
loading.value++
getOrdenes().then(() => {
  loading.value--
  ready.value = true
  startAutoDataRefresh()
})

const startAutoDataRefresh = () => reloadInterval.value = setInterval(getOrdenes, 1000 * 30)
const stopAutoDataRefresh = () => clearInterval(reloadInterval.value)
onBeforeUnmount(stopAutoDataRefresh)
function order(field) {
  let obj
  if (ordenes.orderObj.field === field) {
    if (ordenes.orderObj.direction === null)
      obj = { field: field, direction: 'asc' }
    if (ordenes.orderObj.direction === 'asc')
      obj = { field: field, direction: 'desc' }
    if (ordenes.orderObj.direction === 'desc')
      obj = defaultOrderObj
  } else obj = { field: field, direction: 'asc' }
  ordenes.orderObj = obj
}
function despachar() {
  const data = []
  selection.value.ordenes.forEach(({ idorden, idregion }) => {
    selection.value.destinatarios.forEach(({ telefono, nombre }) => {
      data.push({ idorden, idregion, telefono, nombre })
    })
  })
  loading.value++
  Promise.all(data.map(d => ordenes.despachos.post(d)))
    .then(res => {
      loading.value--
      if (res.some(v => v === '1')) getOrdenes()
      if (res.every(v => v === '1')) {
        selection.value.ordenes = selection.value.destinatarios = []
        destinatariosDialog.value = false
        notifyOk()
      } else notifyFails()
    })
    .catch(() => {
      loading.value--
      notifyFails()
    })
}
const notifyOk = () => snackbar.add({
  text: 'Despachos completados.',
  color: 'success',
  icon: 'check2-circle'
})
const notifyFails = () => snackbar.add({
  text: 'Algunos despachos no se completaron.',
  color: 'danger',
  icon: 'exclamation-triangle'
})
const label = computed(() => ordenes.orderObj.field + ' (' + ordenes.orderObj.direction + ')')
const despacharBtn = computed(() => ({
  size: '32px',
  style: 'padding:3px 8px',
  color: 'secondary',
  disable: !selection.value.ordenes.length
}))
//
// mobile options logic
const mobile = inject('app:mobile')
const showOS = ref(false)
watch(mobile, () => showOS.value = false)
</script>

<template>
  <div v-if="ready" :class="{ mobile, large: !mobile }">
    <Teleport v-if="target" to="#despachador-status">
      <Statusinfo secondary label="Pendientes" :value="ordenes.count.all" />
      <Statusinfo ifValue warning title="No despachadas" :value="ordenes.count.notDispatched" />
    </Teleport>
    <Overview>
      <div class="grid" :class="{ show: showOS }">
        <div class="hstack gap-1 gap-md-3 w-100 grid-item-1">
          <div class="border checkbox-pad rounded-2">
            <bs-checkbox flat label="Despachados" compact v-model="ordenes.showAll" class="checkbox" />
          </div>
          <bs-btn v-bind="despacharBtn" @click="destinatariosDialog = true">
            <span class="d-none d-md-inline">Despachar seleccionadas</span>
            <bs-icon name="send d-md-none" />
            <span v-if="selection.ordenes.length" class="ms-1 badge bg-primary" v-text="selection.ordenes.length" />
          </bs-btn>
          <bs-btn-icon icon="three-dots-vertical" flat size="32px" class="ms-auto d-md-none"
            @click="showOS = !showOS" />
        </div>
        <div class="grid-item-2">
          <bs-dropdown>
            <bs-dropdown-toggle>
              <bs-btn icon="sort-down-alt" style="padding:3px 12px" size="32px" :label="label" class="text-nowrap" />
            </bs-dropdown-toggle>
            <bs-dropdown-menu>
              <bs-dropdown-item v-for="field in orderFields" @click="order(field)" :label="field" />
            </bs-dropdown-menu>
          </bs-dropdown>
        </div>
        <div class="grid-item-3">
          <SearchControl v-model="search" :fields="searchFields" />
        </div>
      </div>
    </Overview>
    <div class="p-1">
      <OrdenCard v-for="orden in ordenes.data" :orden="orden" :key="orden.idorden" v-model="selection.ordenes"
        class="mb-1" />
    </div>
    <DestinatariosDialog v-model="destinatariosDialog" v-model:selection="selection.destinatarios"
      @despachar="despachar" />
  </div>
</template>

<style scoped>
.checkbox-pad {
  padding: 3px 8px;
}

.checkbox {
  margin: 0;
}

.mobile {
  --grid-template-columns: 1fr;
  --grid-template-areas: "grid-item-1";
  --grid-justify-items: start;
  --grid-items-2-display: none;
  --grid-items-3-display: none;
}

.large {
  --grid-template-columns: auto 1fr auto;
  --grid-template-areas: "grid-item-2 grid-item-3 grid-item-1";
  --grid-justify-items: center;
}

.grid {
  width: 100%;
  display: grid;
  grid-template-columns: var(--grid-template-columns);
  grid-template-areas: var(--grid-template-areas);
  justify-items: var(--grid-justify-items);
  gap: 8px;
}

.mobile .grid.show {
  --grid-items-3-display: block;
  --grid-template-areas: "grid-item-3"
    "grid-item-1";
}

.grid-item-1 {
  grid-area: grid-item-1;
}

.grid-item-2 {
  grid-area: grid-item-2;
  display: var(--grid-items-2-display);
}

.grid-item-3 {
  grid-area: grid-item-3;
  display: var(--grid-items-3-display);
}
</style>