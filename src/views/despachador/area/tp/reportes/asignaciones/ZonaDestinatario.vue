<script setup>
import useSnackbar from '@/stores/snackbar'
import GrupoAsignaciones from './GrupoAsignaciones.vue'
import DestinatarioList from '@/views/despachador/area/base/DestinatarioList.vue'
import useZonas from '@/stores/despachador-tp-zonas'
import useAsignacion from '@/stores/despachador-tp-asignacion'
import useAsignaciones from '@/stores/despachador-tp-asignaciones'
import useDestinatarios from '@/stores/despachador-destinatarios'
import useDestinatario from '@/stores/despachador-destinatario'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { useRoute } from 'vue-router'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const target = useTeleportTarget('#app-footer-content')
const snackbar = useSnackbar()
const route = useRoute()
const zonas = useZonas()
const asignacion = useAsignacion()
const asignaciones = useAsignaciones()
const destinatarios = useDestinatarios()
const destinatario = useDestinatario()
const selection = ref({
  destinatarios: [],
  zonas: []
})
const zonasDialog = ref(null)
const up = ref(null)
const tab = ref(null)
const tabs = computed(() =>
  up.value && [
    {
      title: 'Zonas',
      disabled: !zonas.data.length,
      active: tab.value === 1,
      click: () => (tab.value = 1)
    },
    {
      title: 'Destinatarios',
      disabled: !destinatarios.data.length,
      active: tab.value === 2,
      click: () => (tab.value = 2)
    }
  ])
const asignaciones_ = computed(() =>
  asignaciones.data.map(a => ({
    ...a,
    destinatario: destinatarios.data.find(d => d.id === a.destinatario_id)
  })))
const initTab = () => {
  if (zonas.data.length) tab.value = 1
  else tab.value = 0
  up.value = true
}
const area_id = route.params.id
loading.value++
Promise.all([
  zonas.get(area_id),
  asignaciones.get(area_id)
]).then(() => {
  loading.value--
  initTab()
})
const resetSelection = () => {
  selection.value.destinatarios = selection.value.zonas = []
}
const drop = async () => {
  const paramsList = []
  if (selection.value.zonas.length) {
    selection.value.destinatarios.forEach(destinatario => {
      selection.value.zonas.forEach(zona => {
        paramsList.push({ zona_id: zona.id, destinatario_id: destinatario.id })
      })
    })
  }
  if (paramsList.length) {
    const notify = d => snackbar.add({
      text: 'Asignar Ok.',
      color: 'success',
      icon: 'check2-circle'
    })
    loading.value++
    await Promise.all(paramsList.map(d => asignacion.post(d))).then(() => notify())
    await asignaciones.get()
    loading.value--
    zonasDialog.value = false
  }
}
const activate = async active => {
  const data = { activo: active }
  loading.value++
  await Promise.all(
    selection.value.destinatarios.map(({ id }) => destinatario.put({ id, data }))
  ).catch(() => { })
  await destinatarios.get()
  loading.value--
}
</script>

<template>
  <div class="px-1">
    <div class="position-sticky top-0 pb-1 bg-white z-1">
      <ul class="nav nav-tabs">
        <li class="nav-item" v-for="item in tabs">
          <a class="nav-link lh-sm" href="#" :class="{ disabled: item.disabled, 'active fw-600': item.active }"
            @click.prevent="item.click" v-text="item.title"></a>
        </li>
      </ul>
    </div>
    <div v-if="tab === 0" class="alert alert-light text-center mt-4">
      No se encontraron zonas asociadas al área.
    </div>
    <div v-else-if="tab === 1">
      <GrupoAsignaciones v-for="zona in zonas.data" :asignaciones="asignaciones_.filter(_ => _.zona_id === zona.id)"
        :zona="zona" :key="zona.id" />
    </div>
    <div v-else-if="tab === 2">
      <DestinatarioList v-model="selection.destinatarios" />
    </div>
    <Teleport v-if="target" to="#app-footer-content">
      <Transition>
        <div v-if="selection.destinatarios.length" class="footer hstack justify-content-center">
          <bs-btn-footer class="text-light" label="Zona" icon="arrow-return-right" @click="zonasDialog = true" />
          <!-- Activar / Desactivar -->
          <bs-dropdown>
            <bs-dropdown-toggle>
              <bs-btn-footer class="text-light" label="Activar" icon="check2-square" />
            </bs-dropdown-toggle>
            <bs-dropdown-menu class="dropdown-menu-dark">
              <bs-dropdown-item label="Activar" icon="check2" @click="activate(true)" />
              <bs-dropdown-item label="Desactivar" icon="x" @click="activate(false)" />
            </bs-dropdown-menu>
          </bs-dropdown>
        </div>
      </Transition>
    </Teleport>
    <!-- Zonas Dialog -->
    <bs-dialog v-model="zonasDialog" fullSmDown @hidden="resetSelection">
      <bs-dialog-header label="Zonas" />
      <bs-dialog-body class="p-1 overflow-auto">
        <!-- Zonas List -->
        <ul class="list-group list-group-flush">
          <li v-for="i in zonas.data" :key="i.id" class="list-group-item px-2 py-c text-truncate border-0 bg-light">
            <input type="checkbox" :value="i" v-model="selection.zonas">
            <span v-text="i.nombre" class="mx-2" />
          </li>
        </ul>
      </bs-dialog-body>
      <bs-dialog-footer class="footer justify-content-center">
        <bs-btn-footer class="text-light" label="Asignar" icon="check-lg" @click="drop"
          :disabled="!selection.zonas.length" />
      </bs-dialog-footer>
    </bs-dialog>
  </div>
</template>

<style scoped>
@media (max-width:991.98px) {
  .nav-tabs .nav-link {
    --bs-nav-link-padding-x: .7rem;
    font-size: .875em;
    font-weight: 600;
  }
}

.list-group-item:nth-child(even) {
  --bs-bg-opacity: 0.2;
}

.py-c {
  padding-top: 6px;
  padding-bottom: 6px;
}

.footer {
  background: rgba(var(--bs-dark-rgb), .96);
  padding: 0;
}

.footer>* {
  margin: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all .3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>