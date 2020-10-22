1. 当数据发生变化时，vue是怎么更新节点的？
我们修改了某个数据，如果直接渲染到真实dom上会引起整个dom树的重绘和重排，通过**diff算法**只更新我们修改的那一小块dom而不要更新整个dom。  
我们先根据真实DOM生成一棵virtual DOM，当virtual DOM某个节点的数据改变后会生成一个新的Vnode，然后Vnode和oldVnode作对比，发现有不一样的地方就直接修改在真实的DOM上，然后使oldVnode的值为Vnode。  
diff的过程就是调用名为patch的函数，比较新旧节点，一边比较一边给真实的DOM打补丁。

2. virtual DOM和真实DOM的区别？
真实DOM
```html
<div>
    <p>123</p>
</div>
```
VDOM（是一个对象）
```js
// 伪代码
var Vnode = {
    tag: 'div',
    children: [
        { tag: 'p', text: '123' }
    ]
};
```

3. diff的比较方式？
采取diff算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较。

## Diff 流程
当数据发生改变时，set方法会让调用Dep.notify通知所有订阅者Watcher，订阅者就会调用patch给真实的DOM打补丁，更新相应的视图。（见图diff算法）
1. 情况一：如果老节点属性的里边有 新的节点属性没有 就删除这个属性
```js
// newVnode 新的虚拟节点 oldProps 老虚拟结点上的所有属性
function updateProperties(newVnode, oldProps = {}) {
    let domElement = newVnode.domElement; // 拿到真实 dom element
    let newProps = newVnode.props; // 当前虚拟节点中的属性 (props:{id:'wrapper',a:1})
    // 如果老节点属性的里边有 新的节点属性没有 就删除这个属性
    for (let oldPropName in oldProps) {
        if (!newProps[oldPropName]) {
            delete domElement[oldPropName];
        }
    }
}
```
2. 情况二：如果新老 style 节点出现不一样的情况
```js
function updateProperties(newVnode, oldProps = {}) {
    // 老的有, 新的没有, 就将老的设置为 ''
    // 老的有，新的没有，就将老的设置为 ''
    let newStyleObj = newProps.style || {};
    let oldStyleObj = oldProps.style || {};
    for (let oldStyleName in oldStyleObj) {
        if (!newStyleObj[oldStyleName]) {
            domElement.style[oldStyleName] = "";
        }
    }
    // 如果老节点的属性没有，新结点属性有，则节点属性值覆盖老节点属性值
    for (let newPropName in newProps) {
        // 特殊属性处理 => style:{color:'red'} 等
        // 老的没有，新的有，将其添加
        if (newPropName == "style") {
            let styleObj = newProps.style;
            for (let s in styleObj) {
                domElement.style[s] = styleObj[s];
            }
        } else {
            domElement[newPropName] = newProps[newPropName];
        }
    }
}
```

## patch 过程
patch 的核心就是 diff 算法，diff 算法主要用来对比两棵新老虚拟 DOM 树的差异，然后将对比后的差异更新到视图上，完成一次视图的更新。  
```js
function patch (oldVnode, vnode) {
    // some code
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode)
    } else {
        const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
        let parentEle = api.parentNode(oEl)  // 父元素
        createEle(vnode)  // 根据Vnode生成新元素
        if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
        }
    }
    // some code 
    return vnode
}
```
patch函数接收两个参数oldVnode和Vnode分别代表新的节点和之前的旧节点
- 判断两节点是否值得比较，值得比较则执行patchVnode
```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&  // key值
    a.tag === b.tag &&  // 标签名
    a.isComment === b.isComment &&  // 是否为注释节点
    // 是否都定义了data，data包含一些具体信息，例如onclick , style
    isDef(a.data) === isDef(b.data) &&  
    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
  )
}
```
- 不值得比较则用Vnode替换oldVnode
如果两个节点都是一样的，那么就深入检查他们的子节点。（patchVnode）
```js
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        }else if (ch){
            createEle(vnode) //create el's children dom
        }else if (oldCh){
            api.removeChildren(el)
        }
    }
}
```
- 找到对应的真实 dom ，称为 el
- 判断 Vnode 和 oldVnode 是否指向同一个对象，如果是，那么直接 return
- 如果他们都有文本节点并且不相等，那么将 el 的文本节点设置为 Vnode 的文本节点。
- 如果 oldVnode 有子节点而 Vnode 没有，则删除 el 的子节点
- 如果 oldVnode 没有子节点而 Vnode 有，则将 Vnode 的子节点真实化之后添加到 el
- 如果两者都有子节点，则执行 updateChildren 函数比较子节点，这一步很重要

### updateChildren
这个函数做了什么  
- 将 Vnode 的子节点 Vch 和 oldVnode 的子节点 oldCh 提取出来
- oldCh 和 vCh 各有两个头尾的变量 StartIdx 和 EndIdx，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了 key，就会用 key 进行比较，在比较的过程中，变量会往中间靠，一旦 StartIdx > EndIdx 表明 oldCh 和 vCh 至少有一个已经遍历完了，就会结束比较。

## 链
[](https://www.cnblogs.com/wind-lanyan/p/9061684.html)
[](https://segmentfault.com/a/1190000008782928)