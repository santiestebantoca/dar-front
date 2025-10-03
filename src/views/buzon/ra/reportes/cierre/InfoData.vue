<script setup>
const props = defineProps(['data'])

import { ref, computed } from 'vue'

const index = ref(0)
const display = computed(() => props.data?.length ? props.data[index.value] : null)
const click = () => {
  const maxIndex = props.data.length - 1
  index.value = index.value === maxIndex ? 0 : index.value + 1
}
</script>

<template>
  <bs-btn v-if="display" @click="click" flat color="secondary">
    <span v-text="display.text" />:
    <span class="text-dark fw-semibold" v-text="display.value" />
  </bs-btn>
</template>