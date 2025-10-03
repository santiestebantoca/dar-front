<script setup>
import useDestinatarios from '@/stores/despachador-destinatarios'
import useDestinatario from '@/stores/despachador-destinatario'
// import GrupoSelectMultiple from './GrupoSelectMultiple.vue'
import DestinatarioList from './DestinatarioList.vue'
import { ref, watch, inject } from 'vue'

const loading = inject('app:loading')
const destinatarios = useDestinatarios()
const destinatario = useDestinatario()
// const grupos = ref([]) // 'Grupo' selection
const selection = ref([]) // destinatarios
const selectedAll = ref(false) // SelectAll input value
// watch(grupos, val => {
//   destinatarios.grupos = val // apply filter to destinatarios.data
//   selection.value = [] // That is the normal behavior of google
//   selectedAll.value = false // Seems to be redundant but it isn't
// }, { immediate: true })
watch(selectedAll, to => {
  selection.value = to
    ? destinatarios.data.map(d => ({ telefono: d.telefono, nombre: d.nombre, id: d.id }))
    : []
})
const activate = async active => {
  const data = { activo: active }
  loading.value++
  await Promise.all(
    selection.value.map(({ id }) => destinatario.put({ id, data }))
  ).catch(() => { })
  await destinatarios.get()
  loading.value--
}
</script>

<template>
  <div class="px-1">
    <div class="position-sticky top-0 hstack gap-3 ps-2 text-bg-secondary small fw-semibold z-1">
      <input type="checkbox" v-model="selectedAll">
      <span class="p-1" type="button" @click.prevent="activate(true)">Activar</span>
      <span class="p-1" type="button" @click.prevent="activate(false)">Desactivar</span>
    </div>
    <!-- <GrupoSelectMultiple v-model="grupos" /> -->
    <DestinatarioList v-model="selection" draggable />
  </div>
</template>