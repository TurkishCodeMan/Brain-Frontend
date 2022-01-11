import { createRouter, createWebHistory } from 'vue-router'
import UnAuthenticatedApp from '../UnAuthenticatedApp.vue'
import UnAuthUpload from '../views/UnAuthUpload.vue'

import Home from '../views/Home.vue'
import App from "../App.vue";
//Rgister Eksikkkk
const routes = [

  {
    path: '/',
    name:'Home',
    components: {
      default: Home,
      unAuth: UnAuthUpload,
    },
  },

  {
    path: '/login',
    name: 'Login',
    components: {
      default:Home,
      unAuth: UnAuthenticatedApp,
    },
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
