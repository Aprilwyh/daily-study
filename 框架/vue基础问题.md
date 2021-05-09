## Vue 组件间的通信方式

A => B => C  
       => D  
A 和 B、B 和 C、B 和 D 都是父子关系，C 和 D 是兄弟关系，A 和 C 是隔代关系（可能隔多代）。

### 父组件与子组件之间

1. props/$emit
props

```js
// 父
<child v-bind:toChild="data"></child>
// 子
<div v-for="item in toChild"></div>
<script>
export default {
  props:{
    toChild:{
      type:Array,
      required:true
    }
  }
}
</script>
```

$emit

```js
// 子
<div @click="change"></div>
<script>
export default {
  methods:{
    change() {
      this.$emit("changed","子向父传值");
    }
  }
}
</script>
// 父
<child v-on:changed="update"></child>
```

2. $emit/$on
   通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级。
```js
var Event=new Vue();
// 发 Event.$emit(事件名,数据); 
methods: {
  send() {
    Event.$emit('data-a', this.name);
  }
}
// 收 Event.$on(事件名,data => {}); 
mounted() {//在模板编译完成后执行
  Event.$on('data-a',name => {
      this.name = name;
  })
}
```
3. Vuex
4. $attrs/$listeners
多级组件嵌套传递数据（仅仅传递数据不做中间处理没必要使用vuex）
5. provide/inject

