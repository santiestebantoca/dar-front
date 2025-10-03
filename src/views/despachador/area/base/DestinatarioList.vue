<script setup>
const value = defineModel()
const props = defineProps({ draggable: Boolean })

import GrupoSelectMultiple from './GrupoSelectMultiple.vue'
import useDestinatarios from '@/stores/despachador-destinatarios'
import useDestinatario from '@/stores/despachador-destinatario'
import { useMouse } from '@vueuse/core'
import { ref, computed, nextTick, watch, inject } from 'vue'

const mobile = inject('app:mobile')
const destinatarios = useDestinatarios()
const destinatario = useDestinatario()
const { x, y } = useMouse()
const ghost = ref(null)
const search = ref(null)
const grupos = ref([]) // 'Grupo' selection
const gruposShow = ref(null)
watch(search, () => value.value = []) // That is the normal behavior of google
const _items = computed(() =>
  destinatarios.data.map(d => ({
    ...d,
    value: { telefono: d.telefono, nombre: d.nombre, id: d.id },
    cls: {
      'text-danger': !d.activo,
      'hover-light': props.draggable
    }
  })))
watch(grupos, val => {
  destinatarios.grupos = val // apply filter to destinatarios.data
  // selection.value = [] // That is the normal behavior of google
  // selectedAll.value = false // Seems to be redundant but it isn't
}, { immediate: true })
const items = computed(() => {
  let lc = (search.value || '').toLowerCase()
  const sArray = lc.replace(',', ' ').split(' ').filter(d => d)
  if (sArray.length) {
    return _items.value.filter(d => {
      const l = d.nombre.toLowerCase()
      return sArray.some(s => l.indexOf(s) >= 0)
    })
  } else return _items.value
})
const dragStart = async (ev, item_value) => {
  if (!value.value.some(d => d.id === item_value.id)) value.value = [item_value]
  await nextTick()
  ghost.value = true
  ev.dataTransfer.setDragImage(document.createElement('span'), 0, 0)
  ev.dataTransfer.setData('application/json', JSON.stringify(value.value))
  destinatario.dragstart = true
}
const dragEnd = () => {
  ghost.value = false
  destinatario.dragstart = false
}
const attrs = ref({
  style: { cursor: props.draggable ? 'grab' : '' },
  draggable: props.draggable
})
const vDrag = {
  mounted(el, binding) {
    if (props.draggable) {
      el.ondragstart = ev => dragStart(ev, binding.value)
      el.ondragend = () => dragEnd()
    }
  }
}
</script>

<template>
  <div :class="{ mobile, large: !mobile }">
    <div class="search">
      <input class="form-control" placeholder="Buscar <coma para combinar>" :value="search"
        @input="search = $event.target.value" />
      <bs-btn-icon :active="grupos.length" icon="grid-fill" color="success" :round="false" flat outline
        @click="gruposShow = !gruposShow">
        <bs-tooltip placement="bottom" offset="0,10">Seleccionar grupos</bs-tooltip>
      </bs-btn-icon>
    </div>
    <div class="search-grupos">
      <!-- <GrupoSelectMultiple v-model="grupos" class="mb-1" /> -->
      <template v-if="mobile">
        <bs-dialog v-model="gruposShow" fullSmDown>
          <bs-dialog-header label="Grupos" />
          <bs-dialog-body>
            <GrupoSelectMultiple v-model="grupos" />
          </bs-dialog-body>
          <bs-dialog-footer center>
            <bs-btn label="Listo" icon="check2" @click="gruposShow = false" />
          </bs-dialog-footer>
        </bs-dialog>
      </template>
      <GrupoSelectMultiple v-else-if="gruposShow" v-model="grupos" />
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="i in items" :key="i.id" class="list-group-item px-2 py-c text-truncate border-0">
        <input type="checkbox" :value="i.value" v-model="value">
        <span class="mx-1 px-1 rounded" v-bind="attrs" :class="i.cls" v-drag="i.value" v-text="i.nombre" />
        <span class="text-success fw-semibold" v-text="i.grupos" />
      </li>
    </ul>
    <Teleport to="body">
      <div id="ghost" v-if="ghost" :style="{ left: `${x + 8}px`, top: `${y + 8}px` }" class="shadow">
        <div v-text="value[0].nombre" />
        <div v-if="value.length > 1" v-text="value[1].nombre" />
        <div v-if="value.length > 2" v-text="value[2].nombre" />
        <div v-if="value.length > 3" v-text="value[3].nombre" />
        <div v-if="value.length === 5" v-text="value[4].nombre" />
        <div v-else-if="value.length > 5" v-text="`+ ${value.length - 4}`" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mobile {
  --search-before-content: unset;
  --serach-form-control-padding-left: .75rem;
}

.large {
  --search-before-content: "";
  --serach-form-control-padding-left: 2.25rem;
}

#ghost {
  position: fixed;
  width: 280px;
  padding: 16px;
  color: white;
  font-weight: 600;
  background-color: rgba(var(--bs-primary-rgb), .9);
  z-index: 1095;
  border-radius: 6px;
}

.list-group-item:nth-child(odd) {
  background-color: var(--gg-light-1);
}

.search {
  position: relative;
  padding: 4px;
  display: flex;
  column-gap: .25rem;
}

.search .form-control {
  padding-left: var(--serach-form-control-padding-left);
}

.search::before {
  content: var(--search-before-content);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1rem;
  width: 16px;
  height: 16px;
  background-image: url('@/assets/images/search.svg');
  background-repeat: no-repeat;
  background-position: center;
  opacity: .7;
}

.form-control::placeholder {
  opacity: .7;
}

.search-icon {
  position: absolute;
  top: 16px;
  left: 16px;
}

.py-c {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>