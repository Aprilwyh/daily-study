<script>
import { mapState } from "vuex";
export default {
  template: `<div>{{ count }}--{{ color }}--{{ name }}--我来自state.vue文件</div>`,
  data() {
    return {
      localName: "Jerry"
    };
  },
  // 最最基本的写法
  /* computed: {
    count() {
      return this.$store.state.count;
    },
    color() {
      return this.$store.state.color;
    }
    // 太麻烦了是吧，所以要用mapState辅助函数。这个函数需要局部导入哦
  } */

  // 升级为VIP的写法
  /* computed: mapState(
    {
      count: state => state.count,
      // color: state => state.color // 这样的写法或许还是不够好，试试下面这种
      color: "color", // // 传字符串参数 'color' 等同于 `state => state.color`,哇太简单了

      // 或许你还有本地变量需要一起使用，之前一直是this取值，现在不可以了，本地变量会undefined哦
      // name: state => state.name + this.localName
      // 为了能够使用 `this` 获取局部状态，必须使用常规函数
      name(state) {
        return state.name + this.localName;
      }
    }
    // 当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组
    // ["count", "color", "name"]
  ) */

  // 升级为SVIP的写法
  // mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？ 对象展开运算符哦！！ES6范围的啦
  computed: {
    name() {
      return this.localName; // 使用自己本地的变量
    },
    // 使用对象展开运算符将此对象混入到外部对象中（本地变量 + state的变量）
    ...mapState(["count", "color"])
  }
};
</script>