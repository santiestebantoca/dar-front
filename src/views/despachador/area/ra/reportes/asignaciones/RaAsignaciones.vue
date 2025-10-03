<script setup>
import CentralZona from "./CentralZona.vue"
import CentralZonaDestinatario from "./CentralZonaDestinatario.vue"
import DestinatarioDrag from "@/views/despachador/area/base/DestinatarioDrag.vue"
import useDestinatarios from '@/stores/despachador-destinatarios'
import Statusinfo from '@/views/despachador/base/Statusinfo.vue'
import { useTeleportTarget } from '@/use/useTeleportTarget'
import { breakpointsBootstrapV5, useBreakpoints } from "@vueuse/core"
import { useElementBounding, useWindowSize } from "@vueuse/core"
import { watch } from 'vue'

const destinatarios = useDestinatarios()
const target = useTeleportTarget('#despachador-status')
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const lgDown = breakpoints.smaller('lg')
//
// logic to set section height
const vHeight = {
  mounted: el => {
    const { top } = useElementBounding(el)
    const { height } = useWindowSize()
    watch([height, top], ([h, t]) => el.style.height = `${h - t - 4}px`, { immediate: true })
  }
}
</script>

<template>
  <Teleport v-if="target && destinatarios.status.loaded" to="#despachador-status">
    <Statusinfo secondary label="Destinatarios" :value="destinatarios.count.all" />
    <Statusinfo ifValue warning title="Inactivos" :value="destinatarios.count.inactive" />
  </Teleport>
  <div>
    <div v-if="lgDown">
      <CentralZonaDestinatario />
    </div>
    <div v-else class="hstack align-items-start gap-1 gap-xl-3" v-height>
      <div class="w-50 h-100 overflow-auto">
        <CentralZona />
      </div>
      <div class="w-50 h-100 overflow-auto">
        <DestinatarioDrag />
      </div>
    </div>
  </div>
</template>
