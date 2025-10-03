<!-- 
 if wizard is NOT terminated, the created record in deleted on unmount
 -->
<script setup>
const props = defineProps({ back: Function })

import useSnackbarStore from '@/stores/snackbar'
import useStore from '@/stores/admin-destinatarios'
import DestinatarioNewForm from './DestinatarioNewForm.vue'
import DestinatarioAreasFrom from '../destinatario/areas/DestinatarioAreasForm.vue'
import DestinatarioSmsgruposForm from '../destinatario/smsgrupos/DestinatarioSmsgruposForm.vue'
import DestinatarioGruposForm from '../destinatario/grupos/DestinatarioGruposForm.vue'
import { ref, watch, computed, onBeforeUnmount } from 'vue'

const snackbar = useSnackbarStore()
const store = useStore()
const wizard = ref(1)
const id = ref(null)
const terminated = computed(() => wizard.value === 5)
watch(id, v => store.destinatario.get(v).then(() => wizard.value++))
watch(terminated, () => {
  snackbar.add('Registro creado.')
  store.destinatarios.get().then(() => props.back())
})
onBeforeUnmount(() => {
  if (id.value && !terminated.value) store.destinatario.del(id.value)
})
//
// wizard nav
const wizardLabels = ['', 'Datos generales', 'Áreas asociadas', 'Grupos de mensajería', 'Grupos de intervención']
const wizardIcon = computed(() => `${wizard.value}-circle`)
const wizardLabel = computed(() => wizardLabels[wizard.value])
</script>

<template>
  <div class="data-box">
    <div class="data-header">
      <bs-btn-back @click="back" />
      <span class="fs-5">Nuevo registro</span>
    </div>
    <!-- wizard steps  -->
    <div v-if="!terminated" class="hstack gap-3 mt-md-1 mb-1 mb-md-3">
      <bs-icon :name="wizardIcon" fs="24px" class="text-success" />
      <span class="opacity-50 fw-semibold" v-text="wizardLabel" />
    </div>
    <!-- / -->
    <DestinatarioNewForm v-if="wizard === 1" v-model="id" />
    <DestinatarioAreasFrom v-else-if="wizard === 2" :id="id" v-model="wizard" />
    <DestinatarioSmsgruposForm v-else-if="wizard === 3" :id="id" v-model="wizard" />
    <DestinatarioGruposForm v-else-if="wizard > 3" :id="id" v-model="wizard" end />
  </div>
</template>
