// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    color: 'red',
    name: 'Tom',
    age: 22
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
// 通过store.state获取状态对象
// 通过store.commit方法触发状态变更
/* store.commit('increment')
console.log(store.state.count) // 1 */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store // Vuex
})

