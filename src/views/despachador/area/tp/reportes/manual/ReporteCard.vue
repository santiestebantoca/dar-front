<script setup>
const value = defineModel()
const props = defineProps({ reporte: Object })

import useReportes from '@/stores/despachador-tp-reportes'
import BloqueDespachos from '@/views/despachador/area/base/BloqueDespachos.vue'
import { ref, watch } from 'vue'

const reportes = useReportes()
watch(() => reportes.update, () => show.value && getDespachos())
const despachos = ref(null)
const show = ref(false)
watch(show, show => {
  if (show) {
    despachos.value = null
    getDespachos()
  }
})
const getDespachos = () => {
  const params = { averia_id: props.reporte.id }
  reportes.despachos.get(params)
    .then(res => despachos.value = res)
}
const mute = telefono => {
  const averia_id = props.reporte.id
  reportes.despachos.put({ averia_id, telefono })
    .then(() => getDespachos())
}
</script>

<template>
  <div class="card border-0 bg-light">
    <div class="card-body">
      <div>
        <input type="checkbox" class="me-3" :value="reporte.id" v-model="value">
      </div>
      <div class="row-mb-1">
        <div class="row g-2">
          <div class="col-auto">
            <b>{{ reporte.numero_telefonico }}</b>,
          </div>
          <div class="col-auto">
            <span class="text-muted">Identifictivo:</span> {{ reporte.identificativo }},
          </div>
          <div class="col-auto text-success">
            Zona: {{ reporte.zona }},
          </div>
          <div class="col-auto">
            <b>{{ reporte.modelo }}</b>,
          </div>
          <div class="col-auto text-danger">
            Alarma: {{ reporte.codigos_de_alarma }},
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto text-danger">
            {{ reporte.estados_pendientes }},
          </div>
          <div class="col-auto" v-if="reporte.piezas">
            <mark>{{ reporte.piezas }}</mark>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            {{ reporte.direccion }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto" v-if="reporte.cerradura">
            <span class="text-muted">Cerradura:</span> {{ reporte.cerradura }},
          </div>
          <div class="col-auto">
            <span class="text-muted">Categoría:</span> {{ reporte.categoria }},
          </div>
          <div class="col-auto">
            <span class="text-muted">Soporte:</span> {{ reporte.soporte }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">Fecha avería:</span> {{ reporte.fecha_averia_sigetp.slice(0, -3) }},
          </div>
          <div class="col-auto">
            <span class="text-muted">Tiempo:</span> {{ reporte.tiempo }}
          </div>
        </div>

        <div class="row g-2" v-if="reporte.despachado">
          <div class="col">
            <a href="#" class="text-decoration-none" @click.prevent="show = !show">
              Despachado {{ reporte.despachado }} {{ reporte.despachado > 1 ? 'veces' : 'vez' }}
            </a>
          </div>
        </div>

        <BloqueDespachos v-if="show" :despachos="despachos" @mute="mute" />

      </div>
    </div>
  </div>
</template>

<style scoped>
.row-mb-1>div {
  margin-bottom: .25rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media(min-width: 768px) {
  .card-body {
    flex-direction: row;
  }
}
</style>
