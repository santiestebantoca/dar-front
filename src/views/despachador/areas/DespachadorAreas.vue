<script setup>
const props = defineProps({ territorio_id: Number })

import Statusinfo from '../base/Statusinfo.vue'
import useDespachador from '@/stores/despachador'
import AreasTree from './AreasTree.vue'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { computed, watch } from 'vue'

const areas = useDespachador().areas
const target = useTeleportTarget('#despachador-status')
watch(() => props.territorio_id, val => areas.territorio_id = val, { immediate: true })
const data = computed(() => areas.asGroups) // [{ key: 1, values: [{ area }] }, ...]
const items = computed(() => data.value.map(d => ({
  id: d.values[0].territorio_id,
  label: d.values[0].territorio_nombre,
  children: d.values.map(d => ({
    id: d.id,
    automatico: d.automatico,
    label: d.nombre,
    to: { name: 'despachador-area', params: { id: d.id } }
  }))
})))
const count = computed(() => areas.count)
</script>

<template>
  <div>
    <Teleport v-if="target" to="#despachador-status">
      <Statusinfo warning label="No auto" :value="count.noauto" />
      <Statusinfo success label="Auto" :value="count.auto" />
    </Teleport>
    <div class="p-1 p-md-3" style="max-width:700px">
      <AreasTree :items="items" />
    </div>
  </div>
</template>
