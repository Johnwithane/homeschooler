<template>
  <button
    :class="[
      'hand-drawn-border',
      'px-6 py-3 font-hand text-lg font-bold',
      'bg-white hover:bg-gray-100',
      'transition-all duration-200',
      'transform hover:scale-105 active:scale-95',
      'cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      variant === 'primary' ? 'bg-yellow-200 hover:bg-yellow-300' : '',
      variant === 'secondary' ? 'bg-blue-200 hover:bg-blue-300' : '',
      variant === 'success' ? 'bg-green-200 hover:bg-green-300' : '',
      sizeClass
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const sizeClass = computed(() => {
  const sizes = {
    small: 'text-base px-4 py-2',
    medium: 'text-lg px-6 py-3',
    large: 'text-xl px-8 py-4'
  }
  return sizes[props.size]
})
</script>
