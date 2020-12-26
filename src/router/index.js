import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UserInfo from '../views/UserInfo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:username?',
    name: 'UserInfo',
    component: UserInfo,
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
