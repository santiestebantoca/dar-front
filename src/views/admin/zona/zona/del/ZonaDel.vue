<script setup>
const props = defineProps({ back: Function, cancel: Function })

import useSnackbarStore from '@/stores/snackbar'
import useHandleSubmit from '@/use/useHandleSubmit.js'
import useStore from '@/stores/admin-zonas'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const snackbar = useSnackbarStore()
const model = ref(true)
const deleted = ref(false)
const store = useStore()
const zona = computed(() => store.zona.data)
const submit = () => {
  loading.value++
  store.zona.del(zona.value.id)
    .then(res => process.DELETE(res.data,
      () => store.zonas.get().then(() => {
        snackbar.add('Registro eliminado.')
        deleted.value = true
        model.value = false
        loading.value--
      }),
      () => { }))
}
const backIf = () => {
  if (deleted.value) props.back()
  else props.cancel()
}
</script>

<template>
  <bs-dialog v-model="model" @hidden="backIf" fullSmDown>
    <bs-dialog-header label="Eliminar registro" />
    <bs-dialog-body>
      <p>
        Va a eliminar la zona
        <span class="fw-semibold" v-text="zona.nombre" />.
        Se perderán todos los datos asociados a esta.
      </p>
      <br>
      <bs-btn type="submit" color="primary" label="Eliminar" @click="submit" />
    </bs-dialog-body>
  </bs-dialog>
</template>