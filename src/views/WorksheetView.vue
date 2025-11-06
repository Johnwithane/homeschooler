<template>
  <div class="min-h-screen bg-paper p-4 py-8">
    <div class="max-w-5xl mx-auto">
      <!-- Action Buttons (hidden in print) -->
      <div class="no-print flex justify-center gap-4 mb-6">
        <HandDrawnButton
          variant="success"
          size="large"
          @click="printWorksheet"
        >
          🖨️ Print Worksheet
        </HandDrawnButton>

        <HandDrawnButton
          variant="secondary"
          size="medium"
          @click="makeAnother"
        >
          ✨ Make Another
        </HandDrawnButton>

        <HandDrawnButton
          size="medium"
          @click="goBack"
        >
          ← Back to Setup
        </HandDrawnButton>
      </div>

      <!-- Worksheet Display -->
      <WorksheetDisplay v-if="worksheet" :worksheet="worksheet" />

      <!-- No Worksheet State -->
      <div v-else class="text-center hand-drawn-border bg-white p-12">
        <p class="font-hand text-2xl text-ink mb-4">
          No worksheet to display! 😅
        </p>
        <HandDrawnButton
          variant="primary"
          @click="goBack"
        >
          Go Back to Start
        </HandDrawnButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorksheetStore } from '@/stores/worksheetStore'
import HandDrawnButton from '@/components/common/HandDrawnButton.vue'
import WorksheetDisplay from '@/components/worksheet/WorksheetDisplay.vue'

const router = useRouter()
const worksheetStore = useWorksheetStore()

// Computed
const worksheet = computed(() => worksheetStore.currentWorksheet)

// Methods
function printWorksheet() {
  window.print()
}

function makeAnother() {
  worksheetStore.reset()
  router.push('/subjects')
}

function goBack() {
  worksheetStore.reset()
  router.push('/')
}
</script>
