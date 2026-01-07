import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const useApk = defineStore('apk', () => {
  const status = ref({
    loaded: false,
    loading: false,
    // updated: null
  })
  const data = ref(null)
  const get = () => {
    status.value.loading = true
    return axios
      .get('/apk')
      .then(res => {
        data.value = res.data
        status.value.loaded = true
        // status.value.updated = Date.now()
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  return { data, get, status }
})

export default useApk
