<template>
  <div class="worksheet bg-white p-8 max-w-4xl mx-auto hand-drawn-border">
    <!-- Header -->
    <div class="border-b-4 border-ink pb-4 mb-6">
      <div class="flex justify-between items-start gap-4 mb-4 flex-wrap">
        <div class="flex-1 min-w-[200px]">
          <label class="font-hand text-sm">Name:</label>
          <div class="border-b-2 border-dotted border-ink mt-1 pb-1 font-hand text-lg">
            {{ worksheet.studentName }}
          </div>
        </div>
        <div class="flex-1 min-w-[150px]">
          <label class="font-hand text-sm">Date:</label>
          <div class="border-b-2 border-dotted border-ink mt-1 pb-1 font-hand text-lg">
            {{ formattedDate }}
          </div>
        </div>
        <div class="min-w-[100px]">
          <label class="font-hand text-sm">Grade:</label>
          <div class="border-b-2 border-dotted border-ink mt-1 pb-1 font-hand text-lg">
            {{ worksheet.grade === 'K' ? 'K' : `Grade ${worksheet.grade}` }}
          </div>
        </div>
      </div>
      <h2 class="font-hand font-bold text-3xl text-center text-ink">
        {{ worksheet.subject }} Worksheet
      </h2>
      <h3 v-if="isPanelBased" class="font-hand text-xl text-center text-ink mt-2">
        {{ worksheet.storyTitle }}
      </h3>
    </div>

    <!-- Panel-Based Layout (for Math) -->
    <div v-if="isPanelBased">
      <div class="space-y-8">
        <StoryPanel
          v-for="(panel, index) in worksheet.panels"
          :key="index"
          :panel-data="panel"
          :question-number="index + 1"
        />
      </div>
    </div>

    <!-- Traditional Layout (for other subjects) -->
    <div v-else>
      <!-- Story Section -->
      <div class="mb-8">
        <h3 class="font-hand font-bold text-2xl mb-3 text-ink flex items-center gap-2">
          <span>📖</span>
          <span>Story Time!</span>
        </h3>
        <div class="hand-drawn-border bg-yellow-50 p-6">
          <p class="font-hand text-lg leading-relaxed">
            {{ worksheet.story }}
          </p>
        </div>
      </div>

      <!-- Problems Section -->
      <div>
        <h3 class="font-hand font-bold text-2xl mb-4 text-ink flex items-center gap-2">
          <span>✏️</span>
          <span>Let's Practice!</span>
        </h3>
        <div class="space-y-6">
          <div
            v-for="(problem, index) in worksheet.problems"
            :key="index"
            class="hand-drawn-border bg-blue-50 p-6"
          >
            <div class="mb-3">
              <span class="font-hand font-bold text-xl">{{ index + 1 }}.</span>
              <span class="font-hand text-lg ml-2">{{ problem.question }}</span>
            </div>

            <!-- Multiple Choice -->
            <div v-if="problem.type === 'multiple_choice'" class="ml-6 space-y-2">
              <div v-for="(option, optIndex) in problem.options" :key="optIndex" class="flex items-center gap-3">
                <div class="hand-drawn-border w-6 h-6 bg-white"></div>
                <span class="font-hand text-base">{{ option }}</span>
              </div>
            </div>

            <!-- Fill in the Blank or Short Answer -->
            <div v-else-if="problem.type === 'fill_blank' || problem.type === 'short_answer'" class="ml-6">
              <div class="border-b-4 border-dotted border-ink w-full h-12"></div>
            </div>

            <!-- True/False -->
            <div v-else-if="problem.type === 'true_false'" class="ml-6 flex gap-6">
              <div class="flex items-center gap-3">
                <div class="hand-drawn-border w-6 h-6 bg-white"></div>
                <span class="font-hand text-base font-bold">True</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="hand-drawn-border w-6 h-6 bg-white"></div>
                <span class="font-hand text-base font-bold">False</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with fun message -->
    <div class="mt-8 pt-6 border-t-4 border-ink text-center">
      <p class="font-hand text-xl text-ink">
        🌟 Great job! You're doing amazing! 🌟
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StoryPanel from './StoryPanel.vue'

const props = defineProps({
  worksheet: {
    type: Object,
    required: true
  }
})

const isPanelBased = computed(() => {
  return props.worksheet.isPanelBased === true
})

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
