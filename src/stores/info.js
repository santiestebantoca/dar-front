import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const useInfo = defineStore('info', () => {
  const data = ref([])
  const get = () =>
    axios
      .get('/info')
      .then(res => data.value = res.data)
      .catch(() => { })
  return { data, get }
})

export default useInfo
