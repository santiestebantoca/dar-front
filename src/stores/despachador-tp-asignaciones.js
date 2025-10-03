import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('tp-asignaciones', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data = ref(null)
  const cache = ref(null) // last data params cache
  const setData = _data => {
    data.value = _data.map(d => ({
      id: d[0],
      destinatario_id: d[1],
      zona_id: d[2],
      comienza: d[3],
      created_by: d[4]
    }))
  }
  const get = area_id => {
    if (area_id) cache.value = area_id
    else area_id = cache.value
    status.value.loading = true
    return axios
      .get(`/tp/asignaciones?area_id=${area_id}`)
      .then(res => {
        setData(res.data)
        status.value.loading = false
        status.value.loaded = true
      })
      .catch(() => { })
  }
  return { data, get, status }
})
