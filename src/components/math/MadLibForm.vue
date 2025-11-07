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

    <!-- Mad Lib Fields -->
    <div class="hand-drawn-border bg-gradient-to-br from-purple-50 to-pink-50 p-6 space-y-4">
      <h3 class="font-hand font-bold text-xl text-ink mb-4">
        Fill in your story details! ✨
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block font-hand font-bold text-base mb-1 text-ink">
            Character Name:
          </label>
          <input
            v-model="formData.characterName"
            type="text"
            placeholder="e.g., Luna the Dragon"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label class="block font-hand font-bold text-base mb-1 text-ink">
            A Sound:
          </label>
          <input
            v-model="formData.sound"
            type="text"
            placeholder="e.g., whoosh, beep, roar"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label class="block font-hand font-bold text-base mb-1 text-ink">
            An Object (plural):
          </label>
          <input
            v-model="formData.objectPlural"
            type="text"
            placeholder="e.g., apples, stars, cookies"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label class="block font-hand font-bold text-base mb-1 text-ink">
            A Place:
          </label>
          <input
            v-model="formData.place"
            type="text"
            placeholder="e.g., magical garden, space"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label class="block font-hand font-bold text-base mb-1 text-ink">
            An Action (verb):
          </label>
          <input
            v-model="formData.action"
            type="text"
            placeholder="e.g., collecting, finding"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label class="block font-hand font-bold text-base mb-1 text-ink">
            An Adjective:
          </label>
          <input
            v-model="formData.adjective"
            type="text"
            placeholder="e.g., sparkly, giant, tiny"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>
    </div>

    <!-- Story Notes -->
    <div>
      <label class="block font-hand font-bold text-lg mb-2 text-ink">
        Story Notes (Optional) 📝
      </label>
      <textarea
        v-model="formData.storyNotes"
        placeholder="Add any extra details about your story... What makes it special?"
        class="hand-drawn-border w-full h-24 px-4 py-3 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
      ></textarea>
    </div>

    <!-- Character Image Selection -->
    <div class="hand-drawn-border bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <h3 class="font-hand font-bold text-xl text-ink mb-4">
        Choose your character image! 🎨
      </h3>

      <!-- Preset Image Selection -->
      <div class="mb-4">
        <label class="block font-hand font-bold text-base mb-2 text-ink">
          Pick a preset character:
        </label>
        <select
          v-model="formData.characterImage"
          @change="clearCustomImage"
          class="hand-drawn-border w-full px-4 py-3 font-hand text-lg bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">-- Select a character --</option>
          <option v-for="char in availableCharacters" :key="char.value" :value="char.value">
            {{ char.emoji }} {{ char.label }}
          </option>
        </select>
      </div>

      <!-- Preview Selected Character -->
      <div v-if="formData.characterImage && !formData.customImage" class="text-center mb-4">
        <div class="text-8xl">{{ getCharacterEmoji(formData.characterImage) }}</div>
        <p class="font-hand text-sm text-gray-600 mt-2">Selected Character</p>
      </div>

      <!-- Custom Image Upload -->
      <div class="mt-4">
        <label class="block font-hand font-bold text-base mb-2 text-ink">
          Or upload your own image:
        </label>
        <div class="flex items-center gap-4">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="hidden"
          />
          <button
            type="button"
            @click="triggerFileUpload"
            class="hand-drawn-border bg-white hover:bg-blue-100 px-4 py-2 font-hand transition-colors"
          >
            📁 Choose File
          </button>
          <span v-if="formData.customImageName" class="font-hand text-sm text-gray-700">
            {{ formData.customImageName }}
          </span>
        </div>

        <!-- Custom Image Preview -->
        <div v-if="formData.customImage" class="mt-4 text-center">
          <img
            :src="formData.customImage"
            alt="Custom character"
            class="max-w-xs max-h-48 mx-auto hand-drawn-border bg-white p-2"
          />
          <p class="font-hand text-sm text-gray-600 mt-2">Your Custom Character</p>
          <button
            type="button"
            @click="removeCustomImage"
            class="hand-drawn-border bg-red-100 hover:bg-red-200 px-3 py-1 font-hand text-sm mt-2 transition-colors"
          >
            Remove Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const fileInput = ref(null)

const availableCharacters = [
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

const formData = reactive({
  mathType: 'addition',
  characterName: '',
  sound: '',
  objectPlural: '',
  place: '',
  action: '',
  adjective: '',
  storyNotes: '',
  characterImage: '',
  customImage: null,
  customImageName: ''
})

// Watch for changes and emit
watch(formData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

function getCharacterEmoji(characterValue) {
  const char = availableCharacters.find(c => c.value === characterValue)
  return char ? char.emoji : '❓'
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large. Please upload an image smaller than 5MB')
    return
  }

  // Read the file and convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.customImage = e.target?.result
    formData.customImageName = file.name
    formData.characterImage = '' // Clear preset selection
  }
  reader.readAsDataURL(file)
}

function removeCustomImage() {
  formData.customImage = null
  formData.customImageName = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function clearCustomImage() {
  if (formData.characterImage) {
    formData.customImage = null
    formData.customImageName = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>
