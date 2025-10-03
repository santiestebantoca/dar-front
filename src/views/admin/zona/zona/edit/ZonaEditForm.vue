<script setup>
const props = defineProps(['id', 'back'])

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useStore from '@/stores/admin-zonas'
import NombreInput from '../../base/inputs/ZonaNombreInput.vue'
import DescripcionInput from '../../base/inputs/ZonaDescripcionInput.vue'
import { ref, watch } from 'vue'

const process = useHandleSubmit()
const store = useStore()
const sending = ref(false)
const form = ref({
  nombre: null,
  descripcion: null,
})
const result = ref({ errors: {} })
watch(() => store.zona.data, d => {
  form.value = {
    nombre: d.nombre,
    descripcion: d.descripcion,
  }
}, { immediate: true })
const validate = () => {
  const errors = {}
  if (!form.value.nombre) errors.nombre = 'Este campo no puede estar vacío'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  store.zona.put({ id: props.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        store.zona.get(props.id)
        store.zonas.get()
        props.back()
      },
      errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Editar registro</span>
    </div>
    <form @submit.prevent class="data-form">
      <NombreInput v-model:value="form.nombre" v-model:error="result.errors.nombre" />
      <DescripcionInput v-model:value="form.descripcion" v-model:error="result.errors.descripcion" />
      <bs-btn :disabled="sending" label="Guardar" class="mt-3" @click="submit" color="primary" />
    </form>
  </div>
</template>
