<script setup>
import useDestinatarios from '@/stores/despachador-destinatarios'
import useTP_Asignaciones from '@/stores/despachador-tp-asignaciones'
import GrupoAsignaciones from './GrupoAsignaciones.vue'
import useZonas from '@/stores/despachador-tp-zonas'
import { useRoute } from 'vue-router'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const zonasStore = useZonas()
const asignacionesStore = useTP_Asignaciones()
const destinatariosStore = useDestinatarios()
const route = useRoute()
const up = ref(null)
const tab = ref(null)
const zonas = computed(() => zonasStore.data)
const tabs = computed(() =>
  up.value && [
    {
      title: 'Zonas',
      disabled: !zonas.value.length,
      active: tab.value === 1
    }
  ])
const asignaciones = computed(() =>
  asignacionesStore.data.map(a => ({
    ...a,
    destinatario: destinatariosStore.data.find(d => d.id === a.destinatario_id)
  })))
const initTab = () => {
  if (zonas.value.length) tab.value = 1
  else tab.value = 0
  up.value = true
}
const created = async () => {
  const area_id = route.params.id
  loading.value++
  await Promise.all([
    zonasStore.get(area_id),
    asignacionesStore.get(area_id)
  ])
  initTab()
  loading.value--
}
created()
</script>

<template>
  <div class="px-1">
    <div class="position-sticky top-0 pb-1 bg-white z-1">
      <ul class="nav nav-tabs">
        <li class="nav-item" v-for="item in tabs">
          <a class="nav-link lh-sm" href="#" :class="{ disabled: item.disabled, 'active fw-600': item.active }"
            v-text="item.title" />
        </li>
      </ul>
    </div>
    <div v-if="tab === 0" class="alert alert-light text-center mt-4">
      No se encontraron zonas asociadas al área.
    </div>
    <div v-else-if="tab === 1">
      <GrupoAsignaciones v-for="zona in zonas" :asignaciones="asignaciones.filter(_ => _.zona_id === zona.id)"
        :zona="zona" :key="zona.id" />
    </div>
  </div>
</template>