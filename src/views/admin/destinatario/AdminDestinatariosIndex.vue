<script setup>
import { inject } from 'vue'

const title = inject('page:title')
title.value = 'Destinatarios'
</script>

<template>
  <router-view />
</template>
