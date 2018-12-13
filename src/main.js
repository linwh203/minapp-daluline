import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

const global = {
  userInfo:''
};
Vue.prototype.GLOBAL = global;