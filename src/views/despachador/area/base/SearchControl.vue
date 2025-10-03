<script setup>
const value = defineModel()
const props = defineProps({ fields: Array })

import { ref, watch } from 'vue'

const inputEl = ref(null)
const dropdown = ref(null)
const monitor = ref(null) // input value attr
const field = ref(null)
const input = ev => {
  monitor.value = ev.target.value
  dropdown.value = false
  const x = monitor.value.split(':')
  value.value = x.length === 2 ? { field: field.value.value, value: x[1] } : null
}
watch(monitor, val => {
  if (field.value) {
    if (!field.value.readonly && !val.startsWith(field.value.text + ':')) {
      monitor.value = field.value.text + ':'
    }
  }
})
watch(field, val => {
  value.value = null
  if (val) {
    monitor.value = val.text
    if (val.readonly) {
      value.value = { field: val.value, value: val.default }
      inputEl.value.setAttribute('readonly', true)
    } else {
      inputEl.value.removeAttribute('readonly')
      inputEl.value.focus()
    }
  }
})
const reset = () => dropdown.value = monitor.value = field.value = null
</script>

<template>
  <bs-dropdown>
    <bs-dropdown-toggle v-model="dropdown" class="position-relative">
      <input ref="inputEl" class="form-control" placeholder="Buscar valores" :value="monitor" @input="input">
      <bs-btn-icon v-if="field" icon="x" size class="close" flat @click.stop="reset" color="danger" />
    </bs-dropdown-toggle>
    <bs-dropdown-menu class="overflow-auto" style="max-height: 320px;min-width: 100%;">
      <bs-dropdown-item v-for="f in fields" @click="field = f" :label="f.text" />
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
.form-control {
  padding: 3px 32px;
  background-image: url('@/assets/images/search.svg');
  background-repeat: no-repeat;
  background-position: 8px center;
}

.close {
  position: absolute;
  top: 3px;
  right: 4px;
  font-size: 1.5rem;
}
</style>
