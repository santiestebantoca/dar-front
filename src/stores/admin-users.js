import axios from './axios'
import usePagination from '../use/usePagination'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useUserGruposStore = defineStore('admin-users-user-grupos', () => {
  const post = params =>
    axios
      .post('/admin_user/grupos', params)
      .catch(() => { })
  const del = params =>
    axios
      .delete('/admin_user/grupos', { data: params })
      .catch(() => { })
  return { post, del }
})

const useUserAreasStore = defineStore('admin-users-user-areas', () => {
  const post = params => axios.post('/admin_user/areas', params).catch(() => { })
  const del = params =>
    axios
      .delete('/admin_user/areas', { data: params })
      .catch(() => { })
  return { post, del }
})

const useUserStore = defineStore('admin-users-user', () => {
  const grupos = useUserGruposStore()
  const areas = useUserAreasStore()
  const data = ref(null)
  const setData = _data => {
    data.value = _data ? {
      ..._data,
      blocked: _data.registration_key === 'blocked'
    } : res.data
  }
  const get = id =>
    axios
      .get(`/admin_user/user/${id}`)
      .then(res => setData(res.data))
      .catch(() => { })
  const post = data => axios.post('/admin_user/user', data).catch(() => { })
  const put = ({ id, data }) => axios.put(`/admin_user/user/${id}`, data).catch(() => { })
  const del = id => axios.delete(`/admin_user/user/${id}`).catch(() => { })
  return { data, get, put, post, del, grupos, areas }
})

const useUsersStore = defineStore('admin-users-users', () => {
  // Server side pagination & filtering // ordering not implemented!
  const data = ref([])
  const query = ref({})
  const loading = ref(false)
  const resetting = ref(false)
  const page = reactive(usePagination())
  const setData = _data => {
    data.value = _data.data.map(d => ({
      id: d[0],
      name: d[1],
      blocked: d[2] === 'blocked'
    }))
    page.total = _data.total
  }
  const get = () => {
    const params = { limit: page.range, ...query.value }
    loading.value++
    return axios
      .get(`/admin_user/user`, { params })
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

export default defineStore('admin-users', () => {
  const user = useUserStore()
  const users = useUsersStore()
  return { user, users }
})
