<!-- from https://vuejs.org/examples/#tree -->
<script setup>
const props = defineProps({ items: Object })

import TreeItem from './AreaActionsTreeItem.vue'
import { useStorage } from '@vueuse/core'
import { provide } from 'vue'

const tree = useStorage('dar_views_despachador_area_actions_tree', [])
provide('despachador:area:actions:tree', tree)
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
  /* --tree-li-bg: var(--gg-light-1); */
}
</style>
