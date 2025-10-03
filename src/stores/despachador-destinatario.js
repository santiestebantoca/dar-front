import axios from './axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('destinatario', () => {
  const dragstart = ref(null)
  const put = ({ id, data }) =>
    axios
      .put(`/despachador/destinatarios/${id}`, data)
      .catch(() => { })
  return { dragstart, put }
})
