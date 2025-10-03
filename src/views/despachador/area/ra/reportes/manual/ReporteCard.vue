<script setup>
const value = defineModel()
const props = defineProps({ reporte: Object })

import useReportes from '@/stores/despachador-ra-reportes'
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
  const { folio, iddt, grupo } = props.reporte
  reportes.despachos.get({ folio, iddt, grupo })
    .then(res => despachos.value = res)
}
const mute = telefono => {
  const { folio, iddt } = props.reporte
  reportes.despachos.put({ folio, iddt, telefono })
    .then(() => getDespachos())
}
</script>

<template>
  <div class="card border-0 bg-light">
    <div class="card-body">
      <div>
        <input type="checkbox" class="me-3" :value="{
          folio: reporte.folio,
          iddt: reporte.iddt,
          grupo: reporte.grupo
        }" v-model="value">
      </div>
      <div class="row-mb-1">
        <div class="row g-2">
          <div class="col-auto">
            <b>FOLIO: {{ reporte.folio }}</b>,
          </div>
          <div class="col-auto">
            {{ reporte.nombpta }},
          </div>
          <div class="col-auto text-success" v-if="reporte.zona">
            Zona: {{ reporte.zona }},
          </div>
          <div class="col-auto">
            <b>{{ reporte.telefono }}</b>,
          </div>
          <div class="col-auto text-danger">
            {{ reporte.problema }},
          </div>
          <div class="col-auto" v-if="reporte.prueba">
            <mark>{{ reporte.prueba }},</mark>
          </div>
          <div class="col-auto text-success" v-if="reporte.grupo">
            Grupo: {{ reporte.grupo }},
          </div>
          <div class="col-auto">
            <b>demorat: {{ reporte.demorat }}</b>
            <span v-if="reporte.clave">,</span>
          </div>
          <div v-if="reporte.clave" class="col-auto">
            <mark><span class="fw-bold text-danger">clave: {{ reporte.clave }}</span></mark>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">Cliente:</span> {{ reporte.nombre }},
          </div>
          <div class="col-auto">
            <span class="text-muted">Direcc:</span> {{ reporte.direccion }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">Red P:</span>
          </div>
          <div class="col-auto" v-if="reporte.cl">
            <span class="text-muted">Cl</span> {{ reporte.cl }},
          </div>
          <div class="col-auto" v-if="reporte.cableP">
            <span class="text-muted">Cable</span> {{ reporte.cableP }},
          </div>
          <div class="col-auto" v-if="reporte.parP">
            <span class="text-muted">Par</span> {{ reporte.parP }},
          </div>
          <div class="col-auto" v-if="reporte.terminalP">
            <span class="text-muted">Terminal</span> {{ reporte.terminalP }},
          </div>
          <div class="col-auto" v-if="!reporte.terminalS">
            <span class="text-muted">Rango</span> {{ reporte.inicio }} ~ {{ reporte.fin }},
          </div>
          <div class="col-auto" v-if="reporte.direcciontP && !reporte.cableS">
            <span class="text-muted">Direcc</span> {{ reporte.direcciontP }}
          </div>
        </div>

        <div class="row g-2" v-if="reporte.cableS">
          <div class="col-auto">
            <span class="text-muted">Red S:</span>
          </div>
          <div class="col-auto">
            <span class="text-muted">Cable</span> {{ reporte.cableS }},
          </div>
          <div class="col-auto" v-if="reporte.parS">
            <span class="text-muted">Par</span> {{ reporte.parS }},
          </div>
          <div class="col-auto" v-if="reporte.terminalS">
            <span class="text-muted">Terminal</span> {{ reporte.terminalS }},
          </div>
          <div class="col-auto">
            <span class="text-muted">Rango</span> {{ reporte.inicio }} ~ {{ reporte.fin }},
          </div>
          <div class="col-auto" v-if="reporte.direcciontS">
            <span class="text-muted">Direcc</span> {{ reporte.direcciontS }}
          </div>
        </div>

        <div class="row g-2" v-if="reporte.telfloca || reporte.observacion">
          <div class="col-auto" v-if="reporte.telfloca">
            <span class="text-muted">Localización:</span> {{ reporte.telfloca }},
          </div>
          <div class="col-auto" v-if="reporte.observacion">
            <span class="text-muted">Observación:</span> {{ reporte.observacion }}
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
