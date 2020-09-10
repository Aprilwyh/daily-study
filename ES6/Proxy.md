## what
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。
### 语法
```js
let proxy = new Proxy(target, handler)
```
- target — 是要包装的对象，可以是任何东西，包括函数。
- handler — 代理配置：带有“陷阱”（“traps”，即拦截操作的方法）的对象。比如 get 陷阱用于读取 target 的属性，set 陷阱用于写入 target 的属性，等等。  

### handler没有设置任何拦截等同于直接通向原对象(target)
如果没有陷阱，所有对 proxy 的操作都直接转发给了 target。proxy 是一个 target 的透明包装器（wrapper）.
```js
let target = {};
let proxy = new Proxy(target, {}); // 空的 handler 对象

proxy.test = 5; // 写入 proxy 对象
alert(target.test); // 5，test 属性出现在了 target 中
alert(proxy.test); // 5，也可以从 proxy 对象读取它
```
### Proxy 实例也可以作为其他对象的原型对象
```js
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```
proxy对象是obj对象的原型，obj对象本身并没有time属性，根据原型链，会在proxy对象上读取该属性，导致被拦截。

### 同一个拦截器函数，可以设置拦截多个操作
```js
var handler = {
  get: function(target, name) {
    // ...
  },

  apply: function(target, thisBinding, args) {
    // ...
  },

  construct: function(target, args) {
    // ...
  }
};
var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);
```
### 属性不可配置（configurable）且不可写（writable），Proxy 不能修改该属性
通过 Proxy 对象访问该属性会报错。

### Proxy 拦截方法
最常见的是用于读取/写入的属性。
#### get()
get方法用于拦截某个属性的读取操作, get(target, property, receiver) 方法。
- target — 是目标对象，该对象被作为第一个参数传递给 new Proxy，
- property — 目标属性名，
- receiver — 如果目标属性是一个 getter 访问器属性，则 receiver 就是本次读取属性所在的 this 对象。通常，这就是 proxy 对象本身（或者，如果我们从 proxy 继承，则是从该 proxy 继承的对象）。

##### 关于 get() 的第三个参数 receiver
它总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例。
```js
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
```
proxy对象的getReceiver属性是由proxy对象提供的，所以receiver指向proxy对象。
```js
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});

const d = Object.create(proxy);
d.a === d // true
```
d对象本身没有a属性，所以读取d.a的时候，会去d的原型proxy对象找。这时，receiver就指向d，代表原始的读操作所在的那个对象。

##### 使用场景
- get方法可以继承
- 数组读取负数的索引
- 可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作
- 利用get拦截，实现生成各种 DOM 节点的通用函数
- ...


#### set()
set方法用来拦截某个属性的赋值操作，可以接受四个参数
set(target, property, value, receiver)：
- target — 是目标对象，该对象被作为第一个参数传递给 new Proxy，
- property — 目标属性名称，
- value — 目标属性的值，
- receiver — 与 get 陷阱类似，仅与 setter 访问器属性相关。
如果写入操作（setting）成功，set 陷阱应该返回 true，否则返回 false（触发 TypeError）。

##### 关于 set() 的第四个参数 receiver
```js
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
proxy.foo === proxy // true
```
receiver 指的是原始的操作行为所在的那个对象，一般情况下是proxy实例本身
```js
const handler = {
    set: function(obj, prop, value, receiver) {
        obj[prop] = receiver;
    }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);
myObj.foo = 'bar';
myObj.foo === myObj // true
```
设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。  
myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。  
这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。


##### 使用场景
- 数据验证，使用Proxy保证属性值符合要求。
- 数据绑定，即每当对象发生变化时，会自动更新 DOM。
- 防止内部属性被外部读写（get/set 结合）



#### 包装函数 apply()
apply(target, thisArg, args) 拦截函数的调用、call和apply操作。
- target 是目标对象（在 JavaScript 中，函数就是一个对象）
- thisArg 是目标对象的上下文对象（this）
- args 是目标对象的参数列表
```js
var target = function () { return 'I am the target'; };
var handler = {
  apply: function () {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);
p()
// "I am the proxy"
```

#### has()
has方法判断对象是否具有某个属性。典型的操作就是in运算符。  
has(target, property)
target — 是目标对象，被作为第一个参数传递给 new Proxy，
property — 需查询的属性名称

##### 使用场景
- 使用has方法隐藏某些属性，不被in运算符发现

##### 注意事项
- 如果原对象不可配置或者禁止扩展，这时has拦截会报错。
- has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。
- 虽然for...in循环也用到了in运算符，但是has拦截对for...in循环不生效（只对in运算符生效）。

#### construct()
用于拦截new命令

#### 更多见 ES6 教程

### Proxy.revocable()
Proxy.revocable()方法返回一个可取消的 Proxy 实例。
```js
let target = {};
let handler = {};
let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
Proxy.revocable()方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。  
当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。

#### 使用场景
目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

### this
在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理（而不是target）。
```js
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false
proxy.m()  // true
```
一旦proxy代理target.m，后者内部的this就是指向proxy，而不是target。  
有些原生对象的内部属性，只有通过正确的this才能拿到，Proxy 无法代理这些原生对象的属性。
```js
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);
proxy.getDate(); // TypeError: this is not a Date object.
```
解决办法：this 绑定原始对象
```js
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);
proxy.getDate() // 1
```

## why
1. let proxy = new Proxy({}, { ... }) 中的 target 设为 {} 代表什么意思？
target 作为第一个参数代表的是所要代理的目标对象，即如果没有Proxy的介入，操作原来要访问的就是这个对象。  
要使得Proxy起作用，必须针对Proxy实例（proxy对象）进行操作，而不是针对目标对象（空对象{}）进行操作。

## more
使用场景代码见 ES6教程