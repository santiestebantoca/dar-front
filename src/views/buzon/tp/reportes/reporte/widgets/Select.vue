<script setup>
const value = defineModel()
const props = defineProps({
  options: { type: Array, default: [] },
  placeholder: { type: String, default: 'NADA SELECCIONADO' }
})

import { watchEffect, ref, inject } from 'vue'

const mobile = inject('app:mobile')
const selection = ref([])
const available = ref([])
const search = ref(null)
const filter = val => search.value
  ? val.toLowerCase().includes(search.value.toLowerCase())
  : true
watchEffect(() => selection.value = value.value.map(d => props.options.find(e => e.value === d)))
watchEffect(() => available.value = props.options.filter(d => !value.value.includes(d.value) && filter(d.display_name)))
const remove = val => value.value = value.value.filter(d => d !== val)
const select = val => !value.value.includes(val) && value.value.push(val)
</script>

<template>
  <div class="widget">
    <div class="selection">
      <template v-if="selection.length">
        <div v-for="d in selection" class="selection-item">
          <bs-btn-icon icon="x" flat size="22px" @click="remove(d.value)" style="font-size: 18px;">
            <bs-tooltip placement="bottom" offset="0,10">Quitar</bs-tooltip>
          </bs-btn-icon>
          <span v-text="d.alias || d.display_name" @dblclick="remove(d.value)" type="button" class="hover-opacity" />
        </div>
      </template>
      <template v-else>
        <span class="selection-placeholder" v-text="placeholder" />
      </template>
    </div>
    <div class="available">
      <div class="search">
        <input class="form-control" placeholder="Buscar" :value="search" @input="search = $event.target.value" />
        <bs-btn-icon v-if="search" icon="x-lg" flat size="32px" @click="search = null">
          <bs-tooltip placement="bottom" offset="0,10">Quitar</bs-tooltip>
        </bs-btn-icon>
      </div>
      <div class="list">
        <div v-for="d in available" v-text="d.alias || d.display_name" @dblclick="select(d.value)" class="list-item"
          @click="mobile && select(d.value)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget {
  max-width: 768px;
  --selection-available-padding: 6px 8px;
  --selection-item-padding: 3px 4px 3px 30px;
}

.widget {
  border: solid 1px var(--bs-gray-400);
  border-radius: var(--bs-border-radius);
}

.selection-placeholder {
  color: var(--bs-secondary);
  padding: var(--selection-item-padding);
  position: relative;
}

.selection-placeholder::before {
  content: "--";
  position: absolute;
  top: .125rem;
  left: .5rem;
}

.text-purple {
  color: var(--bs-indigo);
}

.list {
  padding-top: 6px;
  padding-bottom: 6px;
  height: 200px;
  overflow: auto;
  margin-top: 4px;
}

.list-item {
  padding: 4px;
  cursor: pointer;
  border-radius: 5px;
  user-select: none;
}

.list-item:hover {
  background-color: var(--gg-light-1);
  color: var(--bs-link-hover-color);

}

.selection {
  padding: var(--selection-available-padding);
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  margin-bottom: var(--selection-margin-bottom);
}

.selection-item {
  padding: var(--selection-item-padding);
  border-radius: 1rem;
  width: fit-content;
  position: relative;
  user-select: none;
}

.selection-item .btn {
  background-color: var(--gg-light-2);
  background-color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: .25rem;
  color: var(--bs-danger);
}

.available {
  border: var(--selection-availabre-border);
  padding: var(--selection-available-padding);
  border-radius: 5px;
}

.search {
  position: relative;
}

.search .form-control {
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  padding-left: .25rem;
  box-shadow: none !important;
}

.search .btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 6px;
}

.search .form-control::placeholder {
  opacity: .5;
}

.hover-opacity:hover {
  opacity: .7;
}
</style>
