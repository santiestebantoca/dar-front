<script setup>
const dialog = defineModel()

import useStore from '@/stores/buzon-tp'

const store = useStore().reportes
const submit = () => {
  store.filter.apply()
  dialog.value = false
}
const reset = () => {
  store.filter.reset()
  dialog.value = false
}
const vPlaceholder = (el) => {
  if (el.value === '-') el.classList.add('ph')
  else el.classList.remove('ph')
}
</script>

<template>
  <bs-dialog v-model="dialog" fullSmDown>
    <bs-dialog-header label="Filtros" />
    <form @submit.prevent class="m-0">
      <bs-dialog-body>
        <label class="form-label">Modelo</label>
        <select class="form-select mb-3" v-model="store.filter.by.modelo" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.modelo" :value="value" v-text="label" />
        </select>
        <label class="form-label">Alarma</label>
        <select class="form-select mb-3" v-model="store.filter.by.codigos_de_alarma" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.codigos_de_alarma" :value="value" v-text="label" />
        </select>
        <label class="form-label">Categoría</label>
        <select class="form-select mb-3" v-model="store.filter.by.categoria" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.categoria" :value="value" v-text="label" />
        </select>
        <label class="form-label">Estado</label>
        <select class="form-select mb-3" v-model="store.filter.by.estados_pendientes" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.estados_pendientes" :value="value" v-text="label" />
        </select>
      </bs-dialog-body>
      <bs-dialog-footer start>
        <bs-btn label="APLICAR" color="primary" @click="submit" style="min-width:100px" />
        <bs-btn label="QUITAR" color="light" @click="reset" style="min-width:100px" />
      </bs-dialog-footer>
    </form>
  </bs-dialog>
</template>
