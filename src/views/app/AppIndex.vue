<script setup>
import Header from './AppHeader.vue'
import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()
const actions = computed(() => {
  const { admin, admin_territorial, despachador } = auth.authUser
  return [
    ...admin || admin_territorial
      ? [{
        label: 'Administrador',
        to: { name: 'admin' },
        icon: 'gear',
        class: 'btn-info'
      }] : [],
    ...despachador
      ? [{
        label: 'Despachador',
        to: { name: 'despachador' },
        icon: 'list-check',
        class: 'btn-primary'
      }] : [],
    ...admin
      ? [{
        label: 'Dashboard',
        to: { name: 'dashboard' },
        icon: 'speedometer2',
        class: 'btn-secondary'
      }] : []
  ]
})
</script>

<template>
  <app-layout>
    <app-header class="bg-white">
      <Header title="Inicio" />
      <div class="welcome">Bienvenido</div>
    </app-header>
    <app-page-container>
      <app-page>
        <div class="grid px-2 pt-2 pt-md-5">
          <h4 class="bg-light p-3 text-primary-emphasis">INICIO</h4>
          <template v-for="action in actions">
            <router-link :to="action.to" class="btn text-white p-3 w-100" :class="action.class">
              <bs-icon :name="action.icon" fs="48px" />
              <div class="mt-2 lead" v-text="action.label" />
            </router-link>
          </template>
        </div>
      </app-page>
    </app-page-container>
  </app-layout>
</template>

<style scoped>
.welcome {
  height: 26px;
  display: flex;
  align-items: center;
  background-color: #dadcde;
  color: rgb(100, 110, 120);
  padding-left: 12px;
}

.grid {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
  max-width: 720px;
  margin: 0 auto;
}

.grid h4 {
  grid-column: 1/-1;
}

/* BS sm */
@media (min-width: 576px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
