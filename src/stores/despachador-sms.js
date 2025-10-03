import axios from './axios'
import { defineStore } from 'pinia'

export default defineStore('despachador-sms', () => {
    const post = data =>
        axios
            .post('/despachador/sms', data)
            .catch(() => { })
    return { post }
})