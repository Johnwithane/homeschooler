import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorksheetStore = defineStore('worksheet', () => {
  // State
  const currentWorksheet = ref(null)
  const isGenerating = ref(false)
  const error = ref(null)
  const currentSubject = ref('')
  const madLibData = ref(null)

  // Actions
  function setWorksheet(worksheet) {
    currentWorksheet.value = worksheet
    error.value = null
  }

  function setGenerating(status) {
    isGenerating.value = status
  }

  function setError(err) {
    error.value = err
    isGenerating.value = false
  }

  function setSubject(subject) {
    currentSubject.value = subject
  }

  function setMadLibData(data) {
    madLibData.value = data
  }

  function reset() {
    currentWorksheet.value = null
    isGenerating.value = false
    error.value = null
    currentSubject.value = ''
    madLibData.value = null
  }

  return {
    currentWorksheet,
    isGenerating,
    error,
    currentSubject,
    madLibData,
    setWorksheet,
    setGenerating,
    setError,
    setSubject,
    setMadLibData,
    reset,
  }
})
