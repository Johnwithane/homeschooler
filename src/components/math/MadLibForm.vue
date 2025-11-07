<template>
  <div class="space-y-6">
    <!-- Math Type Selection -->
    <div>
      <label class="block font-hand font-bold text-lg mb-2 text-ink">
        What kind of math? 🔢
      </label>
      <select
        v-model="formData.mathType"
        class="hand-drawn-border w-full px-4 py-3 font-hand text-lg bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value="addition">Addition ➕</option>
        <option value="subtraction">Subtraction ➖</option>
        <option value="multiplication">Multiplication ✖️</option>
        <option value="division">Division ➗</option>
        <option value="random">Random Mix 🎲</option>
      </select>
    </div>

    <!-- Asset Input Rows -->
    <div class="space-y-6">
      <!-- Character -->
      <AssetInputRow
        label="Character"
        emoji="👤"
        :options="characterOptions"
        :asset-type="'characters'"
        v-model="formData.character"
      />

      <!-- Object -->
      <AssetInputRow
        label="Object"
        emoji="🎁"
        :options="objectOptions"
        :asset-type="'objects'"
        v-model="formData.object"
      />

      <!-- Place -->
      <AssetInputRow
        label="Place"
        emoji="🌍"
        :options="placeOptions"
        :asset-type="'backgrounds'"
        v-model="formData.place"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AssetInputRow from './AssetInputRow.vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const characterOptions = [
  { value: 'dragon', label: 'Dragon', emoji: '🐉' },
  { value: 'unicorn', label: 'Unicorn', emoji: '🦄' },
  { value: 'robot', label: 'Robot', emoji: '🤖' },
  { value: 'pirate', label: 'Pirate', emoji: '🏴‍☠️' },
  { value: 'astronaut', label: 'Astronaut', emoji: '🚀' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'dog', label: 'Dog', emoji: '🐶' },
  { value: 'bear', label: 'Bear', emoji: '🐻' },
  { value: 'wizard', label: 'Wizard', emoji: '🧙' },
  { value: 'dinosaur', label: 'Dinosaur', emoji: '🦕' },
  { value: 'bunny', label: 'Bunny', emoji: '🐰' },
  { value: 'monkey', label: 'Monkey', emoji: '🐵' },
]

const objectOptions = [
  { value: 'apple', label: 'Apples', emoji: '🍎' },
  { value: 'cookie', label: 'Cookies', emoji: '🍪' },
  { value: 'treasure', label: 'Treasures', emoji: '💎' },
  { value: 'star', label: 'Stars', emoji: '⭐' },
  { value: 'book', label: 'Books', emoji: '📚' },
  { value: 'flower', label: 'Flowers', emoji: '🌸' },
  { value: 'coin', label: 'Coins', emoji: '🪙' },
  { value: 'ball', label: 'Balls', emoji: '⚽' },
  { value: 'gift', label: 'Gifts', emoji: '🎁' },
  { value: 'pizza', label: 'Pizza Slices', emoji: '🍕' },
  { value: 'car', label: 'Cars', emoji: '🚗' },
  { value: 'rocket', label: 'Rockets', emoji: '🚀' },
]

const placeOptions = [
  { value: 'garden', label: 'Garden', emoji: '🌳' },
  { value: 'space', label: 'Outer Space', emoji: '🌌' },
  { value: 'ocean', label: 'Ocean', emoji: '🌊' },
  { value: 'house', label: 'House', emoji: '🏠' },
  { value: 'castle', label: 'Castle', emoji: '🏰' },
  { value: 'forest', label: 'Forest', emoji: '🌲' },
  { value: 'mountain', label: 'Mountain', emoji: '⛰️' },
  { value: 'school', label: 'School', emoji: '🏫' },
]

const formData = reactive({
  mathType: 'addition',
  character: {
    type: null, // 'preset', 'upload', or 'draw'
    preset: '',
    customImage: null,
    customImageName: ''
  },
  object: {
    type: null,
    preset: '',
    customImage: null,
    customImageName: ''
  },
  place: {
    type: null,
    preset: '',
    customImage: null,
    customImageName: ''
  }
})

// Watch for changes and emit
watch(formData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })
</script>
