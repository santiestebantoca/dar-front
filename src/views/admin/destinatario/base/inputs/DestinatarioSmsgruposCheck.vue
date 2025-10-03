<!-- 
 [R-2408-1] Confirm on uncheck value 1 (Pendientes) to update model 'value'
 -->
<script setup>
const error = defineModel('error')
const value = defineModel('value', { default: [] })

import useAdminStore from '@/stores/admin'
import { watch, computed, ref } from 'vue'

const admin = useAdminStore()
const items = computed(() => admin.env.smsgrupos.data)

// confirmation logic through values
const values = ref([])
watch(value, d => values.value = d, { immediate: true })
watch(values, (to, from) => {
  if (!to.includes(1) && from.includes(1)) {
    const text = 'Todas las asignaciones que tenga el destinatario se perderán. Desea continuar?'
    if (confirm(text)) value.value = to
    else values.value.push(1)
  } else value.value = to
})

watch(value, () => error.value = null)
</script>

<template>
  <div class="p-2 rounded border overflow-auto" style="height:352px">
    <bs-checkbox v-for="{ id, nombre, descripcion } in items" :key="id" :value="id" v-model="values" :label="nombre"
      :caption="descripcion" />
  </div>
</template>
