<script setup>
const model = defineModel()
</script>

<template>
  <bs-dialog v-model="model" fullSmDown>
    <bs-dialog-header label="Descargar" />
    <bs-dialog-body>
      <div class="hstack gap-3">
        <img src="@/assets/images/dar.png" alt="DAR icon" width="72" class="rounded-3" />
        <div>
          <div class="fs-5">Consulta</div>
          <div class="text-muted">Apicación móvil de DAR</div>
          <div class="small mt-1">Última actualización: 20-08-2025</div>
        </div>
      </div>
      <div class="my-3 py-3 vstack gap-3">
        <bs-btn outline flat color="success" icon="download" href="https://10.30.12.8/consultas/Consultas.apk"
          label="Descargar para" class="py-3">
          <b class="ms-1">Android</b>
        </bs-btn>
        <!-- <bs-btn outline flat color="success" icon="download" href="https://10.30.12.8/consultas/Consultas.apk"
          label="Descargar para"><b class="ms-1">Android 6.0+</b></bs-btn>
        <bs-btn outline flat color="success" icon="download"
          href="https://10.30.12.8/consultas/Consultas_v3.0243012.apk" label="Descargar para"><b
            class="ms-1">Android</b></bs-btn> -->
      </div>
    </bs-dialog-body>
  </bs-dialog>
</template>

<style scoped></style>
