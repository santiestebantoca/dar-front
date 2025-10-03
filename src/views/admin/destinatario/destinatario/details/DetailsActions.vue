<script setup>
import useStore from '@/stores/admin-destinatarios'
import { computed, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore().destinatario
const data = computed(() => store.data)
const actions = computed(() => [
  {
    label: 'Editar',
    to: { name: 'admin-destinatario-edit' },
    icon: 'pencil',
    group: mobile.value ? 1 : 0
  },
  {
    label: 'Áreas asociadas',
    to: { name: 'admin-destinatario-areas' },
    group: 1
  },
  {
    label: 'Grupos de mensajería',
    to: { name: 'admin-destinatario-smsgrupos' },
    group: 1
  },
  {
    label: 'Grupos de intervención',
    to: { name: 'admin-destinatario-grupos' },
    group: 1
  },
  ...data.value.deletable ? [{
    label: 'Eliminar',
    to: { name: 'admin-destinatario-del' },
    divider: true,
    group: 1
  }] : [],
  {
    label: 'Metadatos',
    to: { name: 'admin-destinatario-meta' },
    divider: true,
    group: 1
  }
])
</script>

<template>
  <div class="hstack gap-2">
    <bs-btn class="ms-auto" v-for="{ to, icon, label } in actions.filter(d => d.group === 0)" :to="to" :icon="icon"
      :label="label" flat />
    <bs-dropdown>
      <bs-dropdown-toggle>
        <bs-btn-icon icon="three-dots-vertical" flat />
      </bs-dropdown-toggle>
      <bs-dropdown-menu end>
        <template v-for="{ divider, to, label, click } in actions.filter(d => d.group === 1)">
          <bs-dropdown-item :to="to" :label="label" @click="click" :divider="divider" />
        </template>
      </bs-dropdown-menu>
    </bs-dropdown>
  </div>
</template>
