import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('http', () => {
  const server401 = ref(null) // Unauthorized (authenticate)
  const lastServerAccess = ref(null)
  return { server401, lastServerAccess }
})
