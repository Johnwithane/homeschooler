import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const studentName = ref('')
  const grade = ref('')
  const avatarId = ref(null)

  // Actions
  function setStudentName(name) {
    studentName.value = name
  }

  function setGrade(gradeLevel) {
    grade.value = gradeLevel
  }

  function setAvatar(id) {
    avatarId.value = id
  }

  function reset() {
    studentName.value = ''
    grade.value = ''
    avatarId.value = null
  }

  return {
    studentName,
    grade,
    avatarId,
    setStudentName,
    setGrade,
    setAvatar,
    reset,
  }
})
