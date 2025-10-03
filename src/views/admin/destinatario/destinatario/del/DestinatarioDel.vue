<script setup>
const props = defineProps({ back: Function, cancel: Function })

import useSnackbarStore from '@/stores/snackbar'
import useHandleSubmit from '@/use/useHandleSubmit.js'
import useStore from '@/stores/admin-destinatarios'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const snackbar = useSnackbarStore()
const model = ref(true)
const deleted = ref(false)
const store = useStore()
const destinatario = computed(() => store.destinatario.data)
const submit = () => {
  loading.value++
  store.destinatario.del(destinatario.value.id)
    .then(res => process.DELETE(res.data,
      () => store.destinatarios.get().then(() => {
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
        Va a eliminar el destinatario
        <span class="fw-semibold" v-text="destinatario.name" />.
        Este destinatario se puede eliminar de forma segura.
      </p>
      <br>
      <bs-btn type="submit" color="primary" label="Eliminar" @click="submit" />
    </bs-dialog-body>
  </bs-dialog>
</template>