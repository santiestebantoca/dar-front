import axios from './axios'
import { tidy, mutate, filter, arrange, desc } from '@tidyjs/tidy'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { prettyAge } from '@/assets/dar'

const useDespachos = defineStore('tp-despachos', () => {
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
      .get('/tp/despachado', { params })
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
      .put('/tp/despachado', params)
      .catch(() => { })
  }
  function post(data) {
    return axios
      .post('/tp/despachado', data)
      .then(res => {
        if (res.data === '1') setProcessed(data.averia_id)
        else setFails({ ...data, time: Date.now() })
        return res.data
      })
  }
  return { processed, fails, get, put, post }
})

export default defineStore('tp-reportes', () => {
  const status = ref({
    loaded: false,
    loading: false,
    updated: false,
  })
  const despachos = useDespachos()
  const data_ = ref(null) // data from server API
  const showAll = ref(false) // special filter
  const search = ref(false) // special filter
  const count = ref({ all: 0, dispatched: 0, notDispatched: 0 })
  const update = ref(0)
  const orderObj = ref({ field: null, direction: 'asc' })
  function setData(_data) {
    data_.value = _data.data.map(d => ({
      id: d[0],
      identificativo: d[1],
      numero_telefonico: d[2],
      modelo: d[3],
      categoria: d[4],
      cerradura: d[5],
      codigos_de_alarma: d[6],
      estados_pendientes: d[7],
      tiempo: d[8],
      direccion: d[9],
      soporte: d[10],
      fecha_averia_sigetp: d[11],
      zona: d[12],
      piezas: d[13],
      despachado: d[14]
    }))
    count.value.all = data_.value.length
    count.value.dispatched = data_.value.filter(d => d.despachado > 0).length
    count.value.notDispatched = count.value.all - count.value.dispatched
    update.value++
  }
  function get(area_id) {
    status.value.loading = true
    return axios
      .get(`/tp/reportes?area_id=${area_id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
        status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  const data = computed(() => {
    const filters = []
    if (!showAll.value)
      filters.push(filter(d => !d.despachado || despachos.processed.includes(d.id)))
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
