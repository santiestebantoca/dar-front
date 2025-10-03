import axios from './axios'
import { defineStore } from 'pinia'

export default defineStore('tp-asignacion', () => {
  const post = params => axios.post('/tp/asignaciones/', params).catch(() => { })
  const del = id => axios.delete(`/tp/asignaciones/${id}`).catch(() => { })
  return { post, del }
})