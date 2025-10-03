<script setup>
// App states
//  (auth===null)
//  (Navigation guard: notRequiresAuth) -> RequestedView *
//  (Navigation guard: requiresAuth) -> (get authUser)
//  | (auth===false) -> LoginView -> HomeView *
//  | (auth) -> RequestedView *
//  (inactivity) -> ExpirationView:logout() -> {PreviousView}
//  (server401) -> LoginView:logout() :: should never happend
//  (logout) -> LogoutView:logout() -> LoginView
import AppPresentation from './views/app/AppPresentation.vue'
import AppIdle from './views/app/AppIdle.vue'
import AppSnackbar from './views/app/AppSnackbar.vue'
import AppLoading from '@/views/app/AppLoading.vue'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, provide } from 'vue'

const loading = ref(0)
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md') // @media (min-width: 768px)
const xlDown = breakpoints.smaller('xl') // @media (min-width: 1200px)
provide('app:xlDown', xlDown)
provide('app:mobile', mobile)
provide('app:loading', loading)
</script>

<template>
  <AppPresentation>
    <RouterView />
  </AppPresentation>
  <template v-if="!mobile">
    <AppIdle :timeout="15" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
  </template>
  <AppSnackbar />
  <AppLoading v-model="loading" />
</template>
