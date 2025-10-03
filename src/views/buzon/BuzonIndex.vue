<script setup>
import Header from '@/views/app/AppHeader.vue'
import Breadcrumb from './Breadcrumb.vue'
import useStore from '@/stores/buzon'
import { inject } from 'vue'

const mobile = inject('app:mobile')
const loading = inject('app:loading')
const claves = useStore().claves
loading.value++
claves.get().then(() => loading.value--)
</script>

<template>
  <app-layout :view="mobile ? 'lhh lpr lff' : 'hHh lpr fff'">
    <app-header>
      <Header title="Buzón" />
      <Breadcrumb />
      <div id="buzon-header-bottom" />
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-page-container>
      <app-page class="py-1">
        <router-view v-if="claves.status.loaded" />
      </app-page>
    </app-page-container>
  </app-layout>
</template>
