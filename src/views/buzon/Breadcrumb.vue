<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const route = useRoute()
const aClasses = ref('px-2 text-decoration-none text-reset')
const level = computed(() => ({ home: route.name === "buzon-home" }))
const stage = computed(() => {
  if (route.matched.some(r => r.name === 'buzon-ra-reportes'))
    return { key: 'RA Reportes', values: [{ to: { name: 'buzon-tp-reportes' }, label: 'TP Reportes' }] }
  else if (route.matched.some(r => r.name === 'buzon-tp-reportes'))
    return { key: 'TP Reportes', values: [{ to: { name: 'buzon-ra-reportes' }, label: 'RA Reportes' }] }
  else return null
})
</script>

<template>
  <div class="navbar navbar-expand-md small">
    <div class="container-fluid">
      <span v-if="level.home"> Bienvenido </span>
      <div v-else class="d-flex align-items-center">
        <router-link :class="aClasses" :to="{ name: 'buzon' }">
          <bs-icon name="house-door" style="margin-bottom: 3px;" />
        </router-link>
        <template v-if="stage">
          <div class="vr h75 bg-dark" />
          <bs-dropdown>
            <bs-dropdown-toggle>
              <span class="px-2 dropdown-toggle" type="button" v-text="stage.key" />
            </bs-dropdown-toggle>
            <bs-dropdown-menu class="shadow" style="min-width:200px">
              <bs-dropdown-item v-for="{ to, label } in stage.values" :to="to" :label="label" />
            </bs-dropdown-menu>
          </bs-dropdown>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  min-height: 26px;
  padding: 0;
  background-color: #dadcde;
  color: rgb(100, 110, 120);
}
</style>
