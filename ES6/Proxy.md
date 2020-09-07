## what
一个 Proxy 对象包装另一个对象并拦截诸如读取/写入属性和其他操作，可以选择自行处理它们，或者透明地允许该对象处理它们。
### 语法
```js
let proxy = new Proxy(target, handler)
```
- target — 是要包装的对象，可以是任何东西，包括函数。
- handler — 代理配置：带有“陷阱”（“traps”，即拦截操作的方法）的对象。比如 get 陷阱用于读取 target 的属性，set 陷阱用于写入 target 的属性，等等。  

如果没有陷阱，所有对 proxy 的操作都直接转发给了 target。proxy 是一个 target 的透明包装器（wrapper）.
```js
let target = {};
let proxy = new Proxy(target, {}); // 空的 handler 对象

proxy.test = 5; // 写入 proxy 对象
alert(target.test); // 5，test 属性出现在了 target 中
alert(proxy.test); // 5，也可以从 proxy 对象读取它
```

### get
最常见的陷阱是用于读取/写入的属性。要拦截读取操作，handler 应该有 get(target, property, receiver) 方法。
- target — 是目标对象，该对象被作为第一个参数传递给 new Proxy，
- property — 目标属性名，
- receiver — 如果目标属性是一个 getter 访问器属性，则 receiver 就是本次读取属性所在的 this 对象。通常，这就是 proxy 对象本身（或者，如果我们从 proxy 继承，则是从该 proxy 继承的对象）。现
