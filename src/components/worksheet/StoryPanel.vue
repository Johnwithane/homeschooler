<template>
  <div class="story-panel">
    <!-- Panel Container (1x1 aspect ratio) -->
    <div class="panel-frame hand-drawn-border bg-white relative overflow-hidden">
      <!-- Asset Layer -->
      <div class="asset-layer absolute inset-0">
        <div
          v-for="(asset, index) in panelData.assets"
          :key="index"
          class="asset-item absolute transition-all duration-300"
          :style="getAssetStyle(asset)"
        >
          <!-- Custom Image -->
          <img
            v-if="hasCustomImage(asset)"
            :src="getCustomImageUrl(asset)"
            :alt="asset.name"
            class="custom-asset-image"
            :style="{ width: asset.size || '3rem', height: asset.size || '3rem' }"
          />
          <!-- Emoji Fallback -->
          <span v-else class="asset-emoji" :style="{ fontSize: asset.size || '3rem' }">
            {{ getAssetEmoji(asset) }}
          </span>
        </div>
      </div>

      <!-- Story Beat Text -->
      <div class="story-text absolute bottom-0 left-0 right-0 bg-white/90 p-3 border-t-2 border-ink">
        <p class="font-hand text-sm md:text-base leading-tight">
          {{ panelData.storyBeat }}
        </p>
      </div>
    </div>

    <!-- Math Question Section -->
    <div class="question-section hand-drawn-border bg-blue-50 p-4 mt-3">
      <div class="mb-2">
        <span class="font-hand font-bold text-lg">{{ questionNumber }}.</span>
        <span class="font-hand text-base ml-2">{{ panelData.question }}</span>
      </div>

      <!-- Answer Space -->
      <div class="answer-space ml-6">
        <div v-if="panelData.answerType === 'box'" class="answer-box hand-drawn-border bg-white p-4 min-h-[60px]">
          <div class="border-b-2 border-dotted border-ink w-full h-8"></div>
        </div>
        <div v-else-if="panelData.answerType === 'line'" class="answer-line">
          <div class="border-b-4 border-dotted border-ink w-full h-10"></div>
        </div>
        <div v-else-if="panelData.answerType === 'multiple_choice'" class="space-y-2">
          <div v-for="(option, idx) in panelData.options" :key="idx" class="flex items-center gap-3">
            <div class="hand-drawn-border w-6 h-6 bg-white"></div>
            <span class="font-hand text-base">{{ option }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAssets } from '@/composables/useAssets'
import { useWorksheetStore } from '@/stores/worksheetStore'

const props = defineProps({
  panelData: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.storyBeat &&
        value.question &&
        Array.isArray(value.assets)
      )
    }
  },
  questionNumber: {
    type: Number,
    required: true
  }
})

const { getEmoji, loadAssets } = useAssets()
const worksheetStore = useWorksheetStore()

onMounted(async () => {
  await loadAssets()
})

/**
 * Check if an asset should use a custom image
 */
const hasCustomImage = (asset) => {
  const madLibData = worksheetStore.madLibData
  if (!madLibData) return false

  // Check if this asset matches any of the custom images
  if (asset.category === 'characters' && madLibData.character) {
    return asset.name === madLibData.character.preset && madLibData.character.customImage
  }
  if (asset.category === 'objects' && madLibData.object) {
    return asset.name === madLibData.object.preset && madLibData.object.customImage
  }
  if (asset.category === 'backgrounds' && madLibData.place) {
    return asset.name === madLibData.place.preset && madLibData.place.customImage
  }

  return false
}

/**
 * Get custom image URL for an asset
 */
const getCustomImageUrl = (asset) => {
  const madLibData = worksheetStore.madLibData
  if (!madLibData) return null

  if (asset.category === 'characters' && madLibData.character) {
    if (asset.name === madLibData.character.preset) {
      return madLibData.character.customImage
    }
  }
  if (asset.category === 'objects' && madLibData.object) {
    if (asset.name === madLibData.object.preset) {
      return madLibData.object.customImage
    }
  }
  if (asset.category === 'backgrounds' && madLibData.place) {
    if (asset.name === madLibData.place.preset) {
      return madLibData.place.customImage
    }
  }

  return null
}

/**
 * Get emoji for an asset
 */
const getAssetEmoji = (asset) => {
  return getEmoji(asset.category, asset.name, asset.fallbackEmoji || '❓')
}

/**
 * Get CSS style for positioning an asset
 */
const getAssetStyle = (asset) => {
  return {
    left: `${asset.x || 0}%`,
    top: `${asset.y || 0}%`,
    transform: `translate(-50%, -50%) ${asset.rotate ? `rotate(${asset.rotate}deg)` : ''}`,
    zIndex: asset.layer || 1,
    opacity: asset.opacity || 1
  }
}
</script>

<style scoped>
.panel-frame {
  aspect-ratio: 1 / 1;
  max-width: 400px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #e0f2fe 0%, #ffffff 100%);
}

.asset-layer {
  pointer-events: none;
  user-select: none;
}

.asset-emoji {
  display: block;
  line-height: 1;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
}

.custom-asset-image {
  display: block;
  object-fit: contain;
  border-radius: 8px;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
}

.story-text {
  backdrop-filter: blur(4px);
}

@media print {
  .panel-frame {
    max-width: 100%;
  }
}
</style>
