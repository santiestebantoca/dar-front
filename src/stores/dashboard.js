import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const useScripts = defineStore('dashdoard-scripts', () => {
  const data = ref(null)
  const loading = ref(null)
  function get(params) {
    loading.value++
    return axios
      .get('/dashboard/scripts', { params })
      .then(res => {
        data.value = res.data
        loading.value--
      })
      .catch(() => { })
  }
  return { data, loading, get }
})

const useSms = defineStore('dashdoard-sms', () => {
  const data = ref(null)
  const loading = ref(null)
  function get(params) {
    loading.value++
    return axios
      .get('/dashboard/sms', { params })
      .then(res => {
        data.value = res.data
        loading.value--
      })
      .catch(() => { })
  }
  return { data, loading, get }
})

const useDatabase = defineStore('dashdoard-database', () => {
  const data = ref(null)
  const loading = ref(null)
  function get() {
    loading.value++
    return axios
      .get('/dashboard/database')
      .then(res => {
        data.value = res.data
        loading.value--
      })
      .catch(() => { })
  }
  function remove(data) {
    return axios
      .delete('/dashboard/database/' + data)
      .catch(() => { })
  }
  return { data, loading, get, remove }
})

export default defineStore('dashdoard', () => {
  const scripts = useScripts()
  const sms = useSms()
  const database = useDatabase()
  return { scripts, sms, database }
})
