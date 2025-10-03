import { ref } from 'vue'

export default ref([
  {
    label: 'Usuarios',
    to: { name: 'admin-users' },
    icon: 'people'
  },
  {
    label: 'Destinatarios',
    to: { name: 'admin-destinatarios' },
    icon: 'send',
  },
  {
    label: 'Zonas',
    to: { name: 'admin-zonas' },
    icon: 'puzzle'
  }
])