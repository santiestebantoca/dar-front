<script setup>
const dialog = defineModel()

import useStore from '@/stores/buzon-ra'

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
        <label class="form-label">Central</label>
        <select class="form-select mb-3" v-model="store.filter.by.nombpta" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.nombpta" :value="value" v-text="label" />
        </select>
        <label class="form-label">Zona</label>
        <select class="form-select mb-3" v-model="store.filter.by.zona" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.zona" :value="value" v-text="label" />
        </select>
        <label class="form-label">Servicio</label>
        <select class="form-select mb-3" v-model="store.filter.by.telefono" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.telefono" :value="value" v-text="label" />
        </select>
        <label class="form-label">Problema</label>
        <select class="form-select mb-3" v-model="store.filter.by.problema" v-placeholder>
          <option :value="undefined">-</option>
          <option v-for="{ value, label } in store.filter.options.problema" :value="value" v-text="label" />
        </select>
      </bs-dialog-body>
      <bs-dialog-footer start>
        <bs-btn label="APLICAR" color="primary" @click="submit" style="min-width:100px" />
        <bs-btn label="QUITAR" color="light" @click="reset" style="min-width:100px" />
      </bs-dialog-footer>
    </form>
  </bs-dialog>
</template>

<style scoped>
.form-label {
  font-size: .875rem;
  font-weight: 600;
}

select option:first-child,
.ph {
  color: var(--bs-gray-600);
}

select option:not(:first-child) {
  color: var(--bs-dark) !important;
}
</style>