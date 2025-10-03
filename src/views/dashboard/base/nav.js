import { ref } from 'vue'

export default ref([
  {
    label: 'Tablas vigiladas',
    to: { name: 'dashboard-tables' },
    icon: 'table'
  },
  {
    label: 'Scripts profile',
    to: { name: 'dashboard-scripts' },
    icon: 'code',
  },
  {
    label: 'SMS profile',
    to: { name: 'dashboard-sms' },
    icon: 'chat-square-dots'
  }
])