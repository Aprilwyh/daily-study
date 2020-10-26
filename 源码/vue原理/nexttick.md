```html
<div>
  <div ref="msgDiv">{{msg}}</div>
  <div v-if="msg1">Message got outside $nextTick: {{msg1}}</div>
  <div v-if="msg2">Message got inside $nextTick: {{msg2}}</div>
  <button @click="changeMsg">
    Change the Message
  </button>
</div>
```
```js
new Vue({
  data: {
    msg: 'Hello Vue.',
    msg1: '',
    msg2: ''
  },
  methods: {
    changeMsg() {
      this.msg = "Hello world."
      this.msg1 = this.$refs.msgDiv.innerHTML // Hello Vue.
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML // Hello world.
      })
    }
  }
})
```

## 异步更新
Vue 实现响应式不是数据发生变化之后 DOM 立即变化，而是按一定策略进行 DOM 的更新。  
异步执行的运行机制
1. 所有同步任务都在主线程上执行，形成一个执行栈
2. 主线程之外存在一个任务队列，只要异步任务有了运行结果，就在任务队列中放置一个事件
3. 一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列，看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈开始执行。
4. 主线程不断重复上面的第三步

## 事件循环
Vue 在修改数据之后视图不会立即更新，而是等同一事件循环中的所有数据变化完成之后再统一进行视图更新。
```js
//改变数据
vm.message = 'changed'

//想要立即使用更新后的DOM。这样不行，因为设置message后DOM还没有更新
console.log(vm.$el.textContent) // 并不会得到'changed'

//这样可以，nextTick里面的代码会在DOM更新后执行
Vue.nextTick(function(){
    console.log(vm.$el.textContent) //可以得到'changed'
})
```