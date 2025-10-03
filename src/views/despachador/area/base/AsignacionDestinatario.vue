<script setup>
const props = defineProps({
  asignacion: Object,
  index: Number,
  publica: Boolean
})

import useRA_Asignacion from '@/stores/despachador-ra-asignacion'
import useRA_Asignaciones from '@/stores/despachador-ra-asignaciones'
import useTP_Asignacion from '@/stores/despachador-tp-asignacion'
import useTP_Asignaciones from '@/stores/despachador-tp-asignaciones'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const area = inject('despachador:area')
const show = ref(null)
const destinatario = computed(() => {
  const destinatario = props.asignacion.destinatario
  return (
    destinatario && {
      ...destinatario,
      classes: {
        'text-danger': !destinatario.activo,
        'fw-semibold': show.value
      }
    }
  )
})
const remove = async () => {
  loading.value++
  let asignacion, asignaciones
  if (props.publica) {
    asignacion = useTP_Asignacion()
    asignaciones = useTP_Asignaciones()
  } else {
    asignacion = useRA_Asignacion()
    asignaciones = useRA_Asignaciones()
  }
  const res = await asignacion.del(props.asignacion.id)
  if (res.data.updated) await asignaciones.get(area.value.id)
  loading.value--
}
</script>

<template>
  <div v-if="destinatario" class="py-1 pe-3 rounded" :class="[(show ? 'my-2 py-2 bg-white shadow' : 'hover-light')]">
    <div class="hstack gap-sm-2">
      <div class="align-self-baseline">
        <span class="d-inline-block text-end me-2 text-muted" style="width:24px">
          {{ index + 1 }}
        </span>
      </div>
      <div class="col text-truncate" @click="show = !show" type="button">
        <template v-if="destinatario">
          <span :class="destinatario.classes" class="me-2 text-truncate">
            {{ destinatario.nombre }}
          </span>
          <span class="text-success fw-semibold d-none d-sm-inline">
            {{ destinatario.grupos }}
          </span>
        </template>
        <span v-else class="text-danger fw-bold">
          Asignación no válida [recomendado eliminar]
        </span>
        <div v-if="show" class="lh-lg">
          <div class="col text-truncate text-muted small hstack gap-1">
            <span>{{ asignacion.created_by }}</span>
            <span>{{ asignacion.comienza && asignacion.comienza.slice(0, -3) }}</span>
          </div>
        </div>
      </div>
      <div v-if="show">
        <bs-btn-icon icon="trash" color="danger" flat style="font-size:20px" title="Eliminar asignación"
          @click="remove" />
      </div>
    </div>
  </div>
</template>
