<!-- 
  store.query is the source of true
  form is not sync with store.query until submition
 -->
<script setup>
const DIRECTFIELD = 'nombre'

import TerritorioSelect from './TerritorioSelect.vue'
import AreaSelect from './AreaSelect.vue'
import GrupoSelect from './GrupoSelect.vue'
import SmsgrupoSelect from './SmsgrupoSelect.vue'
import useAdminStore from '@/stores/admin'
import { ref, computed, watch } from 'vue'

const admin = useAdminStore()
const store = admin.destinatarios.destinatarios
const dropdown = ref(null)
const formDefault = {
  nombre: null,
  clave: null,
  pin: null,
  telefono: null,
  territorio: undefined, // select field ::{id, label}
  area: undefined, // select field ::{id, label}
  grupo: undefined, // select field ::{id, label}
  smsgrupo: undefined, // select field ::{id, label}
  no_area: false,
  no_activo: false,
}
const form = ref({ ...formDefault })
const label = ref({})
const monitor = ref(null)
//
const submit = () => {
  const validEntries = Object.entries(form.value).filter(([k, v]) => v)
  store.query = Object.fromEntries(validEntries)
  dropdown.value = false
  //
  let text = []
  if (store.query.nombre) text.push(store.query.nombre)
  if (store.query.clave) text.push('clave:' + store.query.clave)
  if (store.query.pin) text.push('pin:' + store.query.pin)
  if (store.query.telefono) text.push('tel:' + store.query.telefono)
  if (store.query.no_area) text.push('-area')
  else if (store.query.area) text.push('area:' + label.value.area)
  else if (store.query.territorio) text.push('terr:' + label.value.territorio)
  if (store.query.grupo) text.push('grupo:' + label.value.grupo)
  if (store.query.smsgrupo) text.push('smsgr:' + label.value.smsgrupo)
  if (store.query.no_activo) text.push('-activo')
  monitor.value = text.join(' ')
}
const reset = () => {
  form.value = { ...formDefault }
  submit()
}
const filtered = computed(() => store.isFiltered)
const direct = computed(() => !filtered.value || ((filtered.value === 1) && store.query[DIRECTFIELD]))
//
// special relationships between fields (values and behaviors)
watch(() => form.value.territorio, v => {
  admin.env.areas.territorio = v
  form.value.area = undefined
})
watch(() => form.value.no_area, () => form.value.territorio = form.value.area = undefined)
</script>

<template>
  <bs-dropdown class="x">
    <div class="margin">
      <form v-if="direct" @submit.prevent="submit">
        <input v-model="form[DIRECTFIELD]" placeholder="Buscar en nombre" class="form-control" />
      </form>
      <input v-else :value="monitor" readonly class="form-control" @click.stop="dropdown = true">
    </div>
    <bs-btn-icon icon="search" flat :disabled="!direct" @click="submit" class="btn-1" />
    <bs-btn-close v-if="filtered" @click="reset" class="btn-2" />
    <bs-dropdown-toggle auto="outside" v-model="dropdown">
      <bs-btn-icon icon="sliders2" flat class="btn-3" />
    </bs-dropdown-toggle>
    <bs-dropdown-menu class="p-3 w-100">
      <form @submit.prevent>
        <div class="label-input">
          <label class="form-label">Nombre</label>
          <input v-model="form[DIRECTFIELD]" class="form-control" />
        </div>
        <div class="row">
          <div class="col-auto label-input">
            <label class="form-label">Clave</label>
            <input class="form-control" v-model="form.clave" style="width:200px" />
          </div>
          <div class="col-auto label-input">
            <label class="form-label">Pin</label>
            <input class="form-control" v-model="form.pin" style="width:120px" />
          </div>
          <div class="col-auto label-input">
            <label class="form-label">Teléfono</label>
            <input class="form-control" v-model="form.telefono" style="max-width:160px" />
          </div>
        </div>
        <div class="label-input">
          <label class="form-label">Territorio</label>
          <TerritorioSelect v-model="form.territorio" v-model:label="label.territorio" :disabled="form.no_area" />
        </div>
        <div class="label-input">
          <label class="form-label">Área</label>
          <AreaSelect v-model="form.area" v-model:label="label.area" :disabled="form.no_area" />
        </div>
        <div class="label-input">
          <label class="form-label text-nowrap">Grupo de interv.</label>
          <GrupoSelect v-model="form.grupo" v-model:label="label.grupo" />
        </div>
        <div class="label-input">
          <label class="form-label text-nowrap">Grupo SMS</label>
          <SmsgrupoSelect v-model="form.smsgrupo" v-model:label="label.smsgrupo" />
        </div>
        <div class="row py-1">
          <div class="col-auto label-input">
            <input type="checkbox" v-model="form.no_area" class="me-3" />
            <label>Sin área</label>
          </div>
          <div class="col-auto label-input">
            <input type="checkbox" v-model="form.no_activo" class="me-3" />
            <label>Desactivado</label>
          </div>
        </div>
        <bs-btn label="Buscar" color="primary" @click="submit" />
      </form>
    </bs-dropdown-menu>
  </bs-dropdown>
</template>

<style scoped>
.label-input {
  margin-bottom: 13px;
  white-space: nowrap;
}

.form-label {
  font-weight: 600;
  font-size: .875em;
}

@media(min-width:500px) {
  .label-input {
    display: flex;
    align-items: center;
  }

  .label-input>*:nth-child(2) {
    flex-grow: 1;
  }

  .form-label {
    padding-right: 16px;
    font-size: 1rem !important;
    font-weight: normal !important;
    color: var(--bs-gray-700);
    margin-bottom: 0;
  }
}

.x {
  border-radius: 2rem;
  background-color: #eaf1fb;
  height: 46px;
  padding: 1px 0;
}

.margin {
  margin: 0 76px 0 38px;
}

.margin .form-control {
  box-shadow: none;
  border: none;
  background-color: transparent;
  line-height: 2;
}

.btn-1 {
  position: absolute !important;
  top: 4px;
  left: 6px;
}

.btn-2 {
  position: absolute !important;
  top: 4px;
  right: 43px;
}

.btn-3 {
  position: absolute !important;
  top: 4px;
  right: 6px;
}
</style>
