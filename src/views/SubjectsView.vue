<template>
  <div class="min-h-screen bg-paper p-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Back Button - Top Left -->
      <div class="mb-4">
        <HandDrawnButton @click="goBack" size="small">
          ← Back
        </HandDrawnButton>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <HandDrawnTitle size="large">
          Hi {{ userStore.studentName }}! 👋
        </HandDrawnTitle>
        <p class="text-center font-hand text-ink">
          Pick a subject to start learning!
        </p>
      </div>

      <!-- Subject Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SubjectCard
          v-for="subject in subjects"
          :key="subject.name"
          :subject="subject.name"
          :icon="subject.icon"
          :description="subject.description"
          :disabled="subject.name !== 'Math'"
          @click="selectSubject(subject.name)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useWorksheetStore } from '@/stores/worksheetStore'
import HandDrawnTitle from '@/components/common/HandDrawnTitle.vue'
import HandDrawnButton from '@/components/common/HandDrawnButton.vue'
import SubjectCard from '@/components/subjects/SubjectCard.vue'

const router = useRouter()
const userStore = useUserStore()
const worksheetStore = useWorksheetStore()

const subjects = [
  {
    name: 'Math',
    icon: '🔢',
    description: 'Numbers, counting, and problem solving!'
  },
  {
    name: 'Science',
    icon: '🔬',
    description: 'Explore the world around you!'
  },
  {
    name: 'Reading',
    icon: '📚',
    description: 'Stories and comprehension!'
  },
  {
    name: 'Writing',
    icon: '✍️',
    description: 'Express your ideas and creativity!'
  }
]

function selectSubject(subject) {
  worksheetStore.setSubject(subject)
  router.push(`/prompt/${subject}`)
}

function goBack() {
  router.push('/')
}
</script>
