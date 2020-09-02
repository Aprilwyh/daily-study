### 写在前面（可跳过）
this指向好像总是很神秘，但是真正理解了会发现也没有那么那么的神秘。这篇博客主体思路是按照《你不知道的JavaScript》中讲解的顺序来的，学习过程中加了一些自己的思考，看了呆呆大佬的博客总结了一点心得，希望刷到这篇的你也能有一点点收获。文中如有误请路过大佬指正啦~

想要了解this先记住两句话
- **this永远指向最后调用它的那个对象**
- 对于箭头函数，它里面的this是最近一层**非箭头函数**的 this

现在有点懵没关系，下面才是开始
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
this永远指向最后调用它的那个对象
这里this指向的是全局对象，这也是**this的默认绑定**

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

默认绑定就是以上这些啦，为了方便学习下面的例子都默认**非严格模式**下运行，但是要始终记得严格模式下运行时，this默认绑定的就不是全局对象了哦！

### this的隐式绑定
**隐式绑定**是指在一个对象内部包含一个指向函数的属性，通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。隐式绑定会对this的指向产生什么影响呢？看下面的几个例子
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
这里也相当于window.obj.foo();
拿出我们的真理**this永远指向最后调用它的那个对象**，即obj啦
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
再次献出真理**this永远指向最后调用它的那个对象**，obj2。

以上隐式绑定好像也不是特别难对吧？
#### 隐式丢失
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
this永远指向最后**调用**它的那个对象，那obj.foo调用了吗？没有。它是作为一个值赋给了bar，bar还是window调用的，所以this指向的是全局。
**这也叫隐式丢失**
记住遇到隐式绑定这种间接的调用就要时刻小心是不是存在隐式丢失。

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
同上，obj.foo调用了吗？没有。它依旧是作为了一个参数传递给了doFoo，最后this还是指向了全局。

```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
var a = "global";
setTimeout(obj.foo, 100);
```
> "global"
这里的obj.foo作为回调函数也会丢失this绑定。其实说白了它也没有调用，也是作为参数传递的。结果还是同上。  
#### 隐式丢失的解决办法
1. 包装器：传递一个包装函数
```js
var obj = {
  a: 2,
  foo() {
      console.log(this.a);
  }
};
var a = "global";
setTimeout(function () {
    obj.foo()
}, 100) // 2
// setTimeout(() => obj.foo(), 100)
```
问题是在100ms内 obj 的值改变了会调用错误的对象。  
2. bind（见下节）
3. 使用类字段提供的方法
```js
class Obj {
    constructor(a) {
        this.a = a;
    }
    foo = () => {
        console.log(this.a)
    }
}
var a = "global";
let obj = new Obj(2);
setTimeout(obj.foo, 100);
```

你觉得你真的懂了吗？下面这个例子输出什么呢？
```javascript
function foo() {
  var a = 5;
  console.log(this.a);
  innerFoo();
  function innerFoo() {
    console.log(this.a);
  }
}
var a = "global";
foo();
```
> global global
两个函数都是window调用的哦，不要因为innerFoo函数在foo函数里面就以为它的执行是foo调用的。

this这样乱指是不行的，不如我们...
固定一下this的指向。
### this的显示绑定
**显示绑定**即直接指定this的绑定对象，让this只指向我们想指向的对象
使用call(...)和apply(...) // this角度讲它俩是一样的
```javascript
function foo() {
  console.log(this.a);
  return function() {
    console.log(this.a);
  }
}
var obj = {
  a: 2
};
var a = "global";
foo.call(obj); // ???
foo.call(obj)(); // ???
foo().call(obj); // ???
foo(); // ???
```
> 2; 2 global; global 2; global
看到差别了吗？使用了call直接让this指向obj，访问obj其中的属性。
哪怕foo()的调用位置是全局也不怕了。

