<script setup>
import useAuthStore from '@/stores/auth'
import useStore from '@/stores/buzon'
import Overview from '@/views/base/Overview.vue'
import ActionsTree from './HomeTree.vue'
import Asignaciones from './Asignaciones.vue'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const mobile = inject('app:mobile')
const auth = useAuthStore()
const pending = useStore().pending
const pendientes = computed(() => pending.data)
loading.value++
pending.get().then(() => loading.value--)
const modal = ref({ asignaciones: null })
const items = computed(() => [
  {
    id: 1,
    label: 'Red de Abonado',
    children: [
      {
        id: 11,
        label: 'Reportes Pendientes',
        to: { name: 'buzon-ra-reportes' },
        right: pendientes.value.ra
      }
    ]
  },
  {
    id: 2,
    label: 'Telefonía Pública',
    children: [
      {
        id: 21,
        label: 'Reportes Pendientes',
        to: { name: 'buzon-tp-reportes' },
        right: pendientes.value.tp
      },
    ]
  }
])
</script>

<template>
  <div :class="{ mobile, large: !mobile }">
    <Overview>
      <div>
        <label class="label">Clave</label>
        <span class="fw-semibold" v-text="auth.authUser.clave"></span>
      </div>
      <div>
        <label class="label">Teléfono</label>
        <span class="fw-semibold" v-text="auth.authUser.telefono"></span>
      </div>
      <bs-dropdown>
        <bs-dropdown-toggle>
          <bs-btn icon="gear" flat size="32px" class="py-0" />
        </bs-dropdown-toggle>
        <bs-dropdown-menu>
          <bs-dropdown-item label="Asignaciones" @click="modal.asignaciones = true" />
        </bs-dropdown-menu>
      </bs-dropdown>
    </Overview>
    <div class="p-1 p-md-3" style="max-width: 240px;">
      <ActionsTree :items="items" />
    </div>
    <Asignaciones v-model="modal.asignaciones" :user_id="auth.authUser.id" />
  </div>
</template>

<style scoped>
.mobile {
  --label-font-size: .875rem;
  --label-after-content: "";
  --label-display: block;
}

.large {
  --label-after-content: ":";
}

.label {
  font-size: var(--label-font-size);
  display: var(--label-display);
  margin-right: .25rem;
}

.label::after {
  content: var(--label-after-content);
}
</style>