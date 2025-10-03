<script setup>
const props = defineProps({ central: Object, zona: Object, asignaciones: Array })

import useSnackbar from '@/stores/snackbar'
import useDestinatario from '@/stores/despachador-destinatario'
import useRA_Asignacion from '@/stores/despachador-ra-asignacion'
import useRA_Asignaciones from '@/stores/despachador-ra-asignaciones'
import AsignacionDestinatario from '@/views/despachador/area/base/AsignacionDestinatario.vue'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const mobile = inject('app:mobile')
const snackbar = useSnackbar()
const destinatario = useDestinatario()
const asignacion = useRA_Asignacion()
const asignacionesStore = useRA_Asignaciones()
const show = ref(null)
const dragCounter = ref(0)
const dragstart = computed(() => destinatario.dragstart)
const cls = computed(() => ({
  'show': show.value,
  'drag-hover': dragCounter.value,
  'drag-start': dragstart.value
}))
const drop = async ({ dataTransfer }) => {
  dragCounter.value = 0
  const destino = props.central
    ? props.central.nombre
    : props.zona.nombre
  const params = props.central
    ? { central_id: props.central.id, region_id: props.central.region_id }
    : { zona_id: props.zona.id }
  const paramsList = []
  const data = JSON.parse(dataTransfer.getData('application/json')) || []
  data.forEach(d => {
    if (props.asignaciones.some(a => a.destinatario_id === d.id)) {
      snackbar.add({
        text: d.nombre + ' ya estaba asignado en ' + destino,
        color: 'danger',
        icon: 'exclamation-triangle'
      })
    } else paramsList.push([d.nombre, { ...params, destinatario_id: d.id }])
  })
  if (paramsList.length) {
    const notify = nombre => snackbar.add({
      text: nombre + ' se asignó en ' + destino,
      color: 'success',
      icon: 'check2-circle'
    })
    loading.value++
    await Promise.all(paramsList.map(([n, d]) => asignacion.post(d).then(() => notify(n))))
    await asignacionesStore.get()
    loading.value--
  }
}
const title = ref(props.central
  ? props.central.nombre
  : props.zona.nombre + '' + props.zona.descripcion)
</script>

<template>
  <div class="card-custom" :class="cls" @dragenter="dragCounter++" @dragleave="dragCounter--" @dragover.prevent
    @drop.prevent="drop">
    <div class="d-flex align-items-center p-2" @click="show = mobile ? !show : true">
      <div class="flex-fill text-truncate">
        <span :class="{ 'fw-semibold': show }" v-text="title" class="text-truncate" />
      </div>
      <div class="d-none d-md-block">
        <div v-if="show">
          <bs-btn-collapse v-model="show" />
        </div>
        <div v-else class="small text-muted fw-semibold text-nowrap">
          Asignaciones
          <span class="d-inline-block text-end" style="min-width:16px" v-text="asignaciones.length" />
        </div>
      </div>
    </div>
    <div v-if="show">
      <AsignacionDestinatario v-for="asignacion, index in asignaciones" :asignacion="asignacion" :index="index"
        :key="asignacion.id" />
    </div>
  </div>
</template>

<style scoped>
.card-custom {
  --card-bg: #f0f1f2;
  background: var(--card-bg);
  border-color: transparent;
  transition: .2s;
  cursor: pointer;
  overflow: hidden;
  margin: 4px 0;
  border-radius: 5px;
  padding: 8px;
}

.card-custom:hover {
  --card-bg: #dee7f1;
}

.card-custom.show {
  --card-bg: #edf2f7;
  cursor: default;
  margin-top: 8px;
  margin-bottom: 8px;
}

.card-custom.drag-start {
  border-color: red;
  border-style: dashed;
}

.card-custom.drag-hover {
  --card-bg: rgba(var(--bs-warning-rgb), .5);
}
</style>
