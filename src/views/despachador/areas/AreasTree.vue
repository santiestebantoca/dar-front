<!-- from https://vuejs.org/examples/#tree -->
<script setup>
const props = defineProps({ items: Object })

import TreeItem from './AreasTreeItem.vue'
import { useStorage } from '@vueuse/core'
import { provide } from 'vue'

const tree = useStorage('dar_views_despachador_areas_tree', [])
provide('despachador:areas:tree', tree)
</script>

<template>
  <ul class="tree-ul">
    <TreeItem v-for="item in items" :data="item" :key="item.id" :level="0" />
  </ul>
</template>

<style scoped>
.tree-ul,
:deep(.tree-ul) {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

:deep(.tree-li>*) {
  --tree-li-level: 0;
  --tree-li-ms: calc(var(--tree-li-level) * .5rem);
  --tree-li-bg: transparent;
  margin-left: var(--tree-li-ms);
  background-color: var(--tree-li-bg);
  padding: 4px 4px 4px 0;
  display: flex;
  text-decoration: none;
  border-radius: 3px;
}

:deep(.tree-li.even>*) {
  --tree-li-bg: var(--gg-light-1);
}

:deep(.led) {
  border-radius: 2px;
  min-height: 24px;
  width: 8px;
  margin-left: auto;
}

:deep(.led.success) {
  background-color: #4caf50;
}

:deep(.led.warning) {
  background-color: #fb8c00;
}
</style>
