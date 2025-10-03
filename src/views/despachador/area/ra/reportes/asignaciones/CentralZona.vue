<script setup>
import GrupoAsignacionesRA from './GrupoAsignaciones.vue'
import useCentrales from '@/stores/despachador-ra-centrales'
import useZonas from '@/stores/despachador-ra-zonas'
import useAsignaciones from '@/stores/despachador-ra-asignaciones'
import useDestinatarios from '@/stores/despachador-destinatarios'
import { useRoute } from 'vue-router'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const route = useRoute()
const centrales = useCentrales()
const zonas = useZonas()
const asignaciones = useAsignaciones()
const destinatarios = useDestinatarios()
const up = ref(null)
const tab = ref(null)
const tabs = computed(() => (
  up.value && [
    {
      title: 'Centrales',
      disabled: !centrales.data.length,
      active: tab.value === 1,
      click: () => (tab.value = 1)
    },
    {
      title: 'Zonas',
      disabled: !zonas.data.length,
      active: tab.value === 2,
      click: () => (tab.value = 2)
    }
  ]
))
const asignaciones_ = computed(() =>
  asignaciones.data.map(a => ({
    ...a,
    destinatario: destinatarios.data.find(d => d.id === a.destinatario_id)
  })))
const initTab = () => {
  if (centrales.data.length) tab.value = 1
  else if (zonas.data.length) tab.value = 2
  else tab.value = 0
  up.value = true
}
const area_id = route.params.id
loading.value++
Promise.all([
  centrales.get(area_id),
  zonas.get(area_id),
  asignaciones.get(area_id)
]).then(() => {
  loading.value--
  initTab()
})
</script>

<template>
  <div class="px-1">
    <div class="position-sticky top-0 pb-1 bg-white z-1">
      <ul class="nav nav-tabs">
        <li class="nav-item" v-for="item in tabs">
          <a class="nav-link lh-sm" href="#" :class="{ disabled: item.disabled, 'active fw-600': item.active }"
            @click.prevent="item.click" v-text="item.title" />
        </li>
      </ul>
    </div>
    <div v-if="tab === 0" class="alert alert-light text-center mt-4">
      No se encontraron centrales o zonas asociadas al área.
    </div>
    <div v-else-if="tab === 1">
      <GrupoAsignacionesRA v-for="central in centrales.data"
        :asignaciones="asignaciones_.filter(_ => _.central_id === central.id)" :central="central" :key="central.id" />
    </div>
    <div v-else-if="tab === 2">
      <GrupoAsignacionesRA v-for="zona in zonas.data" :asignaciones="asignaciones_.filter(_ => _.zona_id === zona.id)"
        :zona="zona" :key="zona.id" />
    </div>
  </div>
</template>