<script setup>
const props = defineProps({ back: Function })

import Actions from './DetailsActions.vue'
import useStore from '@/stores/admin-users'
import { computed } from 'vue'

const store = useStore().user
const data = computed(() => store.data)
const data_ = computed(() => [
  ...data.value.registration_key
    ? [{
      label: 'Estado',
      value: data.value.registration_key,
      cls: 'text-danger'
    }]
    : [],
  { label: 'Nombre', value: data.value.name },
  { label: 'Usuario', value: data.value.username },
  { label: 'Email', value: data.value.email }
])
const areas = computed(() => data.value.areas)
const grupos = computed(() => data.value.grupos)
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <Actions class="ms-auto" />
    </div>
    <div v-for="{ label, value, cls } in data_" :key="value">
      <label v-text="label" class="data-label" />
      <div v-text="value" :class="cls" class="data-value" />
    </div>
    <div>
      <label class="data-label">Áreas que despacha</label>
      <ul class="data-ul">
        <template v-if="areas.length">
          <li v-for="a in areas" :key="a.id" v-text="a.nombre" />
        </template>
        <li v-else>-</li>
      </ul>
    </div>
    <div>
      <label class="data-label">Grupos de intervención</label>
      <ul class="data-ul">
        <template v-if="grupos.length">
          <li v-for="g in grupos" :key="g.id">
            <span v-text="g.nombre" />
            <span class="mx-1">-</span>
            <span class="text-muted" v-text="g.descripcion" />
          </li>
        </template>
        <li v-else>-</li>
      </ul>
    </div>
    <router-view />
  </div>
</template>