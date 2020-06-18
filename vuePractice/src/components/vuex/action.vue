<script>
export default {
  template: `<div>{{ $store.state.count }}--我来自Action页面</div>`,
  data() {
    return {
      localCount: 0
    };
  },
  // Action类似于mutation，但区别如下：
  // Action提交的是mutation，而不是直接变更状态
  // Action可以包含任意异步操作

  // Action通过store.dispatch方法触发
  created() {
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
  }
};
</script>