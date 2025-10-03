<script setup>
const props = defineProps(['periodo'])

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import useDashboardStore from '@/stores/dashboard'
import { ref, computed, watch, onUnmounted, onMounted, inject } from 'vue'

const title = inject('page:title')
const loading = inject('app:loading')
const dashboard = useDashboardStore()
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
const chartOptions = ref({
  responsive: true,
  plugins: { legend: { display: false } },
  elements: { line: { borderWidth: 2, tension: 0 }, point: { radius: 0, hitRadius: 3 } }
})
const periods = ref([
  { to: { query: { periodo: 1 } }, label: 'Hoy' },
  { to: { query: { periodo: 2 } }, label: 'Ayer' },
  { to: { query: { periodo: 3 } }, label: 'Esta semana' },
])
const label = computed(() => ['', 'Hoy', 'Ayer', 'Esta semana'][props.periodo])
watch(() => props.periodo, periodo => {
  loading.value++
  dashboard.sms.get({ periodo }).finally(() => loading.value--)
}, { immediate: true })
onMounted(() => title.value = 'SMS profile')
onUnmounted(() => title.value = '')
</script>

<template>
  <div class="pt-3" style="max-width: 900px;">
    <div class="mb-3">
      <bs-dropdown>
        <bs-dropdown-toggle>
          <bs-btn :label="label" color="primary" flat>
            <bs-btn-caret class="ms-1" />
          </bs-btn>
        </bs-dropdown-toggle>
        <bs-dropdown-menu>
          <bs-dropdown-item v-for="{ to, label } in periods" :to="to" :label="label" />
        </bs-dropdown-menu>
      </bs-dropdown>
    </div>
    <div v-if="!dashboard.sms.loading">
      <div class="border border-primary p-2">
        <h5>smsgw.outbox </h5>
        <h6 class="sub-title">Cantidad de mensajes procesados</h6>
        <div class="bg-white p-2 my-2">
          <Line :data="dashboard.sms.data.data" :options="chartOptions" width="4" height="1"></Line>
        </div>
        <div class="hstack gap-3">
          <div class="hstack gap-2 align-items-baseline">
            <span class="text-dark-emphasis">Total:</span>
            <h5 v-text="dashboard.sms.data.promedio" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
