// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
// 在你学习mutation的时候会用到它
// 假设mutation-types.js文件中导出变量 export const SOME_MUTATION = 'SOME_MUTATION'
// 假设我们在这里导入这个变量 import { SOME_MUTATION } from './mutation-types'

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
    },
    // 以下在学习mutation的时候会用到
    payload(state, color) {
      state.color = color // 通过载荷可以改变state中的color
    },
    payloadObj(state, payload) {
      state.name = payload.friend
    },
    incrementObj(state, payload) {
      state.age += payload.age // 22 + 18
    },
    // 使用常量替代Mutation事件类型
    // [SOME_MUTATION](state) {
    // ...
    // }

    // Mutation必须是 同步函数！ 为什么？官网解释的很详细~~
    // 在 mutation 中混合异步调用会导致你的程序很难调试，那我要处理异步怎么办？Action哦！！
  },
  // Action来了！ 2020-06-18
  actions: { // 注册action
    // increment(context) {
    //   context.commit('increment');
    // } // 简化
    increment({ commit }) {
      commit('increment');
    },
    // 不同于其他属性只能拿着state或者getters还能拿着getters玩玩，actions可以玩的东西就多了
    // 它接受一个与store实例具有相同方法和属性的context对象，那么
    // 通过context就可以调用context.commit提交一个mutation，或者通过context.state、context.getters玩玩state、getters
    // 但context就是context，它不是store实例本身。为什么呢？ 去看看Module哦！！

    // 在 action 内部执行异步操作
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000)
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

