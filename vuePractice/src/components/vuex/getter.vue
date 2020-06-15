<script>
import { mapGetters } from "vuex";
export default {
  template: `<div>{{ doneTodo }}<br>{{$store.getters.doneTodosCount}}个结果<br>第1个是{{ getId }}<br>以上来自getter.vue文件</div>`,
  /* computed: {
    // 从store中的state中派生一些状态，比如对列表过滤并计数
    // doneTodosCount() {
    //   return this.$store.state.todos.filter(todo => todo > 30).length; // 例子，大于30的数据个数
    // }
    // 上述函数用来筛选store中的state，如果多个组件都要用，
    // 那么就复制这个函数每个组件粘一遍，或者把这个方法抽取到一个共享函数中每个组件导入一遍
    // 哇这也太麻烦了吧，so getter来了（可以认为是store的计算属性）

    // 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
    // 上面的方法我们就不要了，把它直接交给store统一处理，然后我们从store中获取
    // 通过属性访问
    doneTodo() {
      return this.$store.getters.doneTodos; // getter在通过属性访问时 是作为Vue的响应式系统的一部分缓存其中的
    },
    // 通过方法访问
    getId() {
      return this.$store.getters.getTodoById(1); // getter在通过方法访问时 每次都会去进行调用，而不会缓存结果。
    }
  } */

  // 学习state的时候我们接触了mapState辅助函数一下子就升级为VIP了
  // getter中的mapGetters辅助函数仅仅是将 store 中的 getter 映射到局部计算属性（仅仅能拿过来而已）
  computed: {
    ...mapGetters({
      doneTodo: "doneTodos" // 把 `this.doneTodo` 映射为 `this.$store.getters.doneTodos`
    }),
    getId() {
      // 方法不用上面的辅助函数
      return this.$store.getters.getTodoById(1);
    }
    // 当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapGetters 传一个字符串数组
    // ...mapGetters([
    //   'doneTodosCount',
    //   'anotherGetter'
    // ])
  }
};
</script>