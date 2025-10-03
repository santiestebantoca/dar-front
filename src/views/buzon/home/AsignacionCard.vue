<script setup>
const props = defineProps({ data: Object })

import { onClickOutside } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

const show = ref(null)
const target = useTemplateRef('target')
onClickOutside(target, () => show.value = false)
</script>

<template>
  <div @click="show = !show" class="block" :class="{ show }" ref="target">
    <bs-btn-caret :modelValue="show" class="caret" />
    <span>...</span>
    <span v-if="show">
      <div>
        <span class="text-blue">territorio</span>:
        <span class="text-pink" v-text="data.territorio" />
      </div>
      <div>
        <span class="text-blue">area</span>:
        <span class="text-pink" v-text="data.area" />
      </div>
      <div>
        <span class="text-blue" v-text="data.central ? 'central' : 'zona'" />:
        <span class="text-pink" v-text="data.central || data.zona" />
      </div>
    </span>
    <span v-else>
      <span>/</span>
      <span class="text-pink" v-text="data.area" />
      <span>/</span>
      <span class="d-inline-block">
        <span class="text-blue" v-text="data.central ? 'central' : 'zona'" />:
        <span class="text-pink" v-text="data.central || data.zona" />
      </span>
    </span>
  </div>
</template>

<style scoped>
.text-pink {
  color: var(--bs-pink);
}

.text-blue {
  color: var(--bs-blue);
}

.block {
  position: relative;
  padding: 4px 4px 7px 24px;
  color: var(--bs-gray-500);
  cursor: pointer;
  border-radius: 5px;
}

.block:hover,
.block.show {
  background-color: var(--gg-light-1);
}

.caret {
  position: absolute;
  left: 8px;
  top: 4px;
  color: var(--bs-gray);
}
</style>
