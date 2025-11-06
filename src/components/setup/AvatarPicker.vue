<template>
  <div class="w-full">
    <p class="text-lg font-hand font-bold mb-4 text-ink text-center">Choose your avatar:</p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <button
        v-for="avatar in avatars"
        :key="avatar.id"
        :class="[
          'hand-drawn-border',
          'p-4 aspect-square',
          'transition-all duration-200',
          'transform hover:scale-110 active:scale-95',
          'flex items-center justify-center',
          selectedAvatar === avatar.id
            ? 'bg-blue-300 ring-4 ring-blue-500'
            : 'bg-white hover:bg-blue-100'
        ]"
        @click="selectAvatar(avatar.id)"
        :title="avatar.name"
      >
        <div class="text-5xl">{{ avatar.emoji }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

// Placeholder avatars using emojis until Forrest draws them
const avatars = [
  { id: 1, name: 'Dragon', emoji: '🐉' },
  { id: 2, name: 'Unicorn', emoji: '🦄' },
  { id: 3, name: 'Robot', emoji: '🤖' },
  { id: 4, name: 'Astronaut', emoji: '👨‍🚀' },
  { id: 5, name: 'Wizard', emoji: '🧙' },
  { id: 6, name: 'Pirate', emoji: '🏴‍☠️' }
]

const selectedAvatar = ref(props.modelValue)

function selectAvatar(id) {
  selectedAvatar.value = id
  emit('update:modelValue', id)
}
</script>
