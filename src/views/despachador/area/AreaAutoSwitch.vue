<script setup>
import useDespachador from '@/stores/despachador'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const mobile = inject('app:mobile')
const area = inject('despachador:area')

const dialog = ref(null)
const despachador = useDespachador()
const model = computed({
  get() { return area.value.automatico },
  set(val) {
    const data = { params: { automatico: val } }
    loading.value++
    despachador.area.automatico.put(data)
      .then(() => despachador.areas.get())
      .finally(() => loading.value--)
  }
})
const log = computed(() => despachador.area.automatico.data)
</script>

<template>
  <div :class="{ mobile }">
    <label class="label">Despacho automático</label>
    <div class="hstack gap-3">
      <bs-checkbox :label="area.automatico ? 'Si' : 'No'" v-model="model" class="fw-bold mb-0 py-0" />
      <bs-btn-icon flat @click="dialog = true" icon="clock-history" size="26px">
        <bs-tooltip placement="bottom" offset="0,10">Historial de cambios</bs-tooltip>
      </bs-btn-icon>
    </div>
    <bs-dialog v-model="dialog" fullSmDown>
      <bs-dialog-header label="Despacho automático" />
      <bs-dialog-body>
        <p class="fw-bold">
          Últimas operaciones.
        </p>
        <table class="table table-sm">
          <tbody>
            <tr v-for="item in log">
              <td class="text-nowrap">Auto: {{ item.automatico }}</td>
              <td class="text-dark text-opacity-75">
                [{{ item.fecha.slice(0, 16) }}] {{ item.username }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="despachador.area.automatico.loaded && !log.length">No hay operaciones registradas.</p>
        <p v-if="despachador.area.automatico.loading">Cargando...</p>
      </bs-dialog-body>
    </bs-dialog>
  </div>
</template>

<style scoped>
.mobile {
  --label-font-size: .875rem;
}

.label {
  font-size: var(--label-font-size);
}
</style>