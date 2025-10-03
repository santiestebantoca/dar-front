<script setup>
const error = defineModel('error')
const value = defineModel('value', { default: [] })

import useAdminStore from '@/stores/admin'
import { watch, computed } from 'vue'

const admin = useAdminStore()
const items = computed(() => admin.env.areas.data)

watch(value, () => error.value = null)
</script>

<template>
  <div class="p-2 rounded border overflow-auto" style="height:352px">
    <bs-checkbox v-for="{ id, nombre } in items" :key="id" :value="id" v-model="value" :label="nombre" />
  </div>
</template>
