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
调用位置是否有上下文
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
var bar = obj.foo;
var a = "global";
bar(); // ???
```
> "global"
bar的调用位置：全局。this指向全局

```javascript
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
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
doFoo的调用位置：全局。this指向全局









```javascript

```
```javascript

```
```javascript

```

