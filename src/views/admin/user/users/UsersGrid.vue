<script setup>
import useStore from '@/stores/admin-users'
import { ref, computed, inject } from 'vue'

const mobile = inject('app:mobile')
const store = useStore()
const selected = ref(null)
const data = computed(() => store.users.data)
const rows = computed(() => (
  data.value?.map(r => ({
    id: r.id,
    click: () => select(r.id),
    cls: {
      'table-primary': r.id === selected.value
    },
    cols: [
      { text: r.name, cls: { 'text-danger': r.blocked } },
    ]
  }))
))
const emit = defineEmits(['rowClick', 'new'])
const select = id => {
  selected.value = id
  emit('rowClick', id)
}
// Pagination
const pagination = computed(() => store.users.page.text)
const btnDown = computed(() => ({
  action: () => {
    store.users.page.prev()
    store.users.get()
  },
  disable: store.users.page.prevDisabled
}))
const btnUp = computed(() => ({
  action: () => {
    store.users.page.next()
    store.users.get()
  },
  disable: store.users.page.nextDisabled
}))
</script>

<template>
  <div class="data-box">
    <div class="d-none d-xl-block">
      Usuarios del sistema con rol administrador o despachador.
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
