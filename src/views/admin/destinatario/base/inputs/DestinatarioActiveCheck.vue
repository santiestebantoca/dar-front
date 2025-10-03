<script setup>
const error = defineModel('error')
const value = defineModel('value')

import { watch } from 'vue'

watch(value, () => error.value = null)
</script>

<template>
  <div>
    <label class="form-label"> Activo </label>
    <bs-checkbox v-model="value" />
    <div class="small text-danger" v-text="error" />
  </div>
</template>
