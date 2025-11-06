import { createRouter, createWebHistory } from 'vue-router'
import SetupView from '../views/SetupView.vue'
import SubjectsView from '../views/SubjectsView.vue'
import PromptView from '../views/PromptView.vue'
import WorksheetView from '../views/WorksheetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setup',
      component: SetupView
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: SubjectsView
    },
    {
      path: '/prompt/:subject',
      name: 'prompt',
      component: PromptView,
      props: true
    },
    {
      path: '/worksheet',
      name: 'worksheet',
      component: WorksheetView
    }
  ]
})

export default router
