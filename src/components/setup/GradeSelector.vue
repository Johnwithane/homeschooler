<template>
  <div class="w-full">
    <p class="text-lg font-hand font-bold mb-4 text-ink text-center">Pick your grade:</p>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <button
        v-for="grade in grades"
        :key="grade"
        :class="[
          'hand-drawn-border',
          'p-6 font-hand text-2xl font-bold',
          'transition-all duration-200',
          'transform hover:scale-110 active:scale-95',
          selectedGrade === grade
            ? 'bg-yellow-300 ring-4 ring-yellow-500'
            : 'bg-white hover:bg-yellow-100'
        ]"
        @click="selectGrade(grade)"
      >
        {{ grade === 'K' ? 'K' : grade }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const grades = ['K', '1', '2', '3', '4', '5']
const selectedGrade = ref(props.modelValue)

function selectGrade(grade) {
  selectedGrade.value = grade
  emit('update:modelValue', grade)
}
</script>
