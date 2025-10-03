<script setup>
import Overview from '@/views/base/Overview.vue'
import AreaAutoSwitch from './AreaAutoSwitch.vue'
import AreaActionsTree from './AreaActionsTree.vue'
import { ref } from 'vue'

const items = ref([
  {
    id: 1,
    label: 'Red de Abonado',
    children: [
      {
        id: 11,
        label: 'Reportes',
        children: [
          {
            id: 111,
            label: 'Asignaciones para despacho automático',
            to: { name: 'despachador-area-ra-asignaciones' }
          },
          {
            id: 112,
            label: 'Despacho manual',
            to: { name: 'despachador-area-ra-manual' }
          }
        ]
      },
      {
        id: 12,
        label: 'Órdenes de Servicio',
        children: [
          {
            label: 'Despacho manual',
            to: { name: 'despachador-area-ra-ordenes' }
          }]
      }
    ]
  },
  {
    id: 2,
    label: 'Telefonía Pública',
    children: [
      {
        id: 21,
        label: 'Averías',
        children: [
          {
            id: 211,
            label: 'Asignaciones para despacho automático',
            to: { name: 'despachador-area-tp-asignaciones' }
          },
          {
            id: 212,
            label: 'Despacho manual',
            to: { name: 'despachador-area-tp-manual' }
          }
        ]
      },
    ]
  }
])
</script>

<template>
  <Overview>
    <AreaAutoSwitch />
  </Overview>
  <div class="p-1 p-md-3" style="max-width: 360px;">
    <AreaActionsTree :items="items" />
  </div>
</template>
