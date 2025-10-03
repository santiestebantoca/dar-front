<script setup>
import useStore from '@/stores/dashboard'
import { computed, onUnmounted, onMounted, inject } from 'vue'

const title = inject('page:title')
const loading = inject('app:loading')
const store = useStore().database
const items = computed(() => {
  return store.data && [
    {
      name: 'asignacion',
      data: [
        { a: 'Registros', v: store.data.asignacion.registros },
        { a: 'Asignaciones inactivas', v: store.data.asignacion.inactivos }
      ],
      action: {
        text: 'BORRAR INACTIVAS',
        action: () => action('asignacion')
      }
    },
    {
      name: 'pendiente',
      data: [
        { a: 'Registros', v: store.data.pendiente.registros },
        { a: 'Posibles repetidos', v: store.data.pendiente.repetidos }
      ],
      action: {
        text: 'BORRAR ANTIGUOS',
        action: () => action('pendiente')
      }
    },
    {
      name: 'profile',
      data: [
        { a: 'Registros', v: store.data.profile.registros },
        ...store.data.profile.minfecha
          ? [{ a: 'Antigüedad', v: store.data.profile.minfecha.slice(0, 10) }]
          : []
      ],
      action: {
        text: 'BORRAR ANTIGUOS',
        action: () => action('profile')
      }
    },
  ]
})
loading.value++
store.get().finally(() => loading.value--)
const action = async (table) => {
  store.remove(table)
  store.get()
}
const vCollapse = el => {
  el.onclick = () => {
    el.classList.toggle('show')
    el.querySelector('.collapse').classList.toggle('d-none')
  }
}
onMounted(() => title.value = 'Tablas vigiladas')
onUnmounted(() => title.value = '')
</script>

<template>
  <div class="pt-3" style="max-width: 500px;">
    <div v-for="{ name, data, action } in items" class="x mb-1 p-2 hstack gap-2" :key="name" v-collapse>
      <div class="bg-info p-2 align-self-baseline">
        <bs-icon name="table" fs="42px" />
      </div>
      <div class="flex-fill">
        <div class="fw-semibold" v-text="name" />
        <div class="hstack" style="flex-wrap: wrap;gap:0 16px">
          <div v-for="{ a, v } in data" class="text-nowrap">
            <span class="text-dark-emphasis" v-text="a + ':'" />
            <span class="fw-semibold ms-2" v-text="v" />
          </div>
        </div>
        <div class="collapse justify-content-end d-flex pt-3 pb-1 px-2 d-none">
          <bs-btn color="primary" flat @click.stop="action.action" :label="action.text" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.x:hover {
  background-color: var(--gg-light-2);
}
</style>