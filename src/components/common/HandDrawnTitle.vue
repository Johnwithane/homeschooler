<template>
  <div :class="['text-center mb-8', sizeClass]">
    <h1 :class="['font-hand font-bold text-ink', 'inline-block', animated ? 'wobbly' : '']">
      <slot />
    </h1>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  },
  animated: {
    type: Boolean,
    default: false
  }
})

const sizeClass = computed(() => {
  const sizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl md:text-5xl',
    xlarge: 'text-5xl md:text-6xl'
  }
  return sizes[props.size]
})
</script>
