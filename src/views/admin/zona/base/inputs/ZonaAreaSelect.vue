<script setup>
const value = defineModel('value')
const error = defineModel('error')
const props = defineProps(['disabled'])

import useAdminStore from '@/stores/admin'
import { ref, computed, watch } from 'vue'

const admin = useAdminStore()
const oneOption = ref(null)
const options = computed(() => admin.env.areas.data)

watch(value, v => error.value = null)
//
// special case of one option
watch(options, ops => oneOption.value = ops?.length === 1, { immediate: true })
watch(oneOption, v => v && (value.value = options.value[0].id), { immediate: true })
</script>

<template>
  <div>
    <label for="areaSelect" class="form-label">Pertenece al área</label>
    <select class="form-select" :disabled="disabled || oneOption" v-model="value" id="areaSelect">
      <option v-for="{ id, nombre } in options" :key="id" :value="id" v-text="nombre" />
    </select>
    <div class="small text-danger" v-text="error" />
  </div>
</template>
