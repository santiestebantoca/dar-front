import axios from './axios'
import { tidy, distinct, arrange, map } from '@tidyjs/tidy'
import { filtersByObject, orderByObject } from './tidy-aux'
import { defineStore } from 'pinia'
import { ref, computed, watch, reactive } from 'vue'

const useFilter = () => {
  const def = {
    nombpta: undefined,
    zona: undefined,
    telefono: undefined,
    problema: undefined
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
  const modelo = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, modelo: undefined }),
      map(d => ({
        value: d.modelo,
        label: d.modelo,
      })), distinct('value'), arrange('value')))
  const codigos_de_alarma = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, codigos_de_alarma: undefined }),
      map(d => ({
        value: d.codigos_de_alarma,
        label: d.codigos_de_alarma,
      })), distinct('value'), arrange('value')))
  const categoria = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, categoria: undefined }),
      map(d => ({
        value: d.categoria,
        label: d.categoria,
      })), distinct('value'), arrange('value')))
  const estados_pendientes = computed(() =>
    tidy(data.value,
      ...filtersByObject({ ...by.value, estados_pendientes: undefined }),
      map(d => ({
        value: d.estados_pendientes,
        label: d.estados_pendientes,
      })), distinct('value'), arrange('value')))
  const options = { modelo, codigos_de_alarma, categoria, estados_pendientes }

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

// const useCierreForm = defineStore('buzon-tp-cierre-form', () => {
//   const data = ref({})
//   const status = ref({
//     loaded: null,
//     loading: null,
//     resetting: null,
//   })
//   const setData = _data => {
//     data.value = _data
//   }
//   const get = numero_telefonico => {
//     const params = { numero_telefonico }
//     status.value.loading++
//     return axios
//       .get('/buzon_tp/cierre/', { params })
//       .then(res => {
//         setData(res.data)
//         status.value.loaded = true
//       })
//       .catch(() => { })
//       .finally(() => status.value.loading--)
//   }
//   const post = data =>
//     axios.post('/buzon_tp/cierre/', data).catch(() => { })
//   return { data, get, post }
// })

// const useCierre = defineStore('buzon-tp-cierre', () => {
//   const form = useCierreForm()
//   const data = ref({})
//   const status = ref({
//     loaded: null,
//     loading: null,
//     resetting: null,
//   })
//   const setData = _data => {
//     data.value = _data
//   }
//   const get = numero_telefonico => {
//     const params = { numero_telefonico }
//     status.value.loading++
//     return axios
//       .get('/buzon_tp/cierre/', { params })
//       .then(res => {
//         setData(res.data)
//         status.value.loaded = true
//       })
//       .catch(() => { })
//       .finally(() => status.value.loading--)
//   }
//   const post = data =>
//     axios.post('/buzon_tp/cierre/', data).catch(() => { })
//   return { data, get, post, form }
// })

// const useOperaciones = defineStore('buzon-tp-operaciones', () => {
//   const data = ref({})
//   const status = ref({
//     loaded: null,
//     loading: null,
//     resetting: null,
//   })
//   const setData = _data => {
//     data.value = _data
//   }
//   const get = numero_telefonico => {
//     const params = { numero_telefonico }
//     status.value.loading++
//     return axios
//       .get('/buzon_tp/operaciones/', { params })
//       .then(res => {
//         setData(res.data)
//         status.value.loaded = true
//       })
//       .catch(() => { })
//       .finally(() => status.value.loading--)
//   }
//   return { data, get }
// })

const useReporteOptions = defineStore('buzon-tp-reporte-options', () => {
  const data = ref({})
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
    // updated: false,
  })
  const get = id => {
    status.value.loading = true
    return axios
      .get(`/buzon_tp/options/${id}`)
      .then(res => {
        data.value = res.data
        status.value.loaded = true
        // status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  return { data, status, get }
})

const useReporte = defineStore('buzon-tp-reporte', () => {
  const data = ref({})
  const options = useReporteOptions()
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
    // updated: false,
  })
  const get = id => {
    status.value.loading = true
    return axios
      .get(`/buzon_tp/reporte/${id}`)
      .then(res => {
        data.value = res.data
        status.value.loaded = true
        // status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  const put = ({ id, data }) =>
    axios
      .put(`/buzon_tp/reporte/${id}`, data)
      .catch(() => { })
  return { data, status, get, put, options }
})

const useReportes = defineStore('buzon-tp-reportes', () => {
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
    }))
    // page.total = _data.total
  }
  const data = computed(() => {
    const _data = data_.value.filter(d => !cerrados.value.includes(d.numero_telefonico))
    return tidy(_data, ...filter.array, ...order.array)
  })
  watch(data, val => filter.data = val)
  const get = () => {
    status.value.loading = true
    return axios
      .get('/buzon_tp/reportes')
      .then(res => {
        setData(res.data)
        status.value.loaded = true
        status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  const del = numero_telefonico => cerrados.value.push(numero_telefonico)
  return { data, status, get, del, filter, order }
})

export default defineStore('buzon-tp', () => {
  // const operaciones = useOperaciones()
  // const cierre = useCierre()
  const reportes = useReportes()
  const reporte = useReporte()
  return { reportes, reporte }
})
