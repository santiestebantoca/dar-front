<script setup>
const model = defineModel()

import useStore from '@/stores/buzon'
import AsignacionCard from './AsignacionCard.vue'
import { ref, computed, watch, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore().asignaciones
watch(model, store.get, { once: true })
const tab = ref('ra')
const tabs = computed(() => ([
  { label: mobile.value ? 'RA' : 'Red de Abonado', name: 'ra', badge: store.count.ra },
  { label: mobile.value ? 'TP' : 'Telefonía Pública', name: 'tp', badge: store.count.tp }
]))
</script>

<template>
  <bs-dialog v-model="model" fullSmDown>
    <bs-dialog-header label="Asignaciones" />
    <bs-dialog-body style="min-height:300px">
      <template v-if="!store.status.loaded">
        <div class="text-center py-5">
          <bs-spinner color="primary" />
        </div>
      </template>
      <template v-else>
        <bs-tabs v-model="tab" style="position:relative;top:-8px">
          <bs-tab v-for="{ name, label, badge } in tabs" :name="name">
            <span class="me-2" v-text="label" />
            <bs-badge v-text="badge" color="light" />
          </bs-tab>
        </bs-tabs>
        <bs-tab-content v-model="tab">
          <bs-tab-pane name="ra">
            <AsignacionCard v-for="item in store.data.ra" :data="item" :key="item.id" />
          </bs-tab-pane>
          <bs-tab-pane name="tp">
            <AsignacionCard v-for="item in store.data.tp" :data="item" :key="item.id" />
          </bs-tab-pane>
        </bs-tab-content>
      </template>
    </bs-dialog-body>
  </bs-dialog>
</template>
