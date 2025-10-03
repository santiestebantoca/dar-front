<script setup>
const props = defineProps({ area_id: Number })

import useDespachador from '@/stores/despachador'
import useDestinatarios from '@/stores/despachador-destinatarios'
import { ref, computed, watch, provide, inject } from 'vue'

const loading = inject('app:loading')
const mobile = inject('app:mobile')
const despachador = useDespachador()
const destinatarios = useDestinatarios()
watch(() => props.area_id, val => despachador.area.get(val), { immediate: true })
const area = computed(() => despachador.area.data)
provide('despachador:area', area)
loading.value++
destinatarios.get(props.area_id).then(() => loading.value--) // UX
const to = ref({
  sms: { name: 'despachador-area-sms' }
})
</script>

<template>
  <div :class="{ mobile, large: !mobile }">
    <div class="hstack px-3">
      <div class="col text-truncate">
        <div class="title">
          <span v-text="area.nombre" class="area" />
          <span v-if="$route.meta.area?.option" class="fw-light" v-text="$route.meta.area?.option" />
        </div>
      </div>
      <div class="col-auto">
        <router-link :to="to.sms">
          <i class="bi-envelope-fill text-primary-emphasis" />
        </router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.mobile {
  --title-area-display: none;
}

.large {
  --title-font-size: 1.25rem;
  --title-top: -4px;
}

.title {
  position: relative;
  top: var(--title-top);
  color: var(--bs-primary-text-emphasis);
  font-size: var(--title-font-size);
}

.title .area {
  margin-right: 8px;
  display: var(--title-area-display);
}
</style>
