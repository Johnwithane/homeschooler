<template>
  <button
    :class="[
      'hand-drawn-border',
      'p-8 w-full',
      'transition-all duration-300',
      'flex flex-col items-center justify-center gap-4',
      disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-white hover:bg-gradient-to-br cursor-pointer transform hover:scale-105 active:scale-95',
      !disabled && colorClass
    ]"
    :disabled="disabled"
    @click="!disabled && $emit('click')"
  >
    <div class="text-6xl">{{ icon }}</div>
    <h3 class="font-hand font-bold text-3xl text-ink">{{ subject }}</h3>
    <p class="font-hand text-sm text-gray-600">{{ description }}</p>
    <div v-if="disabled" class="mt-2 hand-drawn-border bg-yellow-100 px-4 py-2">
      <p class="font-hand text-sm font-bold text-yellow-800">Coming Soon! 🚧</p>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  subject: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📚'
  },
  description: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const colorClass = computed(() => {
  const colors = {
    'Math': 'hover:from-blue-100 hover:to-blue-200',
    'Science': 'hover:from-green-100 hover:to-green-200',
    'Reading': 'hover:from-purple-100 hover:to-purple-200',
    'Writing': 'hover:from-orange-100 hover:to-orange-200'
  }
  return colors[props.subject] || 'hover:from-gray-100 hover:to-gray-200'
})
</script>
