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
    age: 22,
    todos: [{ id: 1, text: 51 }, { id: 2, text: 22 }, { id: 3, text: 40 }]
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  getters: { // 在学习getter的时候你会用到它
    doneTodos: state => {
      return state.todos.filter(todo => todo.text > 30); // 例子，过滤text大于30的数据
    },
    doneTodosCount: (state, getters) => { // 也能接受其他getter做第二个参数
      return getters.doneTodos.length; // 在其他getter基础上做点什么事情
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id);
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

