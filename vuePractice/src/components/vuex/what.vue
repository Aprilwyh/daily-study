<template>
  <!-- view 以声明方式将state映射到视图 -->
  <div>
    {{ count }}
    <my-state></my-state>
    <hr />
    <my-getter></my-getter>
    <hr />
    <my-mutation></my-mutation>
  </div>
</template>
<script>
import state from "./state";
import getter from "./getter";
import mutation from "./mutation";
export default {
  // state 驱动应用的数据源
  data() {
    return {
      count: 0
    };
  },
  created() {
    this.increment(); // 得调用这个方法才能读到store
  },
  // actions 响应在view上的用户输入导致的状态变化
  methods: {
    increment() {
      // this.count++;
      // 使用Vuex
      this.$store.commit("increment");
      this.count = this.$store.state.count + "--我来自what.vue文件";
    }
  },
  components: {
    "my-state": state,
    "my-getter": getter,
    "my-mutation": mutation
  }
};
</script>