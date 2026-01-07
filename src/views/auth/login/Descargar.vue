<script setup>
const model = defineModel()

import useApk from '@/stores/apk'

const apk = useApk()
apk.get()
</script>

<template>
  <bs-dialog v-model="model" fullSmDown>
    <bs-dialog-header label="Descargar" />
    <bs-dialog-body>
      <div class="hstack gap-3">
        <img src="@/assets/images/dar.png" alt="DAR icon" width="72" class="rounded-3" />
        <div>
          <div class="fs-5">Consultas</div>
          <div class="text-muted">Apicación móvil de DAR</div>
          <div class="small mt-1" v-text="apk.data.version" style="min-height: 21px;" />
        </div>
      </div>
      <div class="my-3 py-3 vstack gap-3">
        <bs-btn outline flat color="success" icon="download" :href="apk.data.link" label="Descargar para" class="py-3">
          <b class="ms-1">Android</b>
        </bs-btn>
      </div>
    </bs-dialog-body>
  </bs-dialog>
</template>

<style scoped></style>
