import axios from './axios'
import { tidy, distinct, arrange, map } from '@tidyjs/tidy'
import { filtersByObject, orderByObject } from './tidy-aux'
import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'

const useFilter = () => {
  const def = {
    nombpta: undefined,
    zona: undefined,
    telefono: undefined,
    problema: undefined,
    grupo: undefined
  }
  const by = ref({ ...def })
  const array = ref([])
  const data = ref([])
  const on = computed(() => array.value.length)
  const apply = () => array.value = filtersByObject(by.value)
  const reset = () => {
    by.value = { ...def }
    apply()
  }
  //
  // options
  const nombpta = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, nombpta: undefined }),
      map(d => ({
        value: d.nombpta,
        label: d.nombpta,
      })), distinct('value'), arrange('value')))
  const zona = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, zona: undefined }),
      map(d => ({
        value: d.zona,
        label: d.zona,
      })), distinct('value'), arrange('value')))
  const telefono = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, telefono: undefined }),
      map(d => ({
        value: d.telefono,
        label: d.telefono,
      })), distinct('value'), arrange('value')))
  const problema = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, problema: undefined }),
      map(d => ({
        value: d.problema,
        label: d.problema,
      })), distinct('value'), arrange('value')))
  const grupo = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, grupo: undefined }),
      map(d => ({
        value: d.grupo,
        label: d.grupo,
      })), distinct('value'), arrange('value')))
  const options = { nombpta, zona, telefono, problema, grupo }

  return { data, array, by, on, apply, reset, options }
}

const useOrder = () => {
  const def = {
    field: null,
    direction: 'asc'
  }
  const by = ref({ ...def })
  const array = ref([])
  const on = computed(() => array.value.length)
  const apply = () => array.value = orderByObject(by.value)
  const reset = () => {
    by.value = { ...def }
    apply()
  }
  return { array, by, on, apply, reset }
}

const useCierre = defineStore('buzon-ra-cierre', () => {
  const post = data =>
    axios.post('/buzon_ra/cierre/', data).catch(() => { })
  return { post }
})

const useReportes = defineStore('buzon-ra-reportes', () => {
  const filter = reactive(useFilter())
  const order = reactive(useOrder())
  const data_ = ref([])
  const cerrados = ref([])
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
    updated: false,
  })
  const setData = _data => {
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
      telfloca: d[20]
    }))
    // page.total = _data.total
  }
  const data = computed(() => {
    const _data = data_.value.filter(d => !cerrados.value.includes(d.folio))
    return tidy(_data, ...filter.array, ...order.array)
  })
  watch(data, val => filter.data = val)
  const get = () => {
    status.value.loading = true
    return axios
      .get('/buzon_ra/reportes')
      .then(res => {
        setData(res.data)
        status.value.loaded = true
        status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  const del = folio => cerrados.value.push(folio)
  return { data, status, get, del, filter, order }
})

export default defineStore('buzon-ra', () => {
  const cierre = useCierre()
  const reportes = useReportes()
  return { cierre, reportes }
})