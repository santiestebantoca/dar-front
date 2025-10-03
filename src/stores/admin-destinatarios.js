import axios from './axios'
import usePagination from '../use/usePagination'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useDestinatarioSmsgruposStore = defineStore('admin-destinatarios-destinatario-smsgrupos', () => {
  const post = params =>
    axios
      .post('/admin_destinatario/smsgrupos', params)
      .catch(() => { })
  const del = params =>
    axios
      .delete('/admin_destinatario/smsgrupos', { data: params })
      .catch(() => { })
  return { post, del }
})

const useDestinatarioGruposStore = defineStore('admin-destinatarios-destinatario-grupos', () => {
  const post = params =>
    axios
      .post('/admin_destinatario/grupos', params)
      .catch(() => { })
  const del = params =>
    axios
      .delete('/admin_destinatario/grupos', { data: params })
      .catch(() => { })
  return { post, del }
})

const useDestinatarioAreasStore = defineStore('admin-destinatarios-destinatario-areas', () => {
  const post = params => axios.post('/admin_destinatario/areas', params).catch(() => { })
  const del = params =>
    axios
      .delete('/admin_destinatario/areas', { data: params })
      .catch(() => { })
  return { post, del }
})

const useDestinatarioStore = defineStore('admin-destinatarios-destinatario', () => {
  const areas = useDestinatarioAreasStore()
  const smsgrupos = useDestinatarioSmsgruposStore()
  const grupos = useDestinatarioGruposStore()
  const data = ref(null)
  const get = id =>
    axios
      .get(`/admin_destinatario/destinatarios/${id}`)
      .then(res => data.value = res.data)
      .catch(() => { })
  const put = ({ id, data }) =>
    axios
      .put(`/admin_destinatario/destinatarios/${id}`, data)
      .catch(() => { })
  const post = data =>
    axios
      .post('/admin_destinatario/destinatarios', data)
      .catch(() => { })
  const del = id =>
    axios
      .delete(`/admin_destinatario/destinatarios/${id}`)
      .catch(() => { })
  return { data, get, put, post, del, areas, smsgrupos, grupos }
})

const useDestinatariosStore = defineStore('admin-destinatarios-destinatarios', () => {
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
      activo: d[2] === 'T',
    }))
    page.total = _data.total
  }
  const get = () => {
    const params = { limit: page.range, ...query.value }
    loading.value++
    return axios
      .get('/admin_destinatario/destinatarios', { params })
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

export default defineStore('admin-destinatarios', () => {
  const destinatario = useDestinatarioStore()
  const destinatarios = useDestinatariosStore()
  return { destinatario, destinatarios }
})
