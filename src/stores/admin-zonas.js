import axios from './axios'
import usePagination from '../use/usePagination'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useZonaStore = defineStore('admin-zonas-zona', () => {
  const data = ref(null)
  const get = id =>
    axios
      .get(`/admin_zonas/zonas/${id}`)
      .then(res => data.value = res.data)
      .catch(() => { })
  const put = ({ id, data }) =>
    axios
      .put(`/admin_zonas/zonas/${id}`, data)
      .catch(() => { })
  const post = data =>
    axios
      .post('/admin_zonas/zonas', data)
      .catch(() => { })
  const del = id =>
    axios
      .delete(`/admin_zonas/zonas/${id}`)
      .catch(() => { })
  return { data, get, put, post, del }
})

const useZonasStore = defineStore('admin-zonas-zonas', () => {
  // Server side pagination & filtering // ordering not implemented!
  const data = ref([])
  const query = ref({})
  const loading = ref(false)
  const resetting = ref(false)
  const page = reactive(usePagination())
  const setData = _data => {
    data.value = _data.data.map(d => ({
      id: d[0],
      nombre: d[1],
      descripcion: d[2],
    }))
    page.total = _data.total
  }
  const get = () => {
    const params = { limit: page.range, ...query.value }
    loading.value++
    return axios
      .get(`/admin_zonas/zonas`, { params })
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => loading.value--)
  }
  watch(query, () => {
    if (resetting.value) return
    page.first()
    get()
  })
  const $reset = () => {
    resetting.value = true
    query.value = {}
    data.value = []
    page.first()
    nextTick(() => resetting.value = false) // otherwise, resetting is false in query watcher
  }
  const isFiltered = computed(() => Object.keys(query.value).length)
  return { data, page, get, loading, query, isFiltered, $reset }
})

export default defineStore('admin-zonas', () => {
  const zona = useZonaStore()
  const zonas = useZonasStore()
  return { zona, zonas }
})
