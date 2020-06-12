<template>
  <div>
    <anchored-heading :level="1">Hello world!</anchored-heading>
    <anchored-heading :level="2">Hello world!</anchored-heading>
    <!-- createElement的第一个参数 -->
    <createElement-first></createElement-first>
    <!-- createElement的第二个参数 -->
    <createElement-second></createElement-second>
    <!-- createElement的第三个参数 -->
    <createElement-third></createElement-third>
    <!-- 使用js代替模板功能 -->
    使用js代替模板功能 v-if / v-for / v-model
    <div style="display: flex; justify-content: space-between;">
      <div>
        <span>v-if/v-for template写法</span>
        <ul v-if="items.length">
          <li v-for="item in this.items" :key="item.index">{{ item }}</li>
        </ul>
        <p v-else>No items</p>
      </div>
      <div>
        <span>v-if/v-for createElement写法</span>
        <item-list :componentItems="items"></item-list>
      </div>
      <div>
        <span>v-model template写法</span>
        <input v-model="inputVal" />
        <p>{{inputVal}}</p>
      </div>
      <!-- v-model createElement写法 -->
      <input-model :value="inputVal" @input="val => inputVal = val"></input-model>
    </div>使用js代替模板功能 插槽
    <slot-default></slot-default>
    <!-- 使用$scopedSlots访问作用域插槽 -->
    <!-- <scoped-slot></scoped-slot> -->
    <!-- 函数式组件 -->
    <functional-heading :level="1">functional</functional-heading>
    <functional-heading :level="2">functional</functional-heading>
    <smart-list :smart="smart" style="color: red;">111</smart-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: ["1", "2", "3"],
      inputVal: "",
      msg: "使用$scopedSlots访问作用域插槽",
      smart: 1
    };
  },
  components: {
    "anchored-heading": {
      // 渲染函数创建h标签
      render: function(createElement) {
        // 不使用 slot 属性向组件中传递内容时,这些子元素被存储在组件实例中的 $slots.default中
        // 即指文本内容“Hello world!”，没有this.$slots.default就没有内容展示出来
        return createElement("h" + this.level, this.$slots.default);
      },
      props: {
        level: {
          type: Number,
          required: true
        }
      }
    },
    "createElement-first": {
      // 必填，参数有三种类型：String/Object/Function
      // 是一个简单的HTML标签字符

      /* // 字符串 String
      render: function(createElement) {
        return createElement("div"); // 渲染出一个div元素
      } */
      /* // Object
      render: function(createElement) {
        return createElement({
          template: `<div>Object</div>` // 按照模板内容渲染
        });
      } */
      // Function
      render: function(createElement) {
        var eleFun = function() {
          return {
            template: `<div>Function</div>`
          };
        };
        return createElement(eleFun()); // 渲染函数中返回的对象
      }
    },
    "createElement-second": {
      // 可选参数，此参数是一个Object
      // 是一个包含模板相关属性的数据对象
      render: function(createElement) {
        return createElement("div", {
          class: {},
          style: {
            color: "green",
            fontSize: "14px"
          },
          attr: {
            id: "boo"
          },
          domProps: {
            innerHTML: "second-params"
          }
        });
      }
    },
    "createElement-third": {
      // 可选参数，参数类型 String或 Array
      // 是传了多个子元素的一个数组
      render: function(createElement) {
        return createElement("div", [
          createElement("h1", "hello Vue"),
          createElement("p", "render渲染函数")
        ]);
      }
    },
    "item-list": {
      props: ["componentItems"],
      render: function(h) {
        if (this.componentItems.length) {
          return h(
            "ul",
            this.componentItems.map(item => {
              return h("li", item);
            })
          );
        } else {
          return h("p", "No items");
        }
      }
    },
    "input-model": {
      props: {
        value: String
      },
      render: function(h) {
        var that = this;
        return h("div", [
          h("span", {
            domProps: {
              // dom属性
              innerHTML: "v-model createElement写法"
            }
          }),
          h("input", {
            domProps: {
              value: that.value
            },
            on: {
              input: function(event) {
                that.$emit("input", event.target.value);
              }
            }
          }),
          h("p", {
            domProps: {
              innerHTML: that.value
            }
          })
        ]);
      }
    },
    "slot-default": {
      render: function(h) {
        // `<div><slot></slot></div>`
        return h("div", this.$slots.default);
      }
    },
    "scoped-slot": {
      /* props: ["message"],
      render: function(h) {
        // `<div><slot :text="message"></slot></div>`
        return h("div", [
          this.$scopedSlots.default({
            text: this.message
          })
        ]);
      } */
      /* render: function(h) {
        // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
        return h("div", [
          h("child", {
            // 在数据对象中传递 `scopedSlots`
            // 格式为 { name: props => VNode | Array<VNode> }
            scopedSlots: {
              default: function(props) {
                return h("span", props.text);
              }
            }
          })
        ]);
      } */
      /* // child组件
      child: {
        render: function(h) {
          return h(
            "strong",
            this.$scopedSlots.default({
              text: "child component"
            })
          );
        }
      } */
    },
    "functional-heading": {
      functional: true,
      props: {
        level: {
          type: Number,
          required: true
        }
      },
      render: function(h, context) {
        // context.children指的是上例中的this.$slots.default，用于显示<组件名>中间的内容</组件名>
        return h("h" + context.props.level, context.children);
      }
    },
    "smart-list": {
      // 根据props展示不同组件
      functional: true,
      props: ["smart"],
      render: function(h, context) {
        function smart() {
          var smart = context.props.smart;
          switch (smart) {
            case 1:
              return "h1";
            case 2:
              return "h2";
          }
        }
        // context.data--传递标签上的style，context.children--传递标签中的内容
        return h(smart(), context.data, context.children);
      }
    }
  }
};
</script>