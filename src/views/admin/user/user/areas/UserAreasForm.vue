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

import useAdminStore from '@/stores/admin'
import AreasCheck from '../../base/inputs/UserAreasCheck.vue'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const admin = useAdminStore()
const form = ref({
  areas: []
})
watch(() => admin.users.user.data, d => {
  form.value = {
    areas: d.areas?.map(e => e.id)
  }
}, { immediate: true })
//
watch(() => form.value.areas, (to, from) => {
  if (to.length > from.length) update(to.find(d => !from.includes(d)), 'post')
  if (from.length > to.length) update(from.find(d => !to.includes(d)), 'del')
})
const update = async (area_id, action) => {
  loading.value++
  await admin.users.user.areas[action]({
    usuario_id: props.id,
    area_id
  })
  await admin.users.user.get(props.id)
  loading.value--
}

// "territorio" filter
const territorios = computed(() => admin.env.territorios.data)
const territorio = ref(null)
watch(territorio, val => admin.env.areas.territorio = val, { immediate: true })
</script>

<template>
  <div class="data-box">
    <div v-if="!wizard" class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Áreas que despacha</span>
    </div>
    <div>
      Puede seleccionar áreas de cualquier territorio administrado.
    </div>
    <select v-model="territorio" class="form-select">
      <option v-for="{ id, nombre } in territorios" :value="id" v-text="nombre" />
    </select>
    <AreasCheck v-model:value="form.areas" />
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
