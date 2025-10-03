import axios from './axios'
import { tidy, mutate, filter, arrange, desc } from '@tidyjs/tidy'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { prettyAge } from '@/assets/dar'

const useDespachos = defineStore('ra-despachos', () => {
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
      .get('/ra/despachado', { params })
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
      .put('/ra/despachado', params)
      .catch(() => { })
  }
  function post(data) {
    return axios
      .post('/ra/despachado', data)
      .then(res => {
        if (res.data === '1') setProcessed(data.folio)
        else setFails({ ...data, time: Date.now() })
        return res.data
      })
  }
  return { processed, fails, get, put, post }
})

export default defineStore('ra-reportes', () => {
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
      folio: d[0],
      telefono: d[1],
      nombre: d[2],
      direccion: d[3],
      cl: d[4],
      cableP: d[5],
      parP: d[6],
      terminalP: d[7],
      direcciontP: d[8],
      cableS: d[9],
      parS: d[10],
      terminalS: d[11],
      direcciontS: d[12],
      inicio: d[13],
      fin: d[14],
      problema: d[15],
      prueba: d[16],
      grupo: d[17],
      demorat: d[18],
      observacion: d[19],
      telfloca: d[20],
      nombpta: d[21],
      iddt: d[22],
      zona: d[23],
      clave: d[24],
      tiposerv: d[25],
      despachado: d[26]
    }))
    count.value.all = data_.value.length
    count.value.dispatched = data_.value.filter(d => d.despachado > 0).length
    count.value.notDispatched = count.value.all - count.value.dispatched
    update.value++
  }
  function get(area_id) {
    status.value.loading = true
    return axios
      .get(`/ra/reportes?area_id=${area_id}`)
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
      filters.push(filter(d => !d.despachado || despachos.processed.includes(d.folio)))
    if (search.value) {
      const isN = search.value.field.match(/(==|>=|<=)$/)
      console.log(search.value)
      if (isN) {
        const o = search.value.field.slice(-2)
        const f = search.value.field.slice(0, -2)
        const s = Number(search.value.value)
        if (o === '==') filters.push(filter(d => Number(d[f]) === s))
        else if (o === '>=') filters.push(filter(d => Number(d[f]) >= s))
        else if (o === '<=') filters.push(filter(d => Number(d[f]) <= s))
      } else {
        const f = search.value.field
        const s = search.value.value.toUpperCase()
        filters.push(filter(d => String(d[f]).toUpperCase().includes(s)))
      }
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
