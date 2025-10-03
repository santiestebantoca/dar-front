<script setup>
const props = defineProps({ grid: Boolean, newItem: Function, linkItem: Function })

import ZonasFilter from './filter/ZonasFilter.vue'
import ZonasGrid from './ZonasGrid.vue'
import useStore from '@/stores/admin-zonas'
import { onUnmounted } from 'vue'

const store = useStore().zonas
store.get()
onUnmounted(store.$reset)
</script>

<template>
  <div>
    <ZonasFilter v-show="grid" style="max-width: 500px" class="mb-3" />
    <ZonasGrid v-show="grid" @rowClick="linkItem" @new="newItem" />
    <router-view />
  </div>
</template>
