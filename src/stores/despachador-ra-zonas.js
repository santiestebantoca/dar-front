import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('ra-zonas', () => {
  const data = ref(null)
  const get = area_id =>
    axios
      .get(`/ra/zonas?area_id=${area_id}`)
      .then(res => data.value = res.data)
      .catch(() => { })
  return { data, get }
})
