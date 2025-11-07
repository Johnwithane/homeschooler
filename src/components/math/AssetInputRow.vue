<template>
  <div class="hand-drawn-border bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
    <div class="flex flex-col md:flex-row md:items-start gap-4">
      <!-- Label -->
      <div class="md:w-32 flex-shrink-0">
        <h3 class="font-hand font-bold text-lg text-ink flex items-center gap-2">
          <span>{{ emoji }}</span>
          <span>{{ label }}</span>
        </h3>
      </div>

      <!-- Options -->
      <div class="flex-1">
        <!-- Name Input -->
        <div class="mb-4">
          <label class="block font-hand font-bold text-sm mb-1 text-ink">
            {{ label }} Name:
          </label>
          <input
            v-model="localValue.name"
            type="text"
            :placeholder="placeholder"
            class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <!-- Visual Selection Label -->
        <label class="block font-hand font-bold text-sm mb-2 text-ink">
          {{ label }} Image:
        </label>

        <!-- Tab Buttons -->
        <div class="flex gap-2 mb-3">
          <button
            type="button"
            @click="activeTab = 'preset'"
            :class="[
              'hand-drawn-border px-3 py-1 font-hand text-sm transition-colors',
              activeTab === 'preset' ? 'bg-blue-200' : 'bg-white hover:bg-blue-100'
            ]"
          >
            📋 Pick
          </button>
          <button
            type="button"
            @click="activeTab = 'upload'"
            :class="[
              'hand-drawn-border px-3 py-1 font-hand text-sm transition-colors',
              activeTab === 'upload' ? 'bg-blue-200' : 'bg-white hover:bg-blue-100'
            ]"
          >
            📁 Upload
          </button>
          <button
            type="button"
            @click="activeTab = 'draw'"
            :class="[
              'hand-drawn-border px-3 py-1 font-hand text-sm transition-colors',
              activeTab === 'draw' ? 'bg-blue-200' : 'bg-white hover:bg-blue-100'
            ]"
          >
            ✏️ Draw
          </button>
        </div>

        <!-- Tab Content -->
        <div class="bg-white hand-drawn-border p-3">
          <!-- Preset Dropdown -->
          <div v-if="activeTab === 'preset'">
            <select
              v-model="localValue.preset"
              @change="onPresetChange"
              class="hand-drawn-border w-full px-3 py-2 font-hand text-base bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">-- Select {{ label }} --</option>
              <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.emoji }} {{ option.label }}
              </option>
            </select>

            <!-- Preview -->
            <div v-if="localValue.preset && localValue.type === 'preset'" class="mt-3 text-center">
              <img
                v-if="getAssetImage(localValue.preset)"
                :src="getAssetImage(localValue.preset)"
                :alt="localValue.preset"
                class="max-w-[100px] max-h-[100px] mx-auto"
              />
              <div v-else class="text-6xl">{{ getAssetEmoji(localValue.preset) }}</div>
              <p class="font-hand text-sm text-gray-600 mt-1">{{ getAssetLabel(localValue.preset) }}</p>
            </div>
          </div>

          <!-- Upload -->
          <div v-if="activeTab === 'upload'">
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
              class="hand-drawn-border bg-white hover:bg-blue-100 px-4 py-2 font-hand w-full transition-colors"
            >
              📁 Choose File
            </button>

            <div v-if="localValue.customImage && localValue.type === 'upload'" class="mt-3 text-center">
              <img
                :src="localValue.customImage"
                :alt="localValue.customImageName"
                class="max-w-[150px] max-h-[150px] mx-auto hand-drawn-border bg-white p-2"
              />
              <p class="font-hand text-sm text-gray-600 mt-2">{{ localValue.customImageName }}</p>
              <button
                type="button"
                @click="removeCustomImage"
                class="hand-drawn-border bg-red-100 hover:bg-red-200 px-3 py-1 font-hand text-sm mt-2 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- Draw -->
          <div v-if="activeTab === 'draw'">
            <DrawingCanvas
              v-if="!localValue.customImage || localValue.type !== 'draw'"
              :width="250"
              :height="250"
              @save="handleDrawingSave"
            />
            <div v-else class="text-center">
              <img
                :src="localValue.customImage"
                :alt="'Drawing'"
                class="max-w-[150px] max-h-[150px] mx-auto hand-drawn-border bg-white p-2"
              />
              <p class="font-hand text-sm text-gray-600 mt-2">Your Drawing</p>
              <button
                type="button"
                @click="clearDrawing"
                class="hand-drawn-border bg-red-100 hover:bg-red-200 px-3 py-1 font-hand text-sm mt-2 transition-colors"
              >
                Clear & Redraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import DrawingCanvas from '../common/DrawingCanvas.vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    default: '📝'
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  assetType: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({
      name: '',
      type: null,
      preset: '',
      customImage: null,
      customImageName: ''
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref('preset')
const fileInput = ref(null)

const localValue = reactive({
  name: props.modelValue.name || '',
  type: props.modelValue.type || null,
  preset: props.modelValue.preset || '',
  customImage: props.modelValue.customImage || null,
  customImageName: props.modelValue.customImageName || ''
})

// Watch for changes and emit
watch(localValue, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

function getAssetEmoji(value) {
  const option = props.options.find(o => o.value === value)
  return option ? option.emoji : '❓'
}

function getAssetLabel(value) {
  const option = props.options.find(o => o.value === value)
  return option ? option.label : ''
}

function getAssetImage(value) {
  // Try to load webp image from static folder
  try {
    return `/assets/${props.assetType}/${value}.webp`
  } catch {
    return null
  }
}

function onPresetChange() {
  localValue.type = 'preset'
  localValue.customImage = null
  localValue.customImageName = ''
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large. Please upload an image smaller than 5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    localValue.type = 'upload'
    localValue.customImage = e.target?.result
    localValue.customImageName = file.name
    localValue.preset = ''
  }
  reader.readAsDataURL(file)
}

function removeCustomImage() {
  localValue.type = null
  localValue.customImage = null
  localValue.customImageName = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleDrawingSave(dataUrl) {
  localValue.type = 'draw'
  localValue.customImage = dataUrl
  localValue.customImageName = 'drawing'
  localValue.preset = ''
}

function clearDrawing() {
  localValue.type = null
  localValue.customImage = null
  localValue.customImageName = ''
}
</script>
