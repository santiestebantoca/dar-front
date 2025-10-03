<script setup>
const props = defineProps({ back: Function })

import useSnackbarStore from '@/stores/snackbar'
import useHandleSubmit from '@/use/useHandleSubmit.js'
import useStore from '@/stores/admin'
import NombreInput from '../base/inputs/ZonaNombreInput.vue'
import DescripcionInput from '../base/inputs/ZonaDescripcionInput.vue'
import AreasSelect from '../base/inputs/ZonaAreaSelect.vue'
import TerritorioSelect from '../base/inputs/ZonaTerritorioSelect.vue'
import { ref, watch } from 'vue'

const snackbar = useSnackbarStore()
const process = useHandleSubmit()
const admin = useStore()
const sending = ref(false)
const result = ref({ errors: {} })
const form = ref({
  area_id: null,
  nombre: null,
  descripcion: null
})
const territorio = ref(null) // auxiliar to reduce `area` domain
const validate = () => {
  const errors = {}
  if (!form.value.nombre) errors.nombre = 'Este campo no puede estar vacío'
  if (!form.value.area_id) errors.area_id = 'Seleccione un valor'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  admin.zonas.zona.post({ ...form.value })
    .then(res => process.POST(res.data,
      () => {
        admin.zonas.zonas.get()
        snackbar.add('Registro creado.')
        props.back()
      },
      errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
//
// special relationships between territorio and form.area_id
watch(territorio, v => {
  admin.env.areas.territorio = v
  form.value.area_id = undefined
})
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Nuevo registro</span>
    </div>
    <form @submit.prevent class="data-form">
      <NombreInput v-model:error="result.errors.nombre" v-model:value="form.nombre" />
      <DescripcionInput v-model:error="result.errors.descripcion" v-model:value="form.descripcion" />
      <TerritorioSelect v-model="territorio" />
      <AreasSelect v-model:error="result.errors.area_id" v-model:value="form.area_id" />
      <bs-btn :disabled="sending" label="Guardar" class="mt-3" @click="submit" color="primary" />
    </form>
  </div>
</template>
