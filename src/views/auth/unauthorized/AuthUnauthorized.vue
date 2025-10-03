<!-- Only for `destinatario` -->
<script setup>
import useAuthStore from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>

  <div class="grid">
    <div>
      <div v-if="!auth.authUser.clave" class="card p-3 gap-3 ">
        <div>
          <bs-icon name="exclamation-circle-fill" class="text-danger" />
        </div>
        <div class="flex-fill">
          <p><b>Operario sin clave en DAR!</b></p>
          <p>
            Envie un SMS al 7487 con el texto<br>
            clave:su clave de operario
          </p>
          Ejemplo:
          <div class="text-bg-dark p-1 rounded mt-1"> clave:PEPE123</div>
        </div>
      </div>
      <div v-if="!auth.authUser.activo" class="card p-3 gap-3">
        <div>
          <bs-icon name="exclamation-circle-fill" class="text-danger" />
        </div>
        <div class="flex-fill">
          <p><b>Operario no activo en DAR!</b></p>
          <p>
            Su configuración como operario en DAR, muestra un estado de
            <b>no activo</b>. Si entiende que esto no es correcto,
            por favor, póngase en contacto con su despachador.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  max-width: 400px;
  margin: auto;
  min-height: inherit;
  display: grid;
  align-items: center;
  grid-template-rows: 1fr 72px;
}

@media (max-width: 767.98px) {
  .shadow {
    box-shadow: none !important;
  }
}

.card {
  background-color: rgba(var(--bs-danger-rgb), .2);
  border-left: solid 4px var(--bs-danger);
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>