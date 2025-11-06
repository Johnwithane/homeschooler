<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-lg font-hand font-bold mb-2 text-ink">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'hand-drawn-border',
        'w-full px-4 py-3 font-hand text-lg',
        'bg-white focus:bg-yellow-50',
        'focus:outline-none focus:ring-2 focus:ring-yellow-400',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200'
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
</script>
