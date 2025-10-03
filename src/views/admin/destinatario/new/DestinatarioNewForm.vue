<script setup>
const id = defineModel()

import useHandleSubmit from '@/use/useHandleSubmit.js'
import NombreInput from '../base/inputs/DestinatarioNombreInput.vue'
import ApellidosInput from '../base/inputs/DestinatarioApellidosInput.vue'
import TelefonoInput from '../base/inputs/DestinatarioTelefonoInput.vue'
import CorreoInput from '../base/inputs/DestinatarioCorreoInput.vue'
import PinInput from '../base/inputs/DestinatarioPinInput.vue'
import ClaveInput from '../base/inputs/DestinatarioClaveInput.vue'
import useStore from '@/stores/admin-destinatarios'
import { ref } from 'vue'

const process = useHandleSubmit()
const store = useStore().destinatario
const sending = ref(false)
const result = ref({ errors: {} })
const form = ref({
  nombre: null,
  apellidos: null,
  telefono: null,
  correo: null,
  pin: null,
  clave_reparador: null
})
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
  store.post(form.value)
    .then(res => process.POST(res.data,
      id_ => id.value = id_,
      errors => result.value.errors = errors))
    .finally(() => sending.value = false)
}
</script>

<template>
  <form @submit.prevent class="data-form">
    <NombreInput v-model:error="result.errors.nombre" v-model:value="form.nombre" />
    <ApellidosInput v-model:error="result.errors.apellidos" v-model:value="form.apellidos" />
    <TelefonoInput v-model:error="result.errors.telefono" v-model:value="form.telefono" />
    <CorreoInput v-model:error="result.errors.correo" v-model:value="form.correo" />
    <PinInput v-model:error="result.errors.pin" v-model:value="form.pin" />
    <ClaveInput v-model:error="result.errors.clave_reparador" v-model:value="form.clave_reparador" />
    <bs-btn :disabled="sending" label="Siguiente" class="mt-3" @click="submit" color="primary" />
  </form>
</template>
