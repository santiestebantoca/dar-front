<script setup>
const dialog = defineModel()
const selection = defineModel('selection')

import GrupoSelectMultiple from './GrupoSelectMultiple.vue'
import DestinatarioList from './DestinatarioList.vue'
import useDestinatarios from '@/stores/despachador-destinatarios'
import { ref, watch } from 'vue'

const destinatarios = useDestinatarios()
const grupos = ref([])
watch(grupos, val => destinatarios.grupos = val, { immediate: true })
</script>

<template>
  <bs-dialog v-model="dialog" lg fullSmDown>
    <bs-dialog-header label="Destinatarios" border />
    <bs-dialog-body class="p-1 overflow-auto" style="height:60vh">
      <!-- <GrupoSelectMultiple v-model="grupos" class="mb-1" /> -->
      <DestinatarioList v-model="selection" />
    </bs-dialog-body>
    <bs-dialog-footer border>
      <button class="btn btn-primary" @click="$emit('despachar')" :disabled="!selection?.length">
        Enviar
      </button>
    </bs-dialog-footer>
  </bs-dialog>
</template>