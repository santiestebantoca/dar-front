<script setup>
const props = defineProps({
  data: Object,
  level: { type: Number, default: 0 },
  index: { type: Number, default: 0 },
})

import TreeItem from './AreasTreeItem.vue'
import { toggleArray } from '@/use/useToggle'
import { computed, inject } from 'vue'

const tree = inject('despachador:areas:tree')
const branch = computed(() => props.data.children?.length)
const show = computed(() => tree.value.includes(props.data.id))
const visibility = computed(() => props.data.children?.length ? 'visible' : 'hidden')
const tag = computed(() => props.data.to ? 'router-link' : 'div')
const click = id => branch.value && (tree.value = toggleArray(tree.value, id))
</script>

<template>
  <li class="tree-li" :class="{ even: index % 2 }">
    <component :is="tag" type="button" :to="data.to" @click="click(data.id)">
      <bs-btn-caret :style="{ visibility }" v-model="show" class="me-1" />
      <span v-text="data.label" class="text-truncate" />
      <template v-if="!branch">
        <div v-if="data.automatico" class="success led" title="Modo automático" />
        <div v-else class="warning led" title="Modo manual" />
      </template>
    </component>
  </li>
  <ul v-if="branch && show" class="tree-ul">
    <TreeItem v-for="item, i in data.children" :data="item" :key="item.id" :index="i" :level="level + 1" />
  </ul>
</template>

<style scoped>
.tree-li>* {
  --tree-li-level: v-bind(level) !important;
}
</style>