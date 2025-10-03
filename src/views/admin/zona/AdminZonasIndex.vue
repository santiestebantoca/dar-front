<script setup>
import { inject } from 'vue'

const title = inject('page:title')
title.value = 'Zonas'
</script>

<template>
  <router-view />
</template>
