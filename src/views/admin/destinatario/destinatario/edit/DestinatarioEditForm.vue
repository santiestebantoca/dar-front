<script setup>
const props = defineProps(['id', 'back'])

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useStore from '@/stores/admin-destinatarios'
import NombreInput from '../../base/inputs/DestinatarioNombreInput.vue'
import ApellidosInput from '../../base/inputs/DestinatarioApellidosInput.vue'
import TelefonoInput from '../../base/inputs/DestinatarioTelefonoInput.vue'
import CorreoInput from '../../base/inputs/DestinatarioCorreoInput.vue'
import PinInput from '../../base/inputs/DestinatarioPinInput.vue'
import ClaveInput from '../../base/inputs/DestinatarioClaveInput.vue'
import ActiveCheck from '../../base/inputs/DestinatarioActiveCheck.vue'
import { ref, watch } from 'vue'

const process = useHandleSubmit()
const store = useStore()
const sending = ref(false)
const form = ref({
  nombre: null,
  apellidos: null,
  telefono: null,
  correo: null,
  pin: null,
  clave_reparador: null,
  activo: null,
})
const result = ref({ errors: {} })
watch(() => store.destinatario.data, d => {
  form.value = {
    nombre: d.nombre,
    apellidos: d.apellidos,
    telefono: d.telefono,
    correo: d.correo,
    pin: d.pin,
    clave_reparador: d.clave_reparador,
    activo: d.activo,
  }
}, { immediate: true })
const validate = () => {
  const errors = {}
  if (!form.value.nombre) errors.nombre = 'Este campo no puede estar vacío'
  if (!form.value.apellidos) errors.apellidos = 'Este campo no puede estar vacío'
  if (!form.value.telefono) errors.telefono = 'Este campo no puede estar vacío'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  store.destinatario.put({ id: props.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        store.destinatario.get(props.id)
        store.destinatarios.get()
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
      <ApellidosInput v-model:value="form.apellidos" v-model:error="result.errors.apellidos" />
      <TelefonoInput v-model:value="form.telefono" v-model:error="result.errors.telefono" />
      <CorreoInput v-model:value="form.correo" v-model:error="result.errors.correo" />
      <PinInput v-model:value="form.pin" v-model:error="result.errors.pin" />
      <ClaveInput v-model:value="form.clave_reparador" v-model:error="result.errors.clave_reparador" />
      <ActiveCheck v-model:value="form.activo" v-model:error="result.errors.activo" />
      <bs-btn :disabled="sending" label="Guardar" class="mt-3" @click="submit" color="primary" />
    </form>
  </div>
</template>
