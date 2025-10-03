<!-- 
  This compo is prepared to be used as wizard component
  Submition is automatic on `grupo` change (through an async function)
  Watcher for `grupos` feedback, is made to avoid infinite loop!
 -->
<script setup>
const wizard = defineModel()
const props = defineProps({
  id: Number,
  back: Function,
  end: Boolean
})

import useAdminStore from '@/stores/admin'
import GruposCheck from '../../base/inputs/DestinatarioGruposCheck.vue'
import { ref, watch, inject } from 'vue'

const loading = inject('app:loading')
const admin = useAdminStore()
const form = ref({
  grupos: []
})
watch(() => admin.destinatarios.destinatario.data, d => {
  form.value = {
    grupos: d.grupos?.map(e => e.id)
  }
}, { immediate: true })
// submit on `areas` change
watch(() => form.value.grupos, (to, from) => {
  if (to.length > from.length) update(to.find(d => !from.includes(d)), 'post')
  if (from.length > to.length) update(from.find(d => !to.includes(d)), 'del')
})
const update = async (grupo_id, action) => {
  loading.value++
  await admin.destinatarios.destinatario.grupos[action]({
    destinatario_id: props.id,
    grupo_id
  })
  await admin.destinatarios.destinatario.get(props.id)
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
      Un destinatario puede pertenecer a varios grupos de intervención para recibir
      los reportes de quejas de SIPREC en correspondencia con estos.
    </div>
    <GruposCheck v-model:value="form.grupos" />
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
