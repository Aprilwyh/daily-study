<template>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
      <!-- 为每个todo准备一个插槽，将todo对象作为一个插槽的prop传入 -->
      <slot v-bind:parentTodo="todo" name="todoName">
        <!-- 后备内容 -->
        {{ todo.text }}
      </slot>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      filteredTodos: [
        { id: 1, text: "文本1" },
        { id: 2, text: "文本2" },
        { id: 3, text: "文本3" }
      ]
    };
  }
};
</script>