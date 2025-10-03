<script setup>
const dialog = defineModel()

import useStore from '@/stores/buzon-ra'

const store = useStore().reportes
const submit = () => {
  store.order.apply()
  dialog.value = false
}
const reset = () => {
  store.order.reset()
  dialog.value = false
}
</script>

<template>
  <bs-dialog v-model="dialog" fullSmDown>
    <bs-dialog-header label="Ordenar" />
    <bs-dialog-body>
      <bs-radio label="Demora Total" value="demorat" v-model="store.order.by.field" />
      <bs-radio label="Problema" value="problema" v-model="store.order.by.field" />
      <div class="mt-3 hstack gap-4 border rounded-3 px-2" style="width: 174px;">
        <bs-radio label="Asc" value="asc" v-model="store.order.by.direction" />
        <bs-radio label="Desc" value="desc" v-model="store.order.by.direction" />
      </div>
    </bs-dialog-body>
    <bs-dialog-footer start>
      <bs-btn label="APLICAR" color="primary" @click="submit" style="min-width:100px" />
      <bs-btn label="QUITAR" color="light" @click="reset" style="min-width:100px" />
    </bs-dialog-footer>
  </bs-dialog>
</template>
