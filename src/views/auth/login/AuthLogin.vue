<!-- 
  form.destinatario defines the login type for UI, the route for forward navigation
  and the login method for the backend 
 -->
<script setup>
const props = defineProps({
  index: Function,
  buzon: Function,
  unauthorized: Function,
  info: Function
})

import AppInfo from '@/views/app/AppInfo.vue'
import Descargar from './Descargar.vue'
import Contactos from './Contactos.vue'
import useSnackbarStore from '@/stores/snackbar'
import useAuthStore from '@/stores/auth'
import { useStorage } from '@vueuse/core'
import { ref, computed, watch, inject } from 'vue'

const mobile = inject('app:mobile')
const snackbar = useSnackbarStore()
const auth = useAuthStore()
const sending = ref(false)
const result = ref({ errors: {} })
const type = ref('password')
const destinatario = useStorage('dar_views_auth_login_type', false)
const formDefault = {
  username: null,
  password: null,
  destinatario: destinatario.value
}
const form = ref({ ...formDefault })
watch(() => form.value.destinatario, val => {
  form.value.username = form.value.password = null
  destinatario.value = val
})
const icon = computed(() => type.value === 'password' ? 'eye' : 'eye-slash')
const label = computed(() => sending.value ? 'Autenticando' : 'Iniciar sesión')
const placeholder = computed(() => ({
  username: form.value.destinatario ? 'Teléfono' : 'Usuario',
  password: form.value.destinatario ? 'Pin' : 'Contraseña'
}))
function validate() {
  const errors = {}
  if (!form.value.username) errors.username = 'Valor requerido'
  if (!form.value.password) errors.password = 'Valor requerido'
  result.value = { errors }
  return !Object.keys(errors).length
}
const submit = () => {
  if (!validate()) return
  sending.value = true
  auth.login(form.value).then(process).finally(() => sending.value = false)
}
function process(res) {
  if (res) {
    if (res.destinatario && (!res.activo || !res.clave))
      props.unauthorized()
    else {
      if (form.value.destinatario) props.buzon()
      else props.index()
    }
  }
  else snackbar.add('Credenciales no válidas.')
}
const toggleType = () => type.value = type.value === 'password' ? 'text' : 'password'
//
// Actions
const actions = ref([
  {
    on: null,
    label: computed(() => mobile.value ? '' : 'Descargar'),
    icon: 'download',
    color: 'secondary'
  },
  {
    on: null,
    label: computed(() => mobile.value ? '' : 'Contactos'),
    icon: 'person-rolodex',
    color: 'secondary'
  },
  {
    on: null,
    label: computed(() => mobile.value ? '' : 'Información'),
    icon: 'exclamation-square',
    color: 'danger'
  },
])

</script>

<template>
  <div class="grid" :class="{ mobile, large: !mobile }">
    <div class="content-left bg--info">
      <h5 class="text-primary-emphasis fw-semibold">Inicio de sesión</h5>
      <div class="form-box">
        <form @submit.prevent>
          <bs-switch label="Buzón del destinatario" class="mb-3" v-model="form.destinatario" />
          <div class="position-relative mb-3">
            <img src="@/assets/images/person.svg" alt="" class="p-icon" />
            <input type="text" class="form-control" name="username" :placeholder="placeholder.username"
              v-model="form.username">
            <div class="invalid-feedback d-block" v-text="result.errors.username" />
          </div>
          <div class="position-relative mb-3">
            <img src="@/assets/images/lock.svg" alt="" class="p-icon" />
            <input :type="type" class="form-control" name="password" :placeholder="placeholder.password"
              v-model="form.password">
            <div class="invalid-feedback d-block" v-text="result.errors.password" />
            <div class="position-absolute top-0 end-0" @click.stop="toggleType">
              <bs-icon :name="icon" fs="1.1rem" style="margin:10px" />
            </div>
          </div>
          <div class="mt-4">
            <bs-btn @click="submit" :label="label" color="primary" :disabled="sending" class="w-100 lh-lg" />
          </div>
        </form>
      </div>
      <div class="p-3"></div>
    </div>
    <div class="content-right bg--warning">
      <img src="@/assets/images/dar.png" alt="DAR icon" width="200" />
      <h4 class="mt-4 text-primary-emphasis">DESPACHADOR AUTOMÁTICO DE REPORTES</h4>
    </div>
    <div class="content-bottom hstack gap-3 justify-content-center">
      <bs-btn v-for="action in actions" v-bind="action" flat @click="action.on = true" />
      <Descargar v-model="actions[0].on" />
      <Contactos v-model="actions[1].on" />
      <AppInfo v-model="actions[2].on" />
    </div>
  </div>
</template>

<style scoped>
.mobile {
  --grid-template-columns: 1fr;
  --content-right-display: none;
  --content-left-max-height: 400px;
  --content-bottom-grid-column: 1/2;
}

.large {
  --grid-template-columns: 1fr 1fr;
  --content-right-display: block;
  --content-left-max-height: 400px;
  --content-bottom-grid-column: 1/3;
}

.info:hover {
  background-color: rgba(var(--bs-warning-rgb), .6);
}

.grid {
  max-width: 700px;
  margin: 0 auto;
  min-height: inherit;
  display: grid;
  align-items: center;
  grid-template-columns: var(--grid-template-columns);
  grid-template-rows: 1fr 72px;
  gap: 0 3em;
}

.content-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-height: var(--content-left-max-height);
}

.content-right {
  display: var(--content-right-display);
}

.content-bottom {
  grid-column: var(--content-bottom-grid-column);
  text-align: center;
}

[name] {
  padding-left: 38px;
}

.p-icon {
  position: absolute;
  top: 9px;
  left: 10px;
}
</style>
