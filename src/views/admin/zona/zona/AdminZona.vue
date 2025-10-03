<script setup>
const props = defineProps(['id'])

import useStore from '@/stores/admin-zonas'
import { computed, inject } from 'vue'

const loading = inject('app:loading')
const store = useStore().zona
const show = computed(() => store.data?.id === props.id)
loading.value++
store.get(props.id).then(() => loading.value--)
</script>

<template>
  <div v-if="show">
    <router-view />
  </div>
</template>
