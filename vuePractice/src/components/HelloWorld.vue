<template>
  <div class="hello">
    <div>
      <!-- <my-slot></my-slot> -->
      <router-link to="/slot">插槽部分</router-link>
      <!-- <my-render></my-render> -->
      <router-link to="/render">渲染函数部分</router-link>
      <br />==路由部分==
      <my-route></my-route>
      <router-link to="vuex">vuex部分</router-link>
    </div>
  </div>
</template>

<script>
import slot from "./slot/slot.vue";
import render from "./render/render";
import route from "./route/route";
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  components: {
    "my-slot": slot,
    "my-render": render,
    "my-route": route
  }
};
</script>

<style scoped>
</style>
