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

const moduleA = {
  // 带命名空间的模块，模块被注册后所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名
  // 比如count是a.getters.doubleCount，不是store.getters.doubleCount
  namespaced: true,
  state: () => ({
    count: 8
  }),
  /* state: {
    count: 8
  }, */
  // 以上两种写法有什么不一样？？ 见markdown详解
  // 对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象
  mutations: {
    incrementMu(state) { // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
    // 对于模块内部的 getter，根节点状态会作为第三个参数暴露出来
    // 使用namespaced: true 后，使用全局getter可以添加第四个参数
    sumWithRootCount(state, getters, rootState, rootGetters) {
      return state.count + rootState.count // 10 + 3
    }
  },
  // 对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState, rootGetters }) {
      console.log(state.count) // 9，自己的
      console.log(rootState.count) // 3，爸爸的
      if ((state.count + rootState.count) % 2 === 0) {
        commit('incrementMu') // 自己的
        commit('increment', null, { root: true }) // 爸爸的
        // dispatch也可以使用{ root: true }，作为第三个参数传递给dispatch
        // dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'
      }
    }
  },
}

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
      state.age += payload.age
    },
    // 使用常量替代Mutation事件类型
    // [SOME_MUTATION](state) {
    // ...
    // }

    // Mutation必须是 同步函数！ 为什么？官网解释的很详细~~
    // 在 mutation 中混合异步调用会导致你的程序很难调试，那我要处理异步怎么办？Action哦！！
    testA(state) { // 仅给组合actionA测试用
      state.color = 'pink'
    },
    testB(state) { // 仅给组合actionB测试用
      state.color = 'purple'
    }
  },
  // Action来了！ 2020-06-18
  actions: { // 注册action
    // increment(context) {
    //   context.commit('increment');
    // } // 参数解构简化代码
    increment({ commit }) {
      commit('increment')
    },
    // 不同于其他属性只能拿着state或者getters还能拿着getters玩玩，actions可以玩的东西就多了
    // 它接受一个与store实例具有相同方法和属性的context对象，那么
    // 通过context就可以调用context.commit提交一个mutation，或者通过context.state、context.getters玩玩state、getters
    // 但context就是context，它不是store实例本身。为什么呢？ 去看看Module哦！！

    // 在 action 内部执行异步操作
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    incrementObj({ commit }, age) {
      commit('incrementObj', age) // 接收递过来的载荷。组件中分发action，提交mutation，在提交的时候传入所需载荷
    },
    // 组合多个action处理更加复杂的异步流程
    /* actionA({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('testA')
          resolve()
        }, 1000)
      })
    },
    actionB({ dispatch, commit }) {
      return dispatch('actionA').then(() => {
        commit('testB')
      })
    } */
    // 组合上述代码
    async actionA({ commit }) {
      commit('testA', await (
        console.log("[组合后]actionA:" + store.state.color)
      ))
    },
    async actionB({ dispatch, commit }) {
      // store.dispatch 在不同模块中可以触发多个 action 函数
      // 只有当所有触发函数完成后，返回的 Promise 才会执行
      // 即返回的Promise被store.dispatch处理
      await dispatch('actionA') // 等待actionA完成
      commit('testB', await (
        console.log("[组合后]actionB:" + store.state.color)
      ))
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
  },
  modules: {
    a: moduleA
  }
})

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
// store.registerModule(['nested', 'myModule'], {
//   // ...会报错，不知道为啥
// })
// 通过 store.state.myModule 和 store.state.nested.myModule 访问模块的状态
// 使用 store.unregisterModule(moduleName) 来动态卸载模块
// 通过 store.hasModule(moduleName) 方法检查该模块是否已经被注册到 store
store.registerModule('a', module, {
  preserveState: true // 保留store的state，action、mutation 和 getter 会被添加到 store 中，state不会（这样就不会覆盖）
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

