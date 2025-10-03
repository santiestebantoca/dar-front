import axios from './axios'
import { useStorage } from '@vueuse/core'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Static
const useClaves = defineStore('buzon-claves', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const search = ref(null)
  const data = ref([])
  const get = () => {
    if (!status.value.loaded) {
      status.value.loading = true
      return axios
        .get('/buzon/claves')
        .then(res => {
          setData(res.data)
          status.value.loading = false
          status.value.loaded = true
        })
        .catch(() => { })
    } else return Promise.resolve()
  }
  const setData = _data => {
    data.value = _data.map(d => ({
      id: d[0],
      clave: d[1], // <String> [0-9,-,A-Z]
      tipo: d[2],
      caption: d[3],
      search: d[1], // d[1] is already in upper case
    }))
  }
  // Layer for single option logic
  const singleOption = computed(() => data.value.length === 1 ? data.value[0] : null)
  // Layer for history + searched + full coincidence
  const search_ = computed(() => search.value?.trim().toUpperCase())
  const historyIds = useStorage('dar_stores_buzon_cierre_claves', [])
  const history = {
    add: id => {
      historyIds.value = historyIds.value.filter(d => d !== id)
      historyIds.value.unshift(id) // adds id to the start of array
    },
    del: id => {
      historyIds.value = historyIds.value.filter(d => d !== id)
    }
  }
  const widget = computed(() => {
    const getHistory = (data, histIds) => {
      const history = []
      const exclude = []
      let found
      histIds.every(id => {
        found = data.find(d => d.id === id)
        found && (found.history = true) && history.push(found) && exclude.push(id)
        return history.length !== 8
      })
      return { history, exclude }
    }
    let history = []
    let filtered = []
    if (data.value.length > 1) {
      let dataCopy = JSON.parse(JSON.stringify(data.value))
      if (search_.value) {
        const data_ = dataCopy.filter(d => d.search.includes(search_.value))
        if (data_.length) {
          const res = getHistory(data_, historyIds.value)
          history = res.history
          filtered = data_.filter(d => !res.exclude.includes(d.id))
        }
      } else {
        const res = getHistory(dataCopy, historyIds.value)
        history = res.history
      }
    }
    return [...history, ...filtered]
  })
  return { get, search, widget, history, singleOption, status, data }
})

const usePending = defineStore('buzon-pending', () => {
  const status = ref({
    loaded: false,
    loading: false,
    // resetting: false,
    updated: false
  })
  const data = ref({ ra: 0, tp: 0 })
  const get = () => {
    status.value.loading = true
    return axios
      .get('/buzon/pending')
      .then(res => {
        data.value = res.data
        status.value.loaded = true
        status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  return { data, get, status }
})

const useAsignaciones = defineStore('buzon-asignaciones', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data = ref({ ra: [], tp: [] })
  const count = ref({ ra: 0, tp: 0 })
  const setData = _data => {
    data.value = _data
    count.value.ra = _data.ra.length
    count.value.tp = _data.tp.length
  }
  const get = () => {
    if (!status.value.loaded) {
      status.value.loading = true
      return axios
        .get('/buzon/asignaciones')
        .then(res => {
          setData(res.data)
          status.value.loaded = true
        })
        .catch(() => { })
        .finally(() => status.value.loading = false)
    } else return Promise.resolve()
  }
  return { data, count, get, status }
})

export default defineStore('buzon', () => {
  const claves = useClaves()
  const pending = usePending()
  const asignaciones = useAsignaciones()
  return { pending, asignaciones, claves }
})
