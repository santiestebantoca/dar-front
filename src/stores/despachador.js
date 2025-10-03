import axios from './axios'
import { tidy, filter, groupBy } from '@tidyjs/tidy'
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const useGrupos = defineStore('despachador-grupos', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data = ref([])
  const setData = _data => {
    data.value = _data.map(d => ({
      nombre: d[0],
      descripcion: d[1]
    }))
  }
  const get = () => {
    // if (!status.value.loaded) {
    status.value.loading = true
    return axios
      .get('/despachador/grupos')
      .then(res => {
        setData(res.data)
        status.value.loading = false
        status.value.loaded = true
      })
      .catch(() => { })
    // } else return Promise.resolve()
  }
  return { data, get, status }
})

const useAreas = defineStore('despachador-areas', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data_ = ref([])
  const data = ref([]) // filterd
  const count = ref({ total: null, auto: null, noauto: null })
  const first = ref(null) // First 'area'. Useful when there is only one area
  const territorio_id = ref(null)
  const setData = _data => { // _data comes ordered from server
    data_.value = _data.map(d => ({
      id: d[0],
      nombre: d[1],
      automatico: d[2] === 'T',
      territorio_id: d[3],
      territorio_nombre: d[4],
      territorio_orden: d[5],
    }))
  }
  watch([data_, territorio_id], ([dval, tval]) => {
    data.value = tidy(dval, ...tval ? [filter(d => d.territorio_id === tval)] : [])
  }, { immediate: true })
  watch(data, () => {
    count.value.total = data.value.length
    count.value.auto = data.value.filter(d => d.automatico).length
    count.value.noauto = count.value.total - count.value.auto
    first.value = data.value.length ? data.value[0] : null
  }, { immediate: true })
  const get = () => {
    // if (!status.value.loaded) {
    status.value.loading = true
    return axios
      .get(`/despachador/areas`)
      .then(res => {
        setData(res.data)
        status.value.loading = false
        status.value.loaded = true
      })
      .catch(() => { })
    // } else return Promise.resolve()
  }
  const asGroups = computed(() =>
    tidy(
      data.value,
      groupBy('territorio_id', [], groupBy.entriesObject())))
  return { data, asGroups, get, count, first, territorio_id, status }
})

const useAreaAutomatico = defineStore('despachador-area-automatico', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data = ref([])
  const area_id = ref(null)
  const get = _area_id => {
    area_id.value = _area_id
    status.loading = true
    return axios
      .get(`/despachador/area_automatico_log/${area_id.value}`)
      .then(res => {
        data.value = res.data
        status.loading = false
        status.loaded = true
      })
      .catch(() => { })
  }
  const put = ({ params }) =>
    axios.put(`/despachador/areas/${area_id.value}`, params).catch(() => { })
  return { data, get, put, status }
})

const useArea = defineStore('despachador-area', () => {
  const automatico = useAreaAutomatico()
  const areas = useAreas()
  const area_id = ref(null)
  const data = computed(() => areas.data.find(d => d.id === area_id.value))
  const get = _area_id => {
    automatico.get(_area_id)
    area_id.value = _area_id
    // return axios
    //   .get(`/despachador/areas/${area_id}`)
    //   .then(res => data.value = res.data)
    //   .catch(() => { })
  }
  return { automatico, data, get }
})

export default defineStore('despachador', () => {
  const grupos = useGrupos()
  const areas = useAreas()
  const area = useArea()
  return { grupos, areas, area }
})
