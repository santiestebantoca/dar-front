<script setup>
const props = defineProps({ back: Function })

import useDestinatarios from '@/stores/despachador-destinatarios'
import useSMS from '@/stores/despachador-sms'
import useSnackbar from '@/stores/snackbar'
import GrupoSelectMultiple from '../base/GrupoSelectMultiple.vue'
// import { useTeleportTarget } from '@/use/useTeleportTarget'
import { ref, watch, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const loading = inject('app:loading')
// const target = useTeleportTarget('#app-footer-content')
const destinatarios = useDestinatarios()
const snackbar = useSnackbar()
const sms = useSMS()
const dialog = ref(true) // model for main dialog
const gruposShow = ref(null)
const para = ref(null) // model for `destinatarios` dialog in mobile env
const form = ref({
  destinatarios: new Set(),
  message: null,
})
//
// search logic
//
const search = ref(null)
// watch(search, () => value.value = []) // That is the normal behavior of google
const _items = computed(() =>
  destinatarios.data.map(d => ({
    ...d,
    value: { telefono: d.telefono, nombre: d.nombre, id: d.id },
    cls: {
      'text-danger': !d.activo
    }
  })))
const items = computed(() => {
  let lc = (search.value || '').toLowerCase()
  const sArray = lc.replace(',', ' ').split(' ').filter(d => d)
  if (sArray.length) {
    return _items.value.filter(d => {
      const l = d.nombre.toLowerCase()
      return sArray.some(s => l.indexOf(s) >= 0)
    })
  } else return _items.value
})
//
const grupos = ref([])
watch(grupos, val => destinatarios.grupos = val, { immediate: true })
//
const selDest = val => {
  if (form.value.destinatarios.has(val)) form.value.destinatarios.delete(val)
  else form.value.destinatarios.add(val)
}
//
// send message
const send = () => {
  const data = []
  form.value.destinatarios.forEach(({ telefono }) => data.push({ telefono, message: form.value.message }))
  loading.value++
  Promise.all(data.map(d => sms.post(d)))
    .then(res => {
      loading.value--
      // if (res.every(v => v === '1')) {
      dialog.value = false
      //   notifyOk()
      // } else notifyFails()
    })
    .catch(() => {
      loading.value--
      // notifyFails()
    })
}
const notifyOk = () => snackbar.add({
  text: 'Mensajes entregados.',
  color: 'success',
  icon: 'check2-circle'
})
const notifyFails = () => snackbar.add({
  text: 'Algunos mensajes no se entregaron.',
  color: 'danger',
  icon: 'exclamation-triangle'
})
watch(dialog, () => {
  form.value.destinatarios.clear()
  form.value.message = null
})
const disable = computed(() => !(form.value.destinatarios.size && form.value.message))
</script>

<template>
  <bs-dialog v-model="dialog" full @hidden="back">
    <div class="p-1 p-md-2 hstack">
      <bs-btn-back @click="dialog = false" />
      <h5 class="m-0">SMS</h5>
      <bs-btn v-if="mobile" :disable="disable" icon="send" class="ms-auto py-0" size="32px" @click="send" />
    </div>
    <bs-dialog-body class="p-0 vstack">
      <div class="border d-flex gap-1 gap-md-3 p-2 p-md-3 align-items-baseline" @click="para = true">
        <label class="my-1">Para</label>
        <div class="flex-fill hstack gap-1 gap-md-3 flex-wrap overflow-hidden">
          <div v-for="d in form.destinatarios" class="border bg-light-2 rounded-5 px-1 text-truncate">
            <span v-text="d.nombre" class="small px-2 lh-lg fw-semibold text-dark" />
          </div>
        </div>
      </div>
      <textarea class="m-0 p-2 p-md-3 flex-fill overflow-auto" v-model="form.message" />
    </bs-dialog-body>
    <bs-dialog-footer v-if="!mobile">
      <bs-btn :disable="disable" label="Enviar" color="primary" class="me-auto" @click="send" />
    </bs-dialog-footer>
  </bs-dialog>
  <!-- / -->
  <!-- Dialog for `destinatarios` in mobile env -->
  <bs-dialog v-model="para" full>
    <!-- title & done button -->
    <div class="p-1 p-md-2 hstack">
      <bs-btn-back @click="para = false" />
      <h5 class="m-0">Destinatarios</h5>
      <div v-if="form.destinatarios.size" class="text-nowrap ms-auto">
        <bs-btn icon="check2" label="Listo" color="primary" flat outline @click="para = false" />
      </div>
    </div>
    <div class="p-2">
      <!-- selection widget -->
      <div v-if="form.destinatarios.size" id="selection" class="py-2 hstack gap-2 flex-wrap">
        <div v-for="d in form.destinatarios" class="border bg-light-2 rounded-5 px-1 text-truncate hstack">
          <bs-btn-icon class="text-danger bg-white" flat round size="20px" @click="selDest(d)">
            <bs-icon name="x" fs="18px" />
          </bs-btn-icon>
          <span v-text="d.nombre" class="text-truncate small px-2 lh-lg fw-semibold text-dark" />
        </div>
      </div>
      <!-- search widget -->
      <div class="search">
        <div class="position-relative flex-fill">
          <input class="form-control" placeholder="Buscar nombre" :value="search" @input="search = $event.target.value"
            style="padding-right: 40px;" />
          <bs-btn v-if="search" icon="x-lg" class="position-absolute end-0" @click="search = null" />
        </div>
        <bs-btn-icon :active="grupos.length" icon="grid-fill" color="success" :round="false" flat
          @click="gruposShow = !gruposShow">
          <bs-tooltip placement="bottom" offset="0,10">Seleccionar grupos</bs-tooltip>
        </bs-btn-icon>
      </div>
      <!-- Grupo filter -->
      <div class="search-grupos">
        <template v-if="mobile">
          <bs-dialog v-model="gruposShow" fullSmDown>
            <bs-dialog-header label="Grupos" />
            <bs-dialog-body>
              <GrupoSelectMultiple v-model="grupos" />
            </bs-dialog-body>
            <bs-dialog-footer center>
              <bs-btn label="Listo" icon="check2" @click="gruposShow = false" />
            </bs-dialog-footer>
          </bs-dialog>
        </template>
        <GrupoSelectMultiple v-else-if="gruposShow" v-model="grupos" class="mx-0" />
      </div>
      <!-- / Grupo filter -->
    </div>
    <bs-dialog-body class="destinatarios p-1">
      <ul class="list-group list-group-flush">
        <li v-for="i in items" :key="i.id" class="list-group-item border-0" :class="i.cls" v-text="i.nombre"
          @click="selDest(i.value)" type="button" />
      </ul>
    </bs-dialog-body>
  </bs-dialog>
  <!-- / -->
</template>

<style scoped>
.search {
  position: relative;
  /* padding: 4px; */
  display: flex;
  column-gap: .25rem;
}

.bg-light-200 {
  background-color: var(--bs-gray-200);
}

.input {
  /* padding: 6px 12px; */
  /* border: solid 1px transparent; */
  /* background-color: var(--bs-gray-200); */
  /* border-radius: 6px;
  width: 100%;
  outline: none; */
}

textarea {
  border: none;
  width: 100%;
  resize: none;
  outline: none;
}

/* Destinatarios dialog */
.destinatarios {}

/* / */

/** */
.list-group-item {
  --bs-bg-opacity: 1;
  background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity));
}

.list-group-item:nth-child(even) {
  --bs-bg-opacity: 0.3;
}
</style>
