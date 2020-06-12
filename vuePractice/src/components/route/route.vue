<template>
  <div id="route">
    <!-- 使用 router-link 组件来导航. -->
    <router-link to="/foo">go to foo</router-link>
    <router-link to="/bar">go to bar</router-link>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>
<script>
/* import Vue from "vue";
import Router from "vue-router";
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义 (路由) 组件。
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };
// 2. 定义路由
const routes = [
  { path: "/foo", component: Foo },
  { path: "/bar", component: Bar }
];
// 3. 创建 router 实例，然后传 `routes` 配置

// 4. 创建和挂载根实例。通过 router 配置参数注入路由，从而让整个应用都有路由功能 */
</script>
