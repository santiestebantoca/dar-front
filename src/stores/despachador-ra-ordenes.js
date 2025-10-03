import axios from './axios'
import { tidy, filter, arrange, desc, mutate } from '@tidyjs/tidy'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { prettyAge } from '@/assets/dar'

const useDespachos = defineStore('ra-ordenes-despachos', () => {
  const processed = ref([]) // list of dispatched elements (for UI purpose)
  const fails = ref([]) // list of failed dispatch attempts
  function setProcessed(data) {
    if (!processed.value.includes(data)) processed.value.push(data)
  }
  function setFails(data) {
    fails.value.push(data)
  }
  function get(params) {
    return axios
      .get('/ra/despachado_os', { params })
      .then(res =>
        tidy(
          (res.data || []),
          mutate({ prettyAge: d => prettyAge(d.days) }),
          mutate({ buzonOff: d => d.fechas[d.fechas.length - 1].buzon_deshabilitado })
        ))
      .catch(() => { })
  }
  function put(params) {
    return axios
      .put('/ra/despachado_os', params)
      .catch(() => { })
  }
  function post(data) {
    return axios
      .post('/ra/despachado_os', data)
      .then(res => {
        if (res.data === '1') setProcessed(data.folio)
        else setFails({ ...data, time: Date.now() })
        return res.data
      })
  }
  return { processed, fails, get, put, post }
})

export default defineStore('ra-ordenes', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const despachos = useDespachos()
  const data_ = ref(null) // data from server API
  const showAll = ref(false) // special filter
  const search = ref(false) // special filter
  const count = ref({ all: 0, dispatched: 0, notDispatched: 0 })
  const update = ref(0)
  const orderObj = ref({ field: null, direction: 'asc' })
  function setData(_data) {
    data_.value = _data
    count.value.all = _data.length
    count.value.dispatched = _data.filter(d => d.despachado > 0).length
    count.value.notDispatched = count.value.all - count.value.dispatched
    update.value++
  }
  function get(area_id) {
    status.value.loading = true
    return axios
      .get(`/ra/ordenes?area_id=${area_id}`)
      .then(res => {
        setData(res.data)
        status.value.loading = false
        status.value.loaded = true
      })
      .catch(() => { })
  }
  const data = computed(() => {
    const filters = []
    if (!showAll.value)
      filters.push(filter(d => !d.despachado || despachos.processed.includes(d.folio)))
    if (search.value) {
      const f = search.value.field
      const s = search.value.value.toUpperCase()
      filters.push(filter(d => String(d[f]).toUpperCase().includes(s)))
    }
    return tidy(
      data_.value || [],
      ...filters,
      ...(orderObj.value.field
        ? orderObj.value.direction === 'asc'
          ? [arrange([orderObj.value.field])]
          : [arrange([desc(orderObj.value.field)])]
        : [])
    )
  })
  return { data, status, showAll, search, count, update, orderObj, get, despachos }
})
