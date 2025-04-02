import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Inscription from './components/Inscription.vue'
import Customization from './components/Customization.vue'
import Confirmation from './components/Confirmation.vue'
import ModelChoice from './components/ModelChoice.vue'
import Receive from './components/Receive.vue'
import Coaching  from './components/Coaching.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/inscription', name: 'Inscription', component: Inscription },
  { path: '/customization', name: 'Customization', component: Customization },
  { path: '/confirmation', name: 'Confirmation', component: Confirmation },
  { path: '/receive', name: 'Receive', component: Receive },
  { path: '/coaching', name: 'Coaching', component: Coaching },
  { path: '/model-choice', name: 'ModelChoice', component: ModelChoice },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router