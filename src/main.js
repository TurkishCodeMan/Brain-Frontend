import { createApp } from 'vue'
import Index from './Index.vue'
import router from './router'
import store from './store'
import "./scss/main.scss"

import './assets/index.css'

import { createHead } from '@vueuse/head'
const head = createHead()


createApp(Index).use(head).use(store).use(router).mount('#app')
