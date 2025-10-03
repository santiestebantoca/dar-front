<script setup>
const value = defineModel()
const label = defineModel('label')
const props = defineProps({ disabled: Boolean })

import useStore from '@/stores/admin'
import { computed, watch } from 'vue'

const admin = useStore()
const options = computed(() => admin.env.authgroup.data)

watch(value, v => label.value = options.value.find(d => d.id === v)?.role)
</script>

<template>
  <select class="form-select" :disabled="disabled" v-model="value">
    <option :value="undefined">Todos</option>
    <option v-for="{ id, role } in options" :key="id" :value="id" v-text="role" />
  </select>
</template>
