<script setup>
import useDespachador from '@/stores/despachador'
import { useRoute } from 'vue-router'
import { ref, computed, inject, watch } from 'vue'

const mobile = inject('app:mobile')
const show = ref(null)
const route = useRoute()
const despachador = useDespachador()
const area = computed(() => {
  if (route.matched.some(r => r.name === "despachador-area")) {
    const area_id = parseInt(route.params.id)
    return despachador.areas.data?.find(a => a.id === area_id)
  }
  return null
}, { immediate: true })
const territorio = computed(() => {
  if (area.value)
    return {
      id: area.value.territorio_id,
      nombre: area.value.territorio_nombre
    }
  else if (route.name === "despachador-areas" && route.query.territorio) {
    const territorio_id = parseInt(route.query.territorio)
    if (despachador.areas.data) {
      const area = despachador.areas.data.find(a => a.territorio_id === territorio_id)
      return (area && {
        id: area.territorio_id,
        nombre: area.territorio_nombre
      })
    }
  }
  return null
})
const areaOptions = computed(() => {
  if (route.meta.area?.option) {
    return {
      label: route.meta.area.option,
      options: [
        {
          label: 'RA Asignaciones',
          to: { name: 'despachador-area-ra-asignaciones' }
        },
        {
          label: 'RA Despacho manual',
          to: { name: 'despachador-area-ra-manual' }
        },
        {
          label: 'RA Órdenes de Servicio',
          to: { name: 'despachador-area-ra-ordenes' }
        },
        {
          label: 'TP Asignaciones',
          to: { name: 'despachador-area-tp-asignaciones' },
          divider: true
        },
        {
          label: 'TP Despacho manual',
          to: { name: 'despachador-area-tp-manual' }
        }
      ]
    }
  }
})
const items = computed(() => {
  return [
    {
      icon: mobile.value ? '' : 'house-door',
      label: mobile.value ? 'Inicio' : '',
      to: { name: 'index' },
    },
    {
      divider: !mobile.value,
      label: 'Áreas',
      to: { name: 'despachador-areas' },
    },
    ...territorio.value ? [{
      divider: !mobile.value,
      label: territorio.value.nombre,
      to: { name: 'despachador-areas', query: { territorio: territorio.value.id } },
    }] : [],
    ...area.value ? [{
      divider: !mobile.value,
      label: area.value.nombre,
      to: { name: 'despachador-area', params: { id: area.value.id } },
    }] : [],
    ...areaOptions.value && !mobile.value
      ? [{ divider: !mobile.value, ...areaOptions.value }]
      : []
  ]
})
const toggle = () => mobile.value && (show.value = !show.value)
watch(mobile, () => show.value = false)
</script>

<template>
  <div class="bar" @click="toggle">
    <div v-if="mobile" class="fw-semibold nav-link" v-text="items.at(-1).label" />
    <ul class="navbar-nav" :class="{ show }">
      <template v-for="i in items">
        <div v-if="i.divider" class="vr" />
        <li class="nav-item">
          <router-link v-if="i.to" :to="i.to" class="nav-link">
            <bs-icon v-if="i.icon" :name="i.icon" />
            <span v-if="i.label" v-text="i.label" />
          </router-link>
          <bs-dropdown v-if="i.options" class="nav-item">
            <bs-dropdown-toggle class="nav-link" type="button" icon v-text="i.label" />
            <bs-dropdown-menu class="shadow">
              <template v-for="{ divider, to, label, header } in i.options">
                <bs-dropdown-item :to="to" :label="label" :divider="divider" :header="header" />
              </template>
            </bs-dropdown-menu>
          </bs-dropdown>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
:deep(.router-link-exact-active) {
  display: none;
}

.bar {
  background-color: #dadcde;
  color: rgb(100, 110, 120);
  padding: 0 4px;
  min-height: 26px;
}

.navbar-nav {
  display: none;
  flex-direction: column;
}

.navbar-nav.show {
  display: flex;
}

.nav-link {
  padding: 0 10px;
  height: 26px;
  display: flex;
  align-items: center;
  color: rgba(90, 100, 110, 1);
  font-size: 0.875em;
}

.navbar-nav.show .nav-link {
  height: 32px;
}

.vr {
  margin-top: 2px;
  margin-bottom: 2px;
}

@media (min-width: 768px) {
  .navbar-nav {
    display: flex;
    flex-direction: row;
  }
}
</style>
