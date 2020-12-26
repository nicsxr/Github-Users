import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import '../node_modules/bulma/css/bulma.css';

Vue.config.productionTip = false

Vue.prototype.$axios = axios
axios.defaults.baseURL = 'https://api.github.com/'
axios.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json'
axios.defaults.headers.common['Authorization'] = 'token ' + process.env.GIT_TOKEN
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')