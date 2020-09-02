## 基本语法
### what
类是一种函数。  
```js
// class 是一个函数，更确切地说，是 constructor 方法
class User {
    constructor(name) {
        this.name = name
    }
    // 方法在 User.prototype 中
    sayHi() {
        alert(this.name)
    }
}
// alert(typeof User) // function
alert(User === User.prototype.constructor) // true
// 在原型中实际上有两个方法 constructor, sayHi
let user = new User("Tom"); // 此 Tom 对应 constructor 中的形参 name
```

### how
```js
class MyClass {
  // class 方法
  constructor() { ... }
  method1() { ... }
  ...
}
```
使用 new MyClass() 来创建具有上述列出的所有方法的新对象。  
new 会自动调用 constructor() 方法，因此我们可以在 constructor() 中初始化对象。  

#### 类表达式
类似于函数表达式
```js
let User = class {
  sayHi() { // ... }
}

// 有名字的 class
// MyClass 这个名字仅在类内部可见，外部访问不到
let User = class MyClass {
  sayHi() { // ... }
}

// 动态按需创建类
function makeClass(phrase) {
  return class {
    sayHi() { // ... }
  }
}
new makeClass("Tom").sayHi()
```
#### Getters / setters
```js
class User {
  // ...
  get name() {
    return this._name
  }
  set name(value) {
    if (/* ... */) {
      // ...
      return
    }
    this._name = value;
  }
}
```
#### Computed names [...]
```js
class User {
  // 即 sayHi()
  ['say' + 'Hi']() {
    // ...
  }
}
```
#### class 字段
```js
class User {
  name = "Tom"
}
let user = new User()
alert(user.name) // Tom
alert(User.prototype.name) // undefined 不会设置到原型上
```
间接调用导致的 this 隐式丢失问题
```js
class Button {
  constructor(value) {
    this.value = value;
  }

  click() {
    alert(this.value);
  }
}
let button = new Button("hello");
setTimeout(button.click, 100); // undefined
```
具体解决方案见【this篇】，下面介绍 类字段 方法解决
```js
class Button {
  constructor(value) {
    this.value = value;
  }
  click = () => {
    alert(this.value);
  }
}
let button = new Button("hello");
setTimeout(button.click, 100);
```
用途：浏览器环境中，它对于进行事件监听尤为有用。

### why
1. **Class 与 构造函数的区别？**
```js
// 纯函数重写 class
// 1. 创建构造器函数
function User(name) {
    this.name = name
}
// 函数的原型（prototype）默认具有 "constructor" 属性
// 2. 将方法添加到原型
User.prototype.sayHi = function () {
    alert(this.name)
}
let user = new User("Tom")
user.sayHi()
```
这个定义的结果与使用上述类得到的结果基本相同。但又有很大差异  
- 通过 class 创建的函数具有特殊的内部属性标记 \[\[FunctionKind]]:"classConstructor"。因此，它与手动创建并不完全相同。
- 大多数 JavaScript 引擎中的类构造器的字符串表示形式都以 “class…” 开头
- 类方法不可枚举。 类定义将 "prototype" 中的所有方法的 enumerable 标志设置为 false。
- 类总是使用 use strict。 在类构造中的所有代码都将自动进入严格模式。

***
## 继承
### what
类继承是一个类扩展另一个类的一种方式。
#### extends 关键字
```js
class Animal {
  pubFunc() {
    // ...
  }
}
class Rabbit extends Animal {
  ownFunc() {
    // ...
  }
}
let rabbit = new Rabbit();
rabbit.ownFunc();
rabbit.pubFunc(); // 来自继承
```
在内部关键字 `extends` 使用了很好的旧的原型机制进行工作。它将 Rabbit.prototype.\[\[Prototype]] 设置为 Animal.prototype。整个过程为
1. 查找对象 rabbit （没有pubFunc）
2. 查找它的原型，即 Rabbit.prototype （有 ownFunc 但没有 pubFunc）
3. 继续向上查找原型，即 Animal.prototype （找到 pubFunc）

extends 可以后接表达式 `class User extends f('Tom') {}`

#### super关键字 重写
1. 重写方法
Rabbit 和 Animal 中均有一个方法时，我们不希望完全替换父类的方法，而是希望在父类方法的基础上进行调整或扩展其功能。  
`super关键字`
- `super.method(...)` 调用一个父类方法
- `super(...)` 调用一个父类 constructor
现在 super.ownFunc() 调用的就是父类中的 ownFunc 方法，this.ownFunc() 调用的就是子类中的 ownFunc 方法

需要注意的是箭头函数没有 this，它也没有 super。和获取 this 一样，super也会从外部函数获取。

2. 重写 constructor
没有自己 constructor 的子类，在已继承的情况下，会调用父类的 constructor，并传递所有的参数。
```js
class Rabbit extends Animal {
  // 为没有自己的 constructor 的扩展类生成的
  constructor(...args) {
    super(...args);
  }
}
```
继承类的 constructor 必须调用 super(...)，并且一定要在使用 this 之前调用。

3. 重写类字段

### why
1. class 继承和原型继承的差别？
   - getPrototypeOf 结果不同  
类继承中子类会 \[\[Prototype]] 链接到父类，原型继承中的构造函数都是通过 prototype 指向的原型对象相互联系的。一般在原型继承中，子构造函数的原型对象是父构造函数，或者子构造函数的原型对象 \[\[Prototype]] 链接到父构造函数的原型对象。
   - this 创造顺序不同  
ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承先将父类实例对象的属性，加到this上面（所以必须先调用super方法），然后再在子类中修改this。
   - 子类实例的构建，基于父类实例，只有super方法才能调用父类实例。

2. 我们知道所有的对象通常都继承自 Object.prototype，"class Rabbit extends Object" 和 class Rabbit 的差异？

| class Rabbit | class Rabbit extends Object |
| - | - |
| – |	needs to call super() in constructor |
| Rabbit.__proto__ === Function.prototype |	Rabbit.__proto__ === Object |
***
## 静态属性和方法
### what
把一个方法赋值给类的函数本身，而不是赋给它的 "prototype"。这样的方法被称为 静态的（static）。
#### static 关键字
```js
class User {
  static publisher = "Tom";
  static staticMethod() {
    // ...
  }
}
```
以上代码等同于
```js
class User {}
User.publisher = "Tom";
User.staticMethod = function() {
  // ...
}
```
用途：静态方法用于实现属于该类但不属于该类任何特定对象的函数。  
也被用于与数据库相关的公共类，可以用于搜索/保存/删除数据库中的条目  

## 大总结
- `extends` 语法会设置两个原型：
   1. 在构造函数的 "prototype" 之间设置原型（为了获取实例方法）。
   2. 在构造函数之间会设置原型（为了获取静态方法）。
- 扩展一个类 class Child extends Parent（即 Child.prototype.\_\_proto__ 是 Parent.prototype）
- 箭头函数没有 this，也没有 super
- super.method(...) 调用一个父类方法
- super(...) 调用一个父类 constructor
- 继承对常规方法和静态方法都有效

