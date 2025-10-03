<!--
  https://github.com/devstark-com/vue-textarea-autosize/issues/34
  ... on some mobile browser the (v-model) binding doesn't update until
  the user types space.
-->
<script setup>
const error = defineModel('error')
const value = defineModel()

import useStore from '@/stores/buzon'
import { ref, computed, watch, onMounted } from 'vue'

const claves = useStore().claves
const focus = ref(null) // input focus
onMounted(() => claves.search = null)
const emit = defineEmits(['select'])
const select = (id, clave) => {
  claves.search = clave
  value.value = clave
  claves.history.add(id)
  emit('select')
}
const input = val => {
  value.value = null
  claves.search = val.toUpperCase()
}
const items = computed(() => claves.widget)
// control appearance and behavior
const vInput = {
  mounted: el => {
    el.onfocus = () => focus.value = true
    el.onblur = () => focus.value = false
    el.oninput = () => input(el.value)
  }
}
const attrs = computed(() => ({
  value: claves.search,
  placeholder: 'Buscar',
}))
const active = computed(() => focus.value)
const warning = computed(() => !active.value && !value.value)
const vUpdateScrollTop = { updated: el => el.scrollTop = 0 }
//
watch(value, () => error.value = null)
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <input class="form-control mb-3" :class="{ warning }" v-input v-bind="attrs">
    <div class="small text-danger" v-text="error"></div>
    <div v-update-scrollTop class="overflow-auto border rounded flex-fill">
      <li v-for="{ clave, id, caption, history } in items" :key="id">
        <a class="dropdown-item text-wrap" type="button" @click="select(id, clave)" :class="{ history }">
          <div>
            <span v-text="clave" /> <br>
            <span class="small text-success" v-text="caption" />
          </div>
          <bs-btn-icon v-if="history" color="danger" @click.stop="claves.history.del(id)" icon="x" flat size="30px"
            class="ms-auto d-hover" />
        </a>
      </li>
    </div>
  </div>
</template>

<style scoped>
.warning {
  color: var(--bs-danger);
}

.dropdown-item {
  padding: 4px 8px;
  min-height: 40px;
  height: unset;
  border-bottom: solid 1px var(--bs-gray-300);
}

.dropdown-item:hover {
  background-color: var(--bs-gray-100);
}

.dropdown-item.history {
  font-weight: 600;
}

*:not(:hover)>.d-hover {
  display: none;
}
</style>
