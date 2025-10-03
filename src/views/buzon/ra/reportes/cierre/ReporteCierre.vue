<script setup>
const props = defineProps({ folio: String, back: Function })

import useSnackbarStore from '@/stores/snackbar'
import useStore from '@/stores/buzon-ra'
import ClaveCierreSelect from './ClaveCierreSelect.vue'
import InfoData from './InfoData.vue'
import { ref, computed } from 'vue'

const snackbar = useSnackbarStore()
const store = useStore()
const cierre = store.cierre
const reportes = store.reportes
const reporte = computed(() => reportes.data.find(d => d.folio == props.folio))
const dialog = ref(true)
const claveCierre = ref(null)
const sending = ref(null)
const cerrado = ref(null)
const submit = () => {
  const data = {
    folio: props.folio,
    clave_cierre: claveCierre.value
  }
  sending.value = true
  cierre.post(data)
    .then(res => {
      if (res?.data) {
        if (res.data.accepted) accepted(res.data.message)
        else error(res.data.message)
      } else error('La conexión con el servidor falló.')
    })
    .then(() => sending.value = false)
}
const accepted = message => {
  snackbar.add({
    text: message,
    color: 'success',
    icon: 'check2-circle'
  })
  cerrado.value = true
  dialog.value = false
}
const error = message => {
  snackbar.add({
    text: message,
    color: 'danger',
    icon: 'exclamation-triangle'
  })
}
const hidden = () => {
  cerrado.value && reportes.del(props.folio) // not before...
  props.back()
}
const carousel = ref(0)
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="hidden" fullSmDown>
    <bs-carousel v-model="carousel">
      <bs-carousel-item>
        <bs-dialog-header label="Cerrar reporte" />
        <bs-dialog-body>
          <input :disabled="sending || cerrado" @click="carousel = 1" :value="claveCierre"
            class="form-control bg-transparent mb-3" placeholder="Clave de cierre" readonly>
        </bs-dialog-body>
        <bs-dialog-footer>
          <bs-btn :disabled="!claveCierre || sending || cerrado" color="primary" icon="check2" label="CERRAR"
            @click="submit" />
          <div class="mx-auto" />
          <InfoData :data="[{ text: 'FOLIO', value: folio }, { text: 'SERVICIO', value: reporte?.telefono || '#' }]" />
        </bs-dialog-footer>
      </bs-carousel-item>
      <bs-carousel-item>
        <bs-dialog-header :back="() => carousel = 0" label="Clave de cierre" />
        <bs-dialog-body class="h-sm">
          <ClaveCierreSelect v-model="claveCierre" @select="carousel = 0" />
        </bs-dialog-body>
      </bs-carousel-item>
    </bs-carousel>
  </bs-dialog>
</template>

<style scoped>
@media(min-width:576px) {
  .h-sm {
    height: 332px;
  }
}
</style>
