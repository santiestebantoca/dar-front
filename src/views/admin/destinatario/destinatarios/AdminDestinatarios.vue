<script setup>
const props = defineProps({ grid: Boolean, newItem: Function, linkItem: Function })

import DestinatariosFilter from './filter/DestinatariosFilter.vue'
import DestinatariosGrid from './DestinatariosGrid.vue'
import useStore from '@/stores/admin-destinatarios'
import { onUnmounted } from 'vue'

const store = useStore().destinatarios
store.get()
onUnmounted(store.$reset)
</script>

<template>
  <div>
    <DestinatariosFilter v-show="grid" style="max-width: 500px" class="mb-3" />
    <DestinatariosGrid v-show="grid" @rowClick="linkItem" @new="newItem" />
    <router-view />
  </div>
</template>
