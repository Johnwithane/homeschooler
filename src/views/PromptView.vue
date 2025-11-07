<template>
  <div class="min-h-screen bg-paper p-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button - Top Left -->
      <div class="mb-4">
        <HandDrawnButton
          @click="goBack"
          :disabled="isGenerating"
          size="small"
        >
          ← Back
        </HandDrawnButton>
      </div>

      <!-- Header -->
      <HandDrawnTitle size="large">
        {{ subject }} Time! {{ subjectIcon }}
      </HandDrawnTitle>

      <div class="hand-drawn-border bg-white p-8 space-y-6">
        <!-- Math Mad Lib Form -->
        <div v-if="subject === 'Math'">
          <div class="text-center mb-6">
            <p class="font-hand text-xl text-ink mb-2">
              Let's create a fun math adventure! 🎉
            </p>
            <p class="font-hand text-base text-gray-600">
              Fill in the blanks to create your unique math story!
            </p>
          </div>

          <MadLibForm v-model="madLibData" />
        </div>

        <!-- Traditional Prompt (for other subjects) -->
        <div v-else>
          <!-- Instructions -->
          <div class="text-center mb-6">
            <p class="font-hand text-xl text-ink mb-2">
              Tell me what kind of worksheet you want!
            </p>
            <p class="font-hand text-base text-gray-600">
              Be creative! The more fun your idea, the better the worksheet!
            </p>
          </div>

          <!-- Textarea -->
          <div>
            <label class="block font-hand font-bold text-lg mb-2 text-ink">
              Your Story Idea:
            </label>
            <textarea
              v-model="prompt"
              :placeholder="placeholderText"
              :disabled="isGenerating"
              class="hand-drawn-border w-full h-48 px-4 py-3 font-hand text-lg bg-white focus:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-50"
            ></textarea>
          </div>

          <!-- Example Prompts -->
          <div v-if="examplePrompts.length > 0">
            <p class="font-hand text-sm text-gray-600 mb-2">
              💡 Need inspiration? Try one of these:
            </p>
            <div class="space-y-2">
              <button
                v-for="(example, index) in examplePrompts"
                :key="index"
                :disabled="isGenerating"
                class="block w-full text-left hand-drawn-border bg-blue-50 hover:bg-blue-100 px-4 py-2 font-hand text-sm transition-colors disabled:opacity-50"
                @click="prompt = example"
              >
                {{ example }}
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="hand-drawn-border bg-red-100 p-4">
          <p class="font-hand text-red-700 font-bold">
            ⚠️ Oops! {{ error }}
          </p>
          <p class="font-hand text-sm text-red-600 mt-2">
            Please try again or use a different prompt.
          </p>
        </div>

        <!-- Generate Button -->
        <div class="flex justify-center pt-4">
          <HandDrawnButton
            variant="primary"
            size="large"
            :disabled="!canGenerate"
            @click="generateWorksheet"
          >
            <span v-if="!isGenerating">Generate Worksheet! ✨</span>
            <span v-else>Generating... 🎨</span>
          </HandDrawnButton>
        </div>

        <!-- Loading State -->
        <div v-if="isGenerating" class="text-center">
          <div class="inline-block animate-spin text-4xl">🎨</div>
          <p class="font-hand text-lg text-ink mt-2">
            Creating your awesome worksheet...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useWorksheetStore } from '@/stores/worksheetStore'
import { generateWorksheet as generateWorksheetAPI, getExamplePrompts } from '@/services/llmService'
import HandDrawnTitle from '@/components/common/HandDrawnTitle.vue'
import HandDrawnButton from '@/components/common/HandDrawnButton.vue'
import MadLibForm from '@/components/math/MadLibForm.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const worksheetStore = useWorksheetStore()

// Props
const subject = route.params.subject

// Local state
const prompt = ref('')
const examplePrompts = ref([])
const madLibData = ref({
  mathType: 'addition',
  character: {
    type: null,
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

// Computed
const isGenerating = computed(() => worksheetStore.isGenerating)
const error = computed(() => worksheetStore.error)

const subjectIcon = computed(() => {
  const icons = {
    'Math': '🔢',
    'Science': '🔬',
    'Reading': '📚',
    'Writing': '✍️'
  }
  return icons[subject] || '📝'
})

const placeholderText = computed(() => {
  const placeholders = {
    'Math': 'Example: I want to count apples with a friendly dragon in a magical garden...',
    'Science': 'Example: Explore the life cycle of butterflies in a beautiful garden...',
    'Reading': 'Example: Read about a brave knight going on a quest to save the kingdom...',
    'Writing': 'Example: Write about a day in the life of a superhero who can talk to animals...'
  }
  return placeholders[subject] || 'Describe your worksheet idea here...'
})

const canGenerate = computed(() => {
  if (isGenerating.value) return false

  // For Math, validate Mad Lib form
  if (subject === 'Math') {
    const data = madLibData.value
    // Check if all three assets have been selected
    const hasCharacter = data.character.type && (data.character.preset || data.character.customImage)
    const hasObject = data.object.type && (data.object.preset || data.object.customImage)
    const hasPlace = data.place.type && (data.place.preset || data.place.customImage)

    return hasCharacter && hasObject && hasPlace
  }

  // For other subjects, validate prompt
  return prompt.value.trim().length > 10
})

// Methods
async function generateWorksheet() {
  if (!canGenerate.value) return

  worksheetStore.setGenerating(true)
  worksheetStore.setError(null)

  try {
    // For Math, pass mad lib data; for others, pass prompt
    const worksheetPrompt = subject === 'Math' ? madLibData.value : prompt.value

    // Store mad lib data if it's Math (for custom image display)
    if (subject === 'Math') {
      worksheetStore.setMadLibData(madLibData.value)
    }

    const worksheet = await generateWorksheetAPI(
      userStore.grade,
      subject,
      userStore.studentName,
      worksheetPrompt
    )

    worksheetStore.setWorksheet(worksheet)
    router.push('/worksheet')
  } catch (err) {
    console.error('Error generating worksheet:', err)
    worksheetStore.setError(err.message || 'Failed to generate worksheet. Please try again.')
  } finally {
    worksheetStore.setGenerating(false)
  }
}

function goBack() {
  router.push('/subjects')
}

// Lifecycle
onMounted(() => {
  examplePrompts.value = getExamplePrompts(subject)
})
</script>
