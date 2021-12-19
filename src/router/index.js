import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FileList from '../views/FileList.vue'



//Rgister Eksikkkk
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/file-list',
    name: 'FileList',
    component: FileList
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
