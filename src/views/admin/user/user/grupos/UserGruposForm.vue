<!-- 
  This compo is prepared to be used as wizard component
  Submition is automatic on `areas` change (through an async function)
  Watcher for `areas` feedback, is made to avoid infinite loop!
 -->
<script setup>
const wizard = defineModel()
const props = defineProps({
  id: Number,
  back: Function,
  end: Boolean
})

import useStore from '@/stores/admin-users'
import GruposCheck from '../../base/inputs/UserGruposCheck.vue'
import { ref, watch, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().user
const form = ref({
  grupos: []
})
watch(() => store.data, d => {
  form.value = {
    grupos: d.grupos?.map(e => e.id)
  }
}, { immediate: true })
//
watch(() => form.value.grupos, (to, from) => {
  if (to.length > from.length) update(to.find(d => !from.includes(d)), 'post')
  if (from.length > to.length) update(from.find(d => !to.includes(d)), 'del')
})
const update = async (grupo_id, action) => {
  loading.value++
  await store.grupos[action]({
    usuario_id: props.id,
    grupo_id
  })
  await store.get(props.id)
  loading.value--
}
</script>

<template>
  <div class="data-box">
    <div v-if="!wizard" class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Grupos de intervención</span>
    </div>
    <div>
      Seleccionando grupos de intervención, restringe el alcance del despachador a dichos
      grupos. Así, podrá asignar o despachar, solo a destinatarios que posean dichos grupos
      de intervención.
    </div>
    <div>
      <GruposCheck v-model:value="form.grupos" />
    </div>
    <div class="pt-4">
      <template v-if="!wizard">
        <bs-btn color="primary" label="Terminar" @click="back" />
      </template>
      <template v-if="wizard">
        <bs-btn v-if="end" color="primary" label="Terminar" @click="wizard++" />
        <bs-btn v-else color="primary" label="Siguiente" @click="wizard++" />
      </template>
    </div>
  </div>
</template>
