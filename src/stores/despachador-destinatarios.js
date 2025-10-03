import axios from './axios'
import { ref, computed } from 'vue'
import { tidy, filter } from '@tidyjs/tidy'
import { defineStore } from 'pinia'

export default defineStore('destinatarios', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data_ = ref([])
  const grupos = ref(null) // filter
  const count = ref({ all: 0, active: 0, inactive: 0 })
  const cache = ref(null) // last data params cache
  const setData = _data => {
    data_.value = _data.map(d => ({
      id: d[0],
      nombre: d[1],
      telefono: d[2],
      activo: d[3] === 'T',
      grupos: d[4]
    }))
    count.value.all = _data.length
    count.value.active = data_.value.filter(d => d.activo).length
    count.value.inactive = count.value.all - count.value.active
  }
  const data = computed(() =>
    tidy(
      data_.value,
      ...grupos.value?.length
        ? [filter(d => d.grupos.split(', ').some(g => grupos.value.includes(g)))] : []
    ))
  const get = area_id => {
    if (area_id) cache.value = area_id
    else area_id = cache.value
    status.value.loading = true
    return axios
      .get(`/despachador/destinatarios?area_id=${area_id}`)
      .then(res => {
        setData(res.data)
        status.value.loading = false
        status.value.loaded = true
      })
      .catch(() => { })
  }
  return { data, status, get, count, grupos }
})
