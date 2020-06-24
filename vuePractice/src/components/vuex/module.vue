<script>
// import { store } from "./store/index";
export default {
  template: `<div>
  {{ $store.state.a.count }}<br>
  {{ getCount }}<br>
  {{ getAllCount }}<br>
  我来自module页面</div>`,
  created() {
    // this.$store.commit("incrementMu");
    // this.$store.dispatch("incrementIfOddOnRootSum");

    // a模块使用了namespaced: true,之后的写法
    this.$store.commit("a/incrementMu");
    this.$store.dispatch("a/incrementIfOddOnRootSum");
  },
  computed: {
    getCount() {
      // return this.$store.getters.doubleCount;
      return this.$store.getters["a/doubleCount"]; // a模块使用了namespaced: true,之后的写法
    },
    getAllCount() {
      return this.$store.getters.sumWithRootCount;
    }
  }
};
</script>