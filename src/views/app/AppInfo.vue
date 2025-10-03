<script setup>
import useStore from '@/stores/info'
import { ref, inject, watch } from 'vue'

const mobile = inject('app:mobile')
const dialog = ref(true)
const store = useStore()
watch(dialog, val => val && store.get(), { immediate: true })
</script>

<template>
  <bs-dialog v-model="dialog" @hidden="back" full>
    <bs-dialog-header label="Información" />
    <bs-dialog-body :class="{ mobile, large: !mobile }">
      <div v-for="d in store.data">
        <div class="mb-li" v-html="d.html" />
      </div>
    </bs-dialog-body>
  </bs-dialog>
</template>

<style scoped>
.mobile {}

.large {}

.mb-li :deep(li) {
  margin-top: .5rem;
}
</style>
