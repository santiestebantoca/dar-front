<script setup>
import useStore from '@/stores/admin-destinatarios'
import { ref, computed, inject } from 'vue'

const store = useStore()
const selected = ref(null)
const mobile = inject('app:mobile')
const data = computed(() => store.destinatarios.data)
const rows = computed(() => (
  data.value?.map((r) => ({
    id: r.id,
    click: () => select(r.id),
    cls: {
      'table-primary': r.id === selected.value
    },
    cols: [
      { text: r.nombre, cls: { 'text-danger': !r.activo } }
    ]
  }))
))
const emit = defineEmits(['rowClick', 'new'])
const select = id => {
  selected.value = id
  emit('rowClick', id)
}
// Pagination
const pagination = computed(() => store.destinatarios.page.text)
const btnDown = computed(() => ({
  action: () => {
    store.destinatarios.page.prev()
    store.destinatarios.get()
  },
  disable: store.destinatarios.page.prevDisabled
}))
const btnUp = computed(() => ({
  action: () => {
    store.destinatarios.page.next()
    store.destinatarios.get()
  },
  disable: store.destinatarios.page.nextDisabled
}))
//
const info = ref(null)
</script>

<template>
  <div class="data-box">
    <div class="d-none d-xl-block">
      Trabajadores que reciben SMS según los grupos de mensajería a los cuales están asociados.
      <span v-if="info">
        Si eres administrador territorial, verás los destinatarios asociados a las áreas que
        administras o los destinatarios sin áreas, creados por ti.
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
        </div>
      </div>
    </div>
    <div v-else class="border rounded overflow-auto table-container" style="height: 418px">
      <table class="table table-borderless table-hover w-100">
        <tbody>
          <tr v-for="row in rows" :key="row.id" :class="row.cls" @click="row.click" type="button">
            <td v-for="col, i in row.cols" :key="i" :class="col.cls" :title="col.text" v-text="col.text" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
