【百行代码之全面解析this】
调用位置、调用栈
this的默认绑定、隐式绑定、显式绑定
装箱：原始值当作this的绑定对象会被转换成它的对象形式
call(..)
apply(..)
this绑定角度讲两个方法相同


### 理解调用位置，分析调用栈
```javascript
function baz() {
  // 当前调用栈: baz
  console.log("baz");
  bar(); // bar的调用位置(baz中)
}
function bar() {
  // 当前调用栈: baz -> bar
  console.log("bar");
  foo(); // foo的调用位置(bar中)
}
function foo() {
  // 当前调用栈: baz -> bar -> foo
  console.log("foo");
}
baz(); // baz的调用位置(全局)
```
> 可以把调用栈想象成一个函数调用链
理解这两个概念，对接下来的学习很重要哦

### this的默认绑定
独立函数调用
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // ???
```
> 2
foo的调用位置：全局。this指向全局对象**这就是this的默认绑定**

使用严格模式
```javascript
function foo() {
  "use strict";
  console.log(this.a);
}
var a = 2;
foo(); // ???
```
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
(function() {
  "use strict";
  foo(); // ???
})();
```
> 报错； 2
foo()在严格模式下运行，默认绑定无法绑定到全局对象
foo()在严格模式下调用，不影响默认绑定

### this的隐式绑定
要看调用位置是否有上下文。**隐式绑定**是指在一个对象内部包含一个指向函数的属性，通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。隐式绑定会对this的指向产生什么影响呢？看下面的几个例子
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // ???
```
> 2
foo的调用位置：obj中。this指向obj

```javascript
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo
};
var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo(); // ???
```
> 42
foo的调用位置：obj2中。this指向obj2

以上隐式绑定好像也不是特别难对吧？
那我们来引入一个**隐式丢失**概念
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var bar = obj.foo; // * 【函数别名】
var a = "global";
bar(); // ???
```
> "global"
看起来似乎是bar -> obj -> foo，this应该指向obj。但是
实际上bar引用的是foo函数本身，bar指向了一个函数的别名（obj.foo，即foo）
bar的调用位置：全局。this指向全局
**这就是隐式丢失**

```javascript
function foo() {
  console.log(this.a);
}
function doFoo(fn) { // *【参数传递】
  fn();
}
var obj = {
  a: 2,
  foo: foo
};
var a = "global";
doFoo(obj.foo); // ???
```
> "global"
看起来似乎是doFoo -> obj -> foo，this应该指向obj。但是
实际上参数传递其实是一种隐式赋值，doFoo还是直接调用了foo
doFoo的调用位置：全局。this指向全局（同上）

```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var a = "global";
setTimeOut(obj.foo, 100);
```
> "global"
回调函数丢失this绑定
bar的调用位置：全局。this指向全局（同上）

综上，间接引用函数可能会产生意想不到的结果，那怎么办呢？
让我们用显示绑定固定this来修复。

### this的显示绑定
**显示绑定**即直接指定this的绑定对象，让this只指向我们想指向的对象
使用call(...)和apply(...)
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
var a = "global";
foo.call(obj); // ???
foo(); // ???
```
> 2 "global"
看到差别了吗？使用了call直接让this指向obj，访问obj其中的属性。
哪怕foo()的调用位置是全局也不怕了。

关于**硬绑定**







```javascript

```
```javascript

```
```javascript

```

