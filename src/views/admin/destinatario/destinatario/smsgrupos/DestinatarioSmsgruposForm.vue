<!-- 
  This compo is prepared to be used as wizard component
  Submition is automatic on `smsgrupos` change (through an async function)
  Watcher for `smsgrupos` feedback, is made to avoid infinite loop!
 -->
<script setup>
const wizard = defineModel()
const props = defineProps({
  id: Number,
  back: Function,
  end: Boolean
})

import useAdminStore from '@/stores/admin'
import SmsgruposCheck from '../../base/inputs/DestinatarioSmsgruposCheck.vue'
import { ref, watch, inject } from 'vue'

const loading = inject('app:loading')
const admin = useAdminStore()
const form = ref({
  smsgrupos: []
})
watch(() => admin.destinatarios.destinatario.data, d => {
  form.value = {
    smsgrupos: d.smsgrupos?.map(e => e.id)
  }
}, { immediate: true })
//
watch(() => form.value.smsgrupos, (to, from) => {
  if (to.length > from.length) update(to.find(d => !from.includes(d)), 'post')
  if (from.length > to.length) update(from.find(d => !to.includes(d)), 'del')
})
const update = async (smsgrupo_id, action) => {
  loading.value++
  await admin.destinatarios.destinatario.smsgrupos[action]({
    destinatario_id: props.id,
    smsgrupo_id
  })
  await admin.destinatarios.destinatario.get(props.id)
  loading.value--
}
</script>

<template>
  <div class="data-box">
    <div v-if="!wizard" class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Grupos de mensajería</span>
    </div>
    <div>
      Un destinatario pertenecer a uno o varios grupos de mensajería.
    </div>
    <SmsgruposCheck v-model:value="form.smsgrupos" />
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
