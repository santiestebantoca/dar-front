<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="telefonoInput" class="form-label"> Teléfono </label>
    <input v-model="value" class="form-control" id="telefonoInput" />
    <div class="small text-danger" v-text="error" />
  </div>
</template>
