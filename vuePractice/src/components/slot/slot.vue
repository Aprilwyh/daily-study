<template>
  <div class="container">
    <v-header>展示的内容</v-header>
    <v-footer></v-footer>
    <hr />具名插槽
    <v-container>
      <template v-slot:header>
        <h1>Here might be a page title</h1>
      </template>

      <template v-slot:default>
        <p>A paragraph for the main content.</p>
        <p>And another one.</p>
      </template>

      <template v-slot:footer>
        <p>Here's some contact info</p>
      </template>
    </v-container>
    <hr />其他示例
    <v-other>
      <!-- 解构写法 -->
      <template v-slot:todoName="{ parentTodo }">{{ parentTodo.text }}</template>
      <!-- 原始写法 -->
      <!-- <template v-slot:todoName="suibian">{{ suibian.parentTodo.text }}</template> -->
    </v-other>其他示例路由版
    <router-link to="/slot/other">其他示例</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
import header from "./header.vue";
import footer from "./footer.vue";
import container from "./container.vue";
import other from "./other.vue";
export default {
  data() {
    return {};
  },
  components: {
    "v-header": header,
    "v-footer": footer,
    "v-container": container,
    "v-other": other
  }
};
</script>
<style scoped>
</style>