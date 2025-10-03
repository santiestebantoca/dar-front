<script setup>
const value = defineModel()
const props = defineProps({ orden: Object })

import useOrdenesStore from '@/stores/despachador-ra-ordenes'
import BloqueDespachos from '../../base/BloqueDespachos.vue'
import { ref, watch } from 'vue'

const ordenes = useOrdenesStore()
const despachos = ref(null)
const show = ref(false)
watch(() => ordenes.update, () => show.value && getDespachos())
watch(show, show => {
  if (show) {
    despachos.value = null
    getDespachos()
  }
})
const getDespachos = () => {
  const { idorden, idregion } = props.orden
  ordenes.despachos.get({ idorden, idregion })
    .then(res => despachos.value = res)
}
const mute = telefono => {
  const { idorden, idregion } = props.orden
  ordenes.despachos.put({ idorden, idregion, telefono })
    .then(() => getDespachos())
}
</script>

<template>
  <div class="card border-0 bg-light">
    <div class="card-body">
      <div>
        <input type="checkbox" class="me-3" :value="{
          idorden: orden.idorden,
          idregion: orden.idregion,
        }" v-model="value">
      </div>
      <div class="row-mb-1">
        <div class="row g-2">
          <div class="col-auto">
            <b>ORDEN: {{ orden.orden }}</b>,
          </div>
          <div class="col-auto">
            Oficina: {{ orden.oficina }},
          </div>
          <div class="col-auto text-primary fw-semibold">
            Servicio: {{ orden.servicio }},
          </div>
          <div v-if="orden.asociado" class="col-auto text-success fw-semibold">
            Serv. Asociado: {{ orden.asociado }},
          </div>
          <div class="col-auto">
            <b>Mov: {{ orden.clavemov }}</b>,
          </div>
          <div class="col-auto">
            <span class=" text-success fw-semibold">Estado: {{ orden.estado }}</span>,
          </div>
          <div class="col-auto">
            Fecha Ord.: {{ orden.fechaor }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">Cliente:</span> {{ orden.nombre }},
          </div>
          <div class="col-auto">
            <span class="text-muted">Direcc:</span> {{ orden.entre }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">CL:</span> {{ orden.cl }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">Ruta:</span> {{ orden.ruta }}
          </div>
        </div>

        <div class="row g-2" v-if="orden.observacion">
          <div class="col-auto">
            <span class="text-muted">Observación:</span> {{ orden.observacion }}
          </div>
        </div>

        <div class="row g-2">
          <div class="col-auto">
            <span class="text-muted">Reverso:</span>
            PUERTA: {{ orden.puerta }},
            WAN: {{ orden.wan }},
            LAN: {{ orden.lan }},
            VELOCIDAD: {{ orden.velocidad }}
          </div>
        </div>

        <div class="row g-2" v-if="orden.despachado">
          <div class="col">
            <a href="#" class="text-decoration-none" @click.prevent="show = !show">
              Despachado {{ orden.despachado }} {{ orden.despachado > 1 ? 'veces' : 'vez' }}
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
