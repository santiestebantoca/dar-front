<script setup>
const props = defineProps({ despachos: Array })

const vCollapse = e => {
  e.setAttribute('type', 'button')
  e.onclick = () => e.classList.toggle('show')
}
const vColor = (e, binding) => {
  e.style.color = binding.value === 'DELIVRD' ? 'blue' : 'grey'
}
</script>

<template>
  <div class="bg-info-subtle rounded" style="max-width:576px">
    <!-- Lodader -->
    <div v-if="!despachos" class="hstack" style="height:66px">
      <bs-spinner class="mx-auto" color="primary" />
    </div>
    <!-- addressee list -->
    <div v-for="despacho in despachos" :key="despacho.telefono" class="py-1 px-2 border-bottom border-white" v-collapse>
      <!-- addressee name & age -->
      <div class="hstack">
        <div class="text-show-semibold">
          {{ despacho.anombre }}
          <span v-if="despacho.fechas.length > 1" v-text="'(' + despacho.fechas.length + ')'" />
        </div>
        <div class="ms-auto col-auto">
          <span class="text-muted" v-text="despacho.prettyAge" />
        </div>
      </div>
      <!-- addressee details -->
      <div style="font-size:.92rem" class="my-1 d-show-block">
        <!-- addressee mobile & mute action -->
        <div class="col-12 hstack" style="min-height: 34px;">
          <div class="text-truncate me-auto fw-semibold">
            Móvil {{ despacho.telefono }}
          </div>
          <div v-if="!despacho.buzonOff" class="col-auto" @click.stop>
            <a href="#" @click.prevent="$emit('mute', despacho.telefono)"
              class="btn btn-sm btn-link text-decoration-none text-danger fw-semibold"
              title="Silenciar despachos en el buzón del destinatario">
              Silenciar
            </a>
          </div>
        </div>
        <!-- addressee dispatch list -->
        <div class="row gx-2 lh-lg text-muted" v-for="d in despacho.fechas">
          <div class="col-auto d-none d-sm-block">
            -
          </div>
          <div class="col-12 col-sm-auto">
            {{ d.enfecha.slice(0, -3) }}
            <bs-icon v-if="d.recibo" name="check2-all" style="font-size:20px" v-color="d.recibo" />
          </div>
          <div class="col-auto">
            {{ d.despachador }}
          </div>
          <div class="col-auto text-danger fw-semibold" v-if="d.buzon_deshabilitado">
            <bs-icon name="bell-slash" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show .text-show-semibold {
  font-weight: 600
}

.d-show-block {
  display: none
}

.show .d-show-block {
  display: block
}
</style>
