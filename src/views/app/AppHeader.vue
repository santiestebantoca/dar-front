<script setup>
const props = defineProps({ title: { default: "DAR" } })

import AppInfo from '@/views/app/AppInfo.vue'
import UserWidget from './widgets/user/Dropdown.vue'
import { ref, inject } from 'vue'

const mobile = inject('app:mobile')
//
const info = ref(false)
</script>

<template>
  <nav class="navbar" :class="{ mobile }">
    <div class="container-fluid">
      <!-- left (menu button) -->
      <slot />
      <!-- title / subtitle -->
      <span class="navbar-brand text-truncate">
        <span v-text="title" />
      </span>
      <!-- separator -->
      <span class="ms-auto" />
      <!-- right -->
      <div id="app-header-actions" />
      <!-- App Info -->
      <bs-btn-icon size="24px" color="warning" @click="info = true" class="me-md-2">
        <bs-icon fs="20px" name="info" class="text-danger" />
      </bs-btn-icon>
      <!-- User menu -->
      <UserWidget />
    </div>
    <AppInfo v-model="info" />
  </nav>
</template>

<style scoped>
.navbar {
  --container-fluid-px: 12px;
  --navbar-py: 2px;
  padding-top: var(--navbar-py);
  padding-bottom: var(--navbar-py);
}

.navbar.mobile {
  --container-fluid-px: 4px;
}

.navbar-brand {
  color: var(--bs-secondary);
  padding: 0;
  position: relative;
  top: -2px;
}

.container-fluid {
  padding: 0 var(--container-fluid-px);
}
</style>
