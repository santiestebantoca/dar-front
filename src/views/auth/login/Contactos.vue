<script setup>
const model = defineModel()
</script>

<template>
  <bs-dialog v-model="model" fullSmDown>
    <bs-dialog-header label="Contactos" />
    <bs-dialog-body>
      <div class="hstack gap-3 my-3">
        <bs-btn-icon class="bg-info mb-auto mx-1">
          <bs-icon name="person" style="color:var(--bs-light)" fs="1.7rem" />
        </bs-btn-icon>
        <div>
          <h6 class="fw-semibold">Oney Rodríguez Crespo</h6>
          <p class="text-muted mb-2">
            +5352181307<br>
            oney.rodriguez@etecsa.cu
          </p>
        </div>
      </div>
      <!-- <div class="hstack gap-3 my-3">
        <bs-btn-icon class="bg-info mb-auto mx-1">
          <bs-icon name="person" style="color:var(--bs-light)" fs="1.7rem" />
        </bs-btn-icon>
        <div>
          <h6 class="fw-semibold">Yosey Escalona Hernández</h6>
          <p class="text-muted mb-2">
            +5352889385<br>
            yosey.escalona@etecsa.cu
          </p>
        </div>
      </div> -->
    </bs-dialog-body>
  </bs-dialog>
</template>

<style scoped></style>
