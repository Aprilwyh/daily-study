<script>
import { mapActions } from "vuex";
export default {
  template: `<div>{{ $store.state.count }}<br>
  {{$store.state.age}}<br>
  {{$store.state.color}}<br>
  我来自action页面</div>`,
  // Action类似于mutation，但区别如下：
  // Action提交的是mutation，而不是直接变更状态
  // Action可以包含任意异步操作

  // Action通过store.dispatch方法触发
  // dispatch：含有异步操作，例如向后台提交数据，写法： this.$store.dispatch('action方法名',值)
  // commit：同步操作，写法：this.$store.commit('mutations方法名',值)
  /* created() {
    this.$store.dispatch("increment");
    // actions支持两种方式进行分发
    // 载荷方式
    this.$store.dispatch("incrementAsync", {
      amount: 10
    });
    // 对象方式
    this.$store.dispatch({
      type: "incrementAsync",
      amount: 10
    });
  } */

  created() {
    this.increment(); // 得调用方法，不然执行不了哦
    this.incrementObj({ age: 10 }); // 传递载荷，为什么是传[递]呢？因为它只是把载荷递到了commit入口
    /* this.actionA().then(() => {
      console.log("actionA样式变为" + this.$store.state.color); // 样式从red[原始的]变为pink了
    });
    this.actionB().then(() => {
      console.log("actionB样式变为" + this.$store.state.color); // 样式从A的pink变成B的purple了
    }); */
    // 组合actionA、B后
    this.actionB();
  },
  // 辅助函数 mapActions
  methods: {
    ...mapActions([
      "increment", // 将`this.increment()`映射为`this.$store.dispatch('increment')`
      // `mapActions` 也支持载荷
      "incrementObj", // 将 `this.incrementObj(age)` 映射为 `this.$store.dispatch('incrementObj', age)`

      // store.dispatch可以处理被触发的action的处理函数返回的Promise
      // 并且store.dispatch仍旧返回Promise
      "actionA",
      "actionB"
    ])
    // ...mapMutations({
    //   // 不同名要用对象
    //   // add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    // })
  }
};
</script>