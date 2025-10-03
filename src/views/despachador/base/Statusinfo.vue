<script setup>
const props = defineProps({
  success: Boolean,
  warning: Boolean,
  danger: Boolean,
  secondary: Boolean,
  label: String,
  value: [String, Number],
  ifValue: Boolean,
})
import { computed } from 'vue'
const _class = computed(() => {
  const cls = []
  if (props.success) cls.push('success')
  if (props.warning) cls.push('warning')
  if (props.danger) cls.push('danger')
  if (props.secondary) cls.push('secondary')
  if (props.ifValue && !props.value) cls.push('d-none')
  return cls
})
</script>

<template>
  <div class="hstack gap-1 px-1 text-white small" :class="_class" style="height:26px">
    <span v-if="success" class="icon icon-success" />
    <span v-if="warning" class="icon icon-warning" />
    <span v-if="danger" class="icon icon-danger" />
    <span v-if="label" v-text="label" />
    <span v-text="value" class="mx-1" />
  </div>
</template>

<style scoped>
.icon {
  height: 100%;
  width: 14px;
  background-repeat: no-repeat;
  background-size: contain;
}

.icon-success {
  background-image: url("@/assets/images/icon_up.svg");
}

.icon-warning {
  /* background-image: url("@/assets/icon_unusual.svg"); */
  background-image: url("@/assets/images/icon_warning.svg");
}

.icon-danger {
  background-image: url("@/assets/images/icon_down.svg");
}

.secondary {
  background: #606362;
}

.warning {
  background: #FB8C00;
  /* background: #F99D1C; */
}

.danger {
  background: #D71920;
}

.success {
  background: #4CAF50;
  /* background: #B4CC38; */
}
</style>