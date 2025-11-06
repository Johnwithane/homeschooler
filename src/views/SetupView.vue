<template>
  <div class="min-h-screen bg-paper flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <HandDrawnTitle size="xlarge" :animated="true">
        🎨 Worksheet Generator! 🎨
      </HandDrawnTitle>

      <div class="hand-drawn-border bg-white p-8 space-y-8">
        <!-- Name Input -->
        <HandDrawnInput
          v-model="name"
          label="What's your name?"
          placeholder="Enter your name here..."
        />

        <!-- Grade Selector -->
        <GradeSelector v-model="grade" />

        <!-- Avatar Picker -->
        <AvatarPicker v-model="avatar" />

        <!-- Continue Button -->
        <div class="flex justify-center pt-4">
          <HandDrawnButton
            variant="primary"
            size="large"
            :disabled="!canContinue"
            @click="handleContinue"
          >
            Let's Go! 🚀
          </HandDrawnButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HandDrawnTitle from '@/components/common/HandDrawnTitle.vue'
import HandDrawnInput from '@/components/common/HandDrawnInput.vue'
import HandDrawnButton from '@/components/common/HandDrawnButton.vue'
import GradeSelector from '@/components/setup/GradeSelector.vue'
import AvatarPicker from '@/components/setup/AvatarPicker.vue'

const router = useRouter()
const userStore = useUserStore()

// Local state
const name = ref(userStore.studentName)
const grade = ref(userStore.grade)
const avatar = ref(userStore.avatarId)

// Computed
const canContinue = computed(() => {
  return name.value.trim() !== '' && grade.value !== '' && avatar.value !== null
})

// Methods
function handleContinue() {
  if (!canContinue.value) return

  userStore.setStudentName(name.value.trim())
  userStore.setGrade(grade.value)
  userStore.setAvatar(avatar.value)

  router.push('/subjects')
}
</script>
