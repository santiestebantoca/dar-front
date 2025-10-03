import axios from './axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import useAdminUsersStore from './admin-users'
import useAdminDestinatariosStore from './admin-destinatarios'
import useAdminZonasStore from './admin-zonas'

// Static
const useAdminEnvAuthgroupStore = defineStore('admin-env-authgroup', () => {
  const data = ref(null)
  const get = () =>
    axios
      .get('/admin/authgroup')
      .then(res => data.value = res.data)
      .catch(() => { })
  return { get, data }
})

const useAdminEnvSmsgruposStore = defineStore('admin-env-smsgrupos', () => {
  const data = ref(null)
  const get = () =>
    axios
      .get('/admin/smsgrupos')
      .then(res => data.value = res.data)
      .catch(() => { })
  return { get, data }
})

const useAdminEnvGruposStore = defineStore('admin-env-grupos', () => {
  const data = ref(null)
  const get = () =>
    axios
      .get('/admin/grupos')
      .then(res => data.value = res.data.map(d => ({
        ...d,
        nombre: d.nombre + ' - ' + d.descripcion
      })))
      .catch(() => { })
  return { get, data }
})

const useAdminEnvAreasStore = defineStore('admin-env-areas', () => {
  const data_ = ref(null)
  const territorio = ref(null) // To filter by "territorio"
  const get = () =>
    axios
      .get('/admin/areas_administradas')
      .then(res => data_.value = res.data)
      .catch(() => { })
  const data = computed(() =>
    data_.value && territorio.value
      ? data_.value.filter(d => d.territorio_id === territorio.value)
      : data_.value)
  return { data, get, territorio }
})

const useAdminEnvTerritoriosStore = defineStore('admin-env-territorios', () => {
  const data = ref(null)
  const get = () =>
    axios
      .get('/admin/territorios_administrados')
      .then(res => data.value = res.data)
      .catch(() => { })
  return { data, get }
})

const useAdminEnvStore = defineStore('admin-env', () => {
  const authgroup = useAdminEnvAuthgroupStore() // Static for "authgroup" select control
  const smsgrupos = useAdminEnvSmsgruposStore() // Static for "smsgrupo" select control
  const grupos = useAdminEnvGruposStore() // Static for "grupo" select control
  const areas = useAdminEnvAreasStore() // Scope administrated "areas"
  const territorios = useAdminEnvTerritoriosStore() // Scope administrated "territorios"
  const get = () => Promise.all([smsgrupos.get(), grupos.get(), areas.get(), territorios.get(), authgroup.get()])
  return { authgroup, smsgrupos, grupos, areas, territorios, get }
})

export default defineStore('admin', () => {
  const env = useAdminEnvStore() // Session environment
  const users = useAdminUsersStore()
  const destinatarios = useAdminDestinatariosStore()
  const zonas = useAdminZonasStore()
  return { env, users, destinatarios, zonas }
})
