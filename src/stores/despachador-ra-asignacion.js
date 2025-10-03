import axios from './axios'
import { defineStore } from 'pinia'

export default defineStore('ra-asignacion', () => {
  const post = params => axios.post('/ra/asignaciones/', params).catch(() => { })
  const del = id => axios.delete(`/ra/asignaciones/${id}`).catch(() => { })
  return { post, del }
})
