<script setup>
const value = defineModel()

import { ref, watchEffect } from 'vue'

const value_ = ref(null)
watchEffect(() => value.value = value_.value ? '1' : '')
</script>

<template>
  <div>
    <bs-switch label="Cierre" v-model="value_" />
  </div>
</template>

<style scoped></style>
