<script setup>
const props = defineProps({ down: Boolean })

import UserWidget from '@/views/app/widgets/user/Dialog.vue'
import HomeWidget from '@/views/app/widgets/home/Button.vue'
import nav from './base/nav'
</script>

<template>
  <div class="h-100 d-flex flex-column bg-light-1 overflow-auto gap-1 pb-4">
    <bs-btn-close v-if="down" @click="$emit('hide')" class="m-1 ms-auto" />
    <h5 v-else class="p-3 mb-3">Administración</h5>
    <div class="px-1">
      <bs-btn v-for="_ in nav" flat color="primary" :to="_.to" @click="$emit('hide')" :label="_.label"
        class="w-100 text-start" />
    </div>
    <div class="m-auto" />
    <div class="border-bottom" />
    <div class="px-1">
      <HomeWidget />
    </div>
    <div class="border-bottom" />
    <UserWidget class="px-1" />
  </div>
</template>
