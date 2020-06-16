<script>
import { mapMutations } from "vuex";
export default {
  template: `<div>{{$store.state.count}}<br>
  {{$store.state.color}}<br>
  {{$store.state.name}}<br>
  {{$store.state.age}}<br>
  我来自mutation.vue文件</div>`,
  // 更改Vuex的store中的状态（state）唯一的方式是提交mutation
  // mutation类似于事件，每个mutation都有一个字符串的事件类型和一个回调函数（状态更改的地方）
  // 不能直接调用mutation，要以相应的type调用store.commit方法
  // 以上都是官网上的概念，看起来好多，直接看代码吧(本节结合main.js中的mutation一起看)
  /*     created() {
      this.$store.commit("increment"); // 执行此句$store.state.count为2，执行前为1

      // 提交载荷（载荷是啥？是你向store.commit传入额外的参数，payload的第二个参数）
      this.$store.commit("payload", "blue"); // 载荷就是这个 "blue"咯（payload没有定义第二个参数传入载荷也不会报错）
      // 在大多数情况下载荷应该是一个对象啦，这样可以包含多个字段并且记录的 mutation 会更易读
      this.$store.commit("payloadObj", {
        friend: "Jerry"
      }); // 虽然mutation中payload不定义第二个参数也不报错，但定义了这里却不传就会报错哦

      // 对象风格的提交方式
      this.$store.commit({
        type: "incrementObj", // 提交mutation的另种方式是直接使用包含type属性的对象，整个对象都作为载荷传给 mutation 函数
        age: 18
      }); // 其实和上面差不多，就是把参数一转成type属性而已
    }, */

  created() {
    this.increment(); // 得调用方法，不然执行不了哦
    this.incrementObj({ age: 1 }); // 记得传入载荷哦~
  },
  // 来了来了它来了，我们熟悉的辅助函数！除了mapState，mapGetters我们还引进了mapMutations
  methods: {
    ...mapMutations([
      // 同名用数组
      "increment", // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      // `mapMutations` 也支持载荷
      "incrementObj" // 将 `this.incrementObj(age)` 映射为 `this.$store.commit('incrementObj', age)`
    ])
    // ...mapMutations({ // 不同名要用对象
    //   add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    // })
  }
};
</script>