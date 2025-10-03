<script setup>
import Header from '@/views/app/AppHeader.vue'
import Breadcrumb from './Breadcrumb.vue'
import useDespachador from '@/stores/despachador'
import { ref, inject } from 'vue'

const mobile = inject('app:mobile')
const loading = inject('app:loading')
const despachador = useDespachador()
const ready = ref(false)
loading.value++
Promise.all([
  despachador.areas.get(),
  despachador.grupos.get() // UX
]).then(() => {
  loading.value--
  ready.value = true
})
</script>

<template>
  <app-layout :view="mobile ? 'lhh lpr lff' : 'hHh lpr fff'">
    <app-header>
      <Header title="Despachador" />
      <Breadcrumb />
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-page-container>
      <app-page>
        <div class="status" id="despachador-status" :class="{ mobile, large: !mobile }" />
        <router-view v-if="ready" />
      </app-page>
    </app-page-container>
  </app-layout>
</template>

<style scoped>
.mobile {
  --min-height: 0;
  --padding-x: 4px;
}

.large {
  --min-height: 24px;
  --padding-x: 16px;
}

.status {
  display: flex;
  justify-content: end;
  padding-top: 4px;
  padding-bottom: 4px;
  gap: 4px;
  min-height: var(--min-height);
  padding-left: var(--padding-x);
  padding-right: var(--padding-x);
}
</style>