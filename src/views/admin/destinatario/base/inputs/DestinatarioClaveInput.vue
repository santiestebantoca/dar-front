<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label for="claveInput" class="form-label"> Clave </label>
    <input v-model="value" class="form-control" id="claveInput" />
    <div class="small text-danger" v-text="error"></div>
  </div>
</template>
