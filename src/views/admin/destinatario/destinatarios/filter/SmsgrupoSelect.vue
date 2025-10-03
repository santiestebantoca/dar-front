<script setup>
const value = defineModel()
const label = defineModel('label')
const props = defineProps(['disabled'])

import useAdminStore from '@/stores/admin'
import { computed, watch } from 'vue'

const admin = useAdminStore()
const options = computed(() => admin.env.smsgrupos.data)

watch(value, v => label.value = options.value.find(d => d.id === v)?.nombre)
</script>

<template>
  <select class="form-select" :disabled="disabled" v-model="value">
    <option :value="undefined">Todos</option>
    <option v-for="{ id, nombre } in options" :key="id" :value="id" v-text="nombre" />
  </select>
</template>
