<script setup>
import Overview from '@/views/base/Overview.vue'
import SearchControl from '@/views/despachador/area/base/SearchControl.vue'
import HeaderUpdateBtn from '@/views/despachador/area/base/HeaderUpdateBtn.vue'
import FooterUpdateBtn from '@/views/despachador/area/base/FooterUpdateBtn.vue'
import ReporteCard from './ReporteCard.vue'
import Statusinfo from '@/views/despachador/base/Statusinfo.vue'
import DestinatariosDialog from '@/views/despachador/area/base/DestinatariosDialog.vue'
import useSnackbar from '@/stores/snackbar'
import useReportes from '@/stores/despachador-ra-reportes'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { ref, watch, computed, onBeforeUnmount, inject } from 'vue'

const area = inject('despachador:area')
const mobile = inject('app:mobile')
const loading = inject('app:loading')
const target = useTeleportTarget('#despachador-status')
const snackbar = useSnackbar()
const reportes = useReportes()
const search = ref(null)
const selection = ref({
  reportes: [],
  destinatarios: []
})
const destinatariosDialog = ref(null)
const searchFields = ref([
  { text: 'NHPLUS', value: 'tiposerv', default: 'NHPLUS', readonly: true },
  { text: 'folio', value: 'folio' },
  { text: 'planta', value: 'nombpta' },
  { text: 'zona', value: 'zona' },
  { text: 'telefono', value: 'telefono' },
  { text: 'problema', value: 'problema' },
  { text: 'prueba', value: 'prueba' },
  { text: 'grupo', value: 'grupo' },
  { text: 'demorat(==)', value: 'demorat==' },
  { text: 'demorat(>=)', value: 'demorat>=' },
  { text: 'demorat(<=)', value: 'demorat<=' },
  { text: 'nombre', value: 'nombre' },
  { text: 'direccion', value: 'direccion' },
  { text: 'cl', value: 'cl' },
  { text: 'cableP', value: 'cableP' },
  { text: 'parP', value: 'parP' },
  { text: 'terminalP', value: 'terminalP' },
  { text: 'direcciontP', value: 'direcciontP' },
  { text: 'cableS', value: 'cableS' },
  { text: 'parS', value: 'parS' },
  { text: 'terminalS', value: 'terminalS' },
  { text: 'direcciontS', value: 'direcciontS' },
  { text: 'telf_localiz', value: 'telfloca' },
  { text: 'observacion', value: 'observacion' }
])
const orderFields = ref([
  'folio',
  'planta',
  'zona',
  'problema',
  'grupo'
])
const defaultOrderObj = { field: 'folio', direction: 'asc' }
watch(() => reportes.showAll, () => selection.value.reportes = [])
watch(destinatariosDialog, to => !to && (selection.value.destinatarios = []))
watch(search, to => {
  reportes.search = to
  selection.value.reportes = [] // That is the normal behavior of google
})

reportes.orderObj = defaultOrderObj
reportes.search = null // to clear previous searches
const ready = ref(false)
const actualizar = () => {
  loading.value++
  reportes.get(area.value.id)
    .then(() => ready.value = true)
    .finally(() => loading.value--)
}
actualizar()
function order(field) {
  let obj
  if (reportes.orderObj.field === field) {
    if (reportes.orderObj.direction === null)
      obj = { field: field, direction: 'asc' }
    if (reportes.orderObj.direction === 'asc')
      obj = { field: field, direction: 'desc' }
    if (reportes.orderObj.direction === 'desc')
      obj = defaultOrderObj
  } else obj = { field: field, direction: 'asc' }
  reportes.orderObj = obj
}
function despachar() {
  const data = []
  selection.value.reportes.forEach(({ folio, iddt, grupo }) => {
    selection.value.destinatarios.forEach(({ telefono, nombre }) => {
      data.push({ folio, iddt, grupo, telefono, nombre })
    })
  })
  loading.value++
  Promise.all(data.map(d => reportes.despachos.post(d)))
    .then(res => {
      if (res.some(v => v === '1')) actualizar()
      if (res.every(v => v === '1')) {
        selection.value.reportes = selection.value.destinatarios = []
        destinatariosDialog.value = false
        notifyOk()
      } else notifyFails()
    })
    .catch(notifyFails)
    .finally(() => loading.value--)
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
const label = computed(() => reportes.orderObj.field + ' (' + reportes.orderObj.direction + ')')
const despacharBtn = computed(() => ({
  size: '32px',
  style: 'padding:3px 8px',
  color: 'secondary',
  disable: !selection.value.reportes.length
}))
//
// mobile options logic
const showOS = ref(false)
watch(mobile, () => showOS.value = false)
//
const outdated = ref(null)
const checkOutdated = () => (Date.now() - (reportes.status.updated || Date.now())) > 60000
const interval = setInterval(() => outdated.value = checkOutdated(), 10000)
watch(() => reportes.status.updated, () => outdated.value = false)
onBeforeUnmount(() => clearInterval(interval))
</script>

<template>
  <div v-if="ready" :class="{ mobile, large: !mobile }">
    <Teleport v-if="target" to="#despachador-status">
      <HeaderUpdateBtn v-if="!mobile" @click="actualizar" :outdated="outdated" />
      <Statusinfo secondary label="Pendientes" :value="reportes.count.all" />
      <Statusinfo ifValue warning title="No despachados" :value="reportes.count.notDispatched" />
    </Teleport>
    <!-- Actualizar Buttons -->
    <template v-if="mobile">
      <Teleport v-if="target" to="#app-footer-content">
        <div class="bg-light-2 hstack justify-content-center" style="padding: 2px;">
          <FooterUpdateBtn @click="actualizar" :outdated="outdated" />
        </div>
      </Teleport>
    </template>
    <!-- / -->
    <Overview>
      <div class="grid" :class="{ show: showOS }">
        <div class="hstack gap-1 gap-md-3 w-100 grid-item-1">
          <div class="border checkbox-pad rounded-2">
            <bs-checkbox flat label="Despachados" compact v-model="reportes.showAll" class="checkbox" />
          </div>
          <bs-btn v-bind="despacharBtn" @click="destinatariosDialog = true">
            <span class="d-none d-md-inline">Despachar seleccionadas</span>
            <bs-icon name="send d-md-none" />
            <span v-if="selection.reportes.length" class="ms-1 badge bg-primary" v-text="selection.reportes.length" />
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
      <ReporteCard v-for="reporte in reportes.data" :reporte="reporte" :key="reporte.id" v-model="selection.reportes"
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