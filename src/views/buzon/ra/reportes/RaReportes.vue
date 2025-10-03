<script setup>
const props = defineProps({ cerrar: Function })

import ReporteCard from './ReporteCard.vue'
import ReportesOrdenar from './ReportesOrdenar.vue'
import ReportesFiltrar from './ReportesFiltrar.vue'
import useStore from '@/stores/buzon-ra'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { ref, computed, watch, onBeforeUnmount, inject } from 'vue'

const mobile = inject('app:mobile')
const loading = inject('app:loading')
const store = useStore().reportes
const target = useTeleportTarget('#app-footer-content')
const targetHeader = useTeleportTarget('#buzon-header-bottom')
const modal = ref({
  order: null,
  filter: null
})
const data = computed(() => store.data)
const btns = computed(() => {
  return [
    {
      icon: 'funnel',
      label: 'Filtrar',
      active: store.filter.on,
      disable: !store.data.length,
      action: () => modal.value.filter = true
    },
    {
      icon: 'sort-up',
      label: 'Ordenar',
      active: store.order.on,
      disable: !store.data.length,
      action: () => modal.value.order = true
    },
    {
      icon: 'arrow-clockwise',
      label: 'Actualizar',
      cls: { 'outdated': outdated.value },
      action: actualizar
    }
  ]
})
const actualizar = () => {
  loading.value++
  store.get().then(() => loading.value--)
}
actualizar()
//
const outdated = ref(null)
const checkOutdated = () => (Date.now() - (store.status.updated || Date.now())) > 60000
const interval = setInterval(() => outdated.value = checkOutdated(), 10000)
watch(() => store.status.updated, () => outdated.value = false)
onBeforeUnmount(() => clearInterval(interval))
</script>

<template>
  <div>
    <template v-if="mobile">
      <Teleport v-if="target" to="#app-footer-content">
        <div class="bg-light-2 hstack justify-content-center" style="padding: 2px;">
          <bs-btn-footer v-for="b in btns" :label="b.label" :icon="b.icon" @click="b.action" :class="b.cls"
            :active="b.active" :disable="b.disable" />
        </div>
      </Teleport>
    </template>
    <template v-else>
      <Teleport v-if="targetHeader" to="#buzon-header-bottom">
        <div class="hstack gap-2 p-2">
          <bs-btn color="success" flat v-for="b in btns" :label="b.label" :icon="b.icon" @click="b.action"
            :class="b.cls" class="py-1" :active="b.active" :disable="b.disable" />
        </div>
      </Teleport>
    </template>
    <div v-if="store.status.loaded && !data.length" class="text-center text-muted py-5">
      No se encontraron reportes
    </div>
    <ReporteCard v-for="reporte in data" :key="reporte.folio" :reporte="reporte" class="m-1"
      @cerrar="cerrar(reporte.folio)" />
    <router-view />
  </div>
  <ReportesOrdenar v-model="modal.order" />
  <ReportesFiltrar v-model="modal.filter" />
</template>

<style scoped>
.outdated {
  color: var(--bs-danger) !important;
  background: rgba(var(--bs-danger-rgb), .1);
}
</style>