关于**硬绑定**，啥是硬绑定？？就是你俩锁了，钥匙扔了。
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
var bar = function() {
  foo.call(obj);
};
bar(); // ???
setTimeout(bar, 100); // ???
bar.call(window); // ???
```
> 2 2 2
硬绑定的bar不会再修改this。（啊？那咋整啊？---想改咱还有软绑定，去找开锁师傅）

ES5为硬绑定提供了内置的方法
Function.prototype.bind
```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
};
var bar = foo.bind(obj);
var b = bar(3); // ???
console.log(b); // ???
```
> 2, 3; 5
bind(...)会返回一个硬编码的新函数，把指定的参数设置为this的上下文并调用原始函数。

apply、call、bind 都是可以改变 this 的指向的，区别是：
使用apply、call的函数直接执行
使用bind需要手动调用才会执行

### new绑定
```javascript
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // ???
```
> 2
使用new调用foo()时，会把构造的新对象绑定到foo()调用中的this上，这就是**new绑定**

需要注意的是<font color="red">call/apply无法和new一起使用</font>
我叛逆，我就非要它俩一起用呢！？~~请把抬扛的人抬出去~~
会报错，别试了
虽然不能var bar = new foo.call(obj);但你可以像下面这样将实例对象和call/apply一起使用
```js
function Foo (a) {
  this.a = a;
  this.foo = function () {
    console.log(this.a);
    return function () {
      console.log(this.a);
    }
  };
}
var a = "global";
var foo1 = new Foo('foo1');
var foo2 = new Foo('foo2');

foo1.foo.call(foo2)(); // ???
foo1.foo().call(foo2); // ???
```
> foo2 global; foo1 foo2;
第一个打印：利用call将this指向了foo2，即输出为foo2
第二个打印：this的默认绑定，全局下调用所以输出为global
第三个打印：this指向foo1，即输出为foo1
第四个打印：返回的函数利用call将this指向了foo2，即输出为foo2

### 优先级
熟悉了以上四种绑定可以定位到this的指向，但如果某个调用位置应用了多种绑定就需要考虑到优先级的问题。
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定
对应着的this绑定
新创建的对象、指定的对象、上下文对象、全局对象（严格模式undefined）

通过以上知识已经可以区分this的绑定了，下面是一些绑定的例外
1. 使用null来忽略this可能会使this绑定使用默认绑定规则
把null或者undefined作为this的绑定对象传给call、apply或者bind，
> 用Object.create(null)来替代null。不管如何this都会被限制在空对象中，对全局对象不会有任何影响。

2. 间接引用应用默认绑定规则，比如(p.foo = o.foo)();
> 这个赋值表达式的返回值是目标函数（即foo，假定它是个函数），因此调用的位置是foo()而不是p.foo()也不是o.foo()

### 软绑定
硬绑定是有缺点的，它会大大降低函数的灵活性，使用硬绑定之后无法使用隐式/显式绑定
如果不想这样可以使用软绑定方法实现效果（这个代码先不贴了，学习this指向要紧）

### 箭头函数
箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。
可以参考[【建议👍】再来40道this面试题酸爽继续(1.2w字用手整理)](https://juejin.im/post/5e6358256fb9a07cd80f2e70#heading-25)
大佬写的很明白我就不重复了
很强

### 总结
- 不谈箭头函数，**this永远指向最后调用它的那个对象**
- 对于箭头函数，它里面的this是最近一层**非箭头函数**的 this
- 函数别名、函数作为参数传递会发生 隐式丢失
- call(...)/apply(...)无法与new绑定一起使用、无法修改箭头函数的this
- call、apply、bind的区别：使用apply、call的函数直接执行，使用bind需要手动调用才会执行
- 影响函数调用时的this绑定行为有：默认绑定、隐式绑定（隐式丢失）、显示绑定（硬绑定）、new绑定
- 上述的优先级是：new绑定 > 显式绑定 > 隐式绑定 > 默认绑定


