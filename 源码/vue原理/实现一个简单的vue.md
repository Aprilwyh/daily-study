核心功能：虚拟结点、模板编译、diff算法、patch过程等。  
一个简易的 Vue首先将模板语法转化为虚拟结点，然后将虚拟结点和真实数据进行结合，完成一次视图渲染。  
但是当我们再次进行改变数据时，我们会触发 Dep 中的 Watcher 对象，然后对象调用 updata 进行视图的更新，在更新视图前，我们需要对比新老虚拟节点，也就是 patch 的过程，将新老虚拟节点的差异对比后得到更新后的虚拟结点，然后更新到视图上。
## 渲染函数 & JSX
```js
// 渲染函数来创建 —— 来自 vue 官网的例子
Vue.component('anchored-heading', {
    render: function (createElement) {
        return createElement('h1', this.blogTitle)
    }
})
```
render 函数有一个返回值，这个返回值调用了 createElement 将创建标签的语法传进去，返回的值其实就是一个虚拟 DOM 。

## 虚拟DOM
虚拟 DOM 就是一个 javaScript 对象，用来创建描述真实 DOM 的信息。
```js
// 真实 DOM
<div>
    <span>HelloWord</span>
</div>
// 虚拟 DOM —— 以上的真实 DOM 被虚拟 DOM 表示如下：
{
    children:(1) [{…}] // 子元素
    domElement: div // 对应的真实 dom
    key: undefined // key 值
    props: {} // 标签对应的属性
    text: undefined // 文本内容
    type: "div" // 节点类型
    ...
}
```
虚拟 DOM 树中有动态变化的变量节点（我们把 data 挂载到 dom 也看做是一个节点），我们更改变量时，虚拟 DOM 树就会更新，同时映射的真实 DOM 也进行更新。

## 转化为 VNode
Vue 通过建立一个虚拟 DOM 来追踪自己要如何改变真实 DOM。  
createElement 函数返回的就是一个虚拟节点，这包含的信息就是告诉 Vue 页面需要渲染什么样子的节点，包括子节点的信息，我们称这个的节点为“虚拟节点（Virtual Node 简称 VNode）”。整个 createElement 的过程就是将用户传入的想创建标签信息转化为VNode。

## 渲染VDOM
遍历解析 VNode 对象中的属性，根据不同的属性值做不同的操作。解析到 type:div ，就创建一个真实的 div DOM 元素，遇到props ，通过setAttrbution 将属性添加到对应的标签属性中。  
拿到虚拟 节点之后，将其渲染到真实 DOM 上