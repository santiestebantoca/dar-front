<script setup>
import useStore from '@/stores/admin-zonas'
import { ref, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore()
const selected = ref(null)
const data = computed(() => store.zonas.data)
const rows = computed(() => (
  data.value?.map((r) => ({
    id: r.id,
    click: () => select(r.id),
    cls: {
      'table-primary': r.id === selected.value
    },
    cols: [
      { text: r.nombre, caption: r.descripcion, cls: '' }
    ]
  }))
))
const emit = defineEmits(['rowClick', 'new'])
const select = id => {
  selected.value = id
  emit('rowClick', id)
}
// Pagination
const pagination = computed(() => store.zonas.page.text)
const btnDown = computed(() => ({
  action: () => {
    store.zonas.page.prev()
    store.zonas.get()
  },
  disable: store.zonas.page.prevDisabled
}))
const btnUp = computed(() => ({
  action: () => {
    store.zonas.page.next()
    store.zonas.get()
  },
  disable: store.zonas.page.nextDisabled
}))
//
const info = ref(null)
</script>

<template>
  <div class="data-box">
    <div class="d-none d-xl-block">
      Las zonas de DAR, son equivalentes a las zonas de SIPREC.
      Las zonas de DAR deben tener el mismo nombre de sus equivalentes de SIPREC para que se emparejen en DAR.
      <span v-if="info">
        Esto es esencial en la lógica de despacho automático de reportes asociados a zonas.
        Una zona de DAR pertenece a un área (equivalente a centro telefónico de SIPREC), mientras que una zona de
        SIPREC, en última instancia, también pertenece a un centro telefónico.
      </span>
      <a v-else href="#" @click.prevent="info = true" class="text-decoration-none">Más...</a>
    </div>
    <!-- Add button / Pagination -->
    <div class="hstack justify-content-between">
      <!-- Add button -->
      <bs-btn-icon v-if="mobile" @click="$emit('new')" icon="plus-lg" color="primary" />
      <bs-btn v-else @click="$emit('new')" icon="plus-lg" color="primary" isize="14" label="Nuevo registro" outline
        rounded flat />
      <!-- Pagination -->
      <div class="hstack">
        <span class="small text-muted ms-auto me-2" v-text="pagination" />
        <bs-btn-pg-down :disable="btnDown.disable" @click="btnDown.action()" flat />
        <bs-btn-pg-up :disable="btnUp.disable" @click="btnUp.action()" flat />
      </div>
    </div>
    <!-- Table -->
    <div v-if="mobile" class="py-2 bg-light-1 rounded-4 mx-n2">
      <div class="p-2 mx-2 border-bottom" v-for="row in rows" :key="row.id" :class="row.cls" @click="row.click"
        type="button">
        <div class="text-truncate">
          <span v-text="row.cols[0].text" />
          <span v-if="row.cols[0].caption" class="text-dark-emphasis">
            <span class="mx-2">-</span>
            <span v-text="row.cols[0].caption" />
          </span>
        </div>
      </div>
    </div>
    <div v-else class="border rounded overflow-auto table-container" style="height: 418px">
      <table class="table table-borderless table-hover w-100">
        <tbody>
          <tr v-for="row in rows" :key="row.id" :class="row.cls" @click="row.click" type="button">
            <td v-for="col, i in row.cols" :key="i">
              <span class="fw-semibold" v-text="col.text" />
              <span v-if="col.caption" class="text-dark-emphasis mx-2">-</span>
              <span class="text-dark-emphasis" v-text="col.caption" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
