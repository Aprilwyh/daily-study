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
alert(User === User.prototype.constructor) // true （constructor属性直接指向“类”的本身）
// 在原型中实际上有两个方法 constructor, sayHi
let user = new User('Tom') // 此 Tom 对应 constructor 中的形参 name
```

- new 会自动调用 constructor() 方法，因此我们可以在 constructor() 中初始化对象
- constructor 方法默认返回实例对象（即 this）
- 类的内部所有定义的方法，都是不可枚举的。

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

// 还可以写出立即执行的 Class
let person = new class {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}('张三');
person.sayName(); // "张三"
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

#### this 指向

类的方法内部的 this 默认指向类的实例，间接调用导致的 this 隐式丢失问题

```js
class Button {
  constructor(value) {
    this.value = value
  }

  click() {
    alert(this.value)
  }
}
let button = new Button('hello')
setTimeout(button.click, 100) // undefined
```

1. 构造方法中绑定 this

```js
class Button {
  constructor(value) {
    this.value = value
    this.click = this.click.bind(this) // *
  }
  click() {
    alert(this.value)
  }
}
```

2. 使用箭头函数

```js
class Button {
  constructor(value) {
    this.value = value
  }
  click = () => {
    // *
    alert(this.value)
  }
}
```

3. 使用 Proxy，获取方法的时候自动绑定 this  
   详见 ES6 教程

#### 注意点

- 类和模块内部默认严格模式
- 类不存在变量提升

```js
new Foo() // ReferenceError
class Foo {}
```

- 类的 name 属性

```js
class Point {}
Point.name // "Point"
```

#### 私有属性和方法

- 命名上加以区别，下划线开头
- 私有方法移出模块
- 利用 Symbol 的唯一性

#### new target 属性

- 返回 new 命令作用于的那个构造函数
- 如果构造函数不是通过 new 命令或 Reflect.construct()调用的返回 undefined
- 子类继承父类时，new.target 会返回子类

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
let user = new User('Tom')
user.sayHi()
```

这个定义的结果与使用上述类得到的结果基本相同。但又有很大差异

- 通过 class 创建的函数具有特殊的内部属性标记 \[\[FunctionKind]]:"classConstructor"。因此，它与手动创建并不完全相同。
- 大多数 JavaScript 引擎中的类构造器的字符串表示形式都以 “class…” 开头
- 类方法不可枚举。 类定义将 "prototype" 中的所有方法的 enumerable 标志设置为 false。
- 类总是使用 use strict。 在类构造中的所有代码都将自动进入严格模式。
- 类必须使用 new 调用，否则会报错。普通构造函数不用 new 也可以执行。

---

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
let rabbit = new Rabbit()
rabbit.ownFunc()
rabbit.pubFunc() // 来自继承
```

在内部关键字 `extends` 使用了很好的旧的原型机制进行工作。它将 Rabbit.prototype.\[\[Prototype]] 设置为 Animal.prototype。整个过程为

1. 查找对象 rabbit （没有 pubFunc）
2. 查找它的原型，即 Rabbit.prototype （有 ownFunc 但没有 pubFunc）
3. 继续向上查找原型，即 Animal.prototype （找到 pubFunc）

extends 可以后接表达式 `class User extends f('Tom') {}`

#### super 关键字 重写

1. 重写方法
   Rabbit 和 Animal 中均有一个方法时，我们不希望完全替换父类的方法，而是希望在父类方法的基础上进行调整或扩展其功能。  
   `super关键字`

- `super.method(...)` 调用一个父类方法
- `super(...)` 调用一个父类 constructor
  现在 super.ownFunc() 调用的就是父类中的 ownFunc 方法，this.ownFunc() 调用的就是子类中的 ownFunc 方法

需要注意的是箭头函数没有 this，它也没有 super。和获取 this 一样，super 也会从外部函数获取。

2. 重写 constructor
   没有自己 constructor 的子类，在已继承的情况下，会调用父类的 constructor，并传递所有的参数。

```js
class Rabbit extends Animal {
  // 为没有自己的 constructor 的扩展类生成的
  constructor(...args) {
    super(...args)
  }
}
```

继承类的 constructor 必须调用 super(...)，并且一定要在使用 this 之前调用。

3. more

- super 指向父类的原型对象，所以定义在父类实例上的方法或属性（父类中 this.的方法或属性），是无法通过 super 调用的
- 子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例。
- super 作为对象，用在静态方法之中，这时 super 将指向父类，而不是父类的原型对象。（因为静态 就不会被实例继承）
- 在子类的静态方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类，而不是子类的实例。
  > 只要和 静态 相关，就是指向自身（不是原型/实例对象）

### why

1. class 继承和原型继承的差别？

   - getPrototypeOf 结果不同  
     类继承中子类会 \[\[Prototype]] 链接到父类，原型继承中的构造函数都是通过 prototype 指向的原型对象相互联系的。一般在原型继承中，子构造函数的原型对象是父构造函数，或者子构造函数的原型对象 \[\[Prototype]] 链接到父构造函数的原型对象。
   - this 创造顺序不同  
     ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承先将父类实例对象的属性，加到 this 上面（所以必须先调用 super 方法），然后再在子类中修改 this。
   - 子类实例的构建，基于父类实例，只有 super 方法才能调用父类实例。

2. 我们知道所有的对象通常都继承自 Object.prototype，"class Rabbit extends Object" 和 class Rabbit 的差异？

| class Rabbit                            | class Rabbit extends Object          |
| --------------------------------------- | ------------------------------------ |
| –                                       | needs to call super() in constructor |
| Rabbit.**proto** === Function.prototype | Rabbit.**proto** === Object          |

---

### 静态属性和方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。  
在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```js
class User {
  static publisher = 'Tom'
  static staticMethod() {
    // ...
  }
}
```

以上代码等同于

```js
class User {}
User.publisher = 'Tom'
User.staticMethod = function () {
  // ...
}
```

用途：静态方法用于实现属于该类但不属于该类任何特定对象的函数。  
也被用于与数据库相关的公共类，可以用于搜索/保存/删除数据库中的条目

- 如果静态方法包含 this 关键字，这个 this 指的是类，而不是实例。
- 静态方法可以与非静态方法重名。
- 父类的静态方法，可以被子类继承。
- 静态方法也是可以从 super 对象上调用的。

## 扩展内建类

### what

内建的类，例如 Array，Map 等也都是可以扩展的（extendable）。内建类其实就是系统自带的类（集合）

```js
class PowerArr extends Array {
  method() {
    // ...
  }
}
let arr = new PowerArr()
// arr.filter()
// arr.filter().method()
```

上面的例子中 `arr.constructor === PowerArray`  
arr.filter() 被调用时，它的内部使用的是 arr.constructor 来创建新的结果数组，而不是使用原生的 Array

```js
class PowerArr extends Array {
  method() {
    // ...
  }
  // 内建方法将使用这个作为 constructor
  static get [Symbol.species]() {
    return Array
  }
}
let arr = new PowerArr()
// arr.filter().method() 报错
```

给这个类添加一个特殊的静态 getter Symbol.species，内建方法将返回常规数组。  
.filter 返回 Array。所以扩展的功能不再传递。结果就是会报错

#### 内建类的继承

内建类相互间不继承静态方法。  
例如，Array 和 Data 都继承自 Object，所以它们的实例都有来自 Object.prototype 的方法。但 Array.[[Prototype]] 并不指向 Object，所以它们没有例如 Array.keys()（或 Data.keys()）这些静态方法。

### why

1. 通过 extends 获得的继承和内建对象之间的继承的区别？

- 前者通过原型链继承
- Data 继承自 Object，但 Data.[[Prototype]] 并不指向 Object，所以它们没有 Object 的静态方法。Date 和 Object 之间没有连结。它们是独立的，只有 Date.prototype 继承自 Object.prototype。

## 类检查 instanceof

### what

instanceof 操作符用于检查一个对象是否属于某个特定的 class。同时，它还考虑了继承。

1. 普通类

```js
class Rabbit {}
let rabbit = new Rabbit()

// obj 隶属于 Class 类（或 Class 类的衍生类）
alert(rabbit instanceof Rabbit) // true
```

2. 构造函数

```js
// 构造函数，不是 class
function Rabbit() {}
alert(new Rabbit() instanceof Rabbit) // true
```

3. 内建类

```js
let arr = [1, 2, 3]
alert(arr instanceof Array) // true
alert(arr instanceof Object) // true
```

### how

instanceof 在检查中会将原型链考虑在内。此外，我们还可以在静态方法 Symbol.hasInstance 中设置自定义逻辑。  
obj instanceof Class 算法的执行过程大致如下：

1. 有静态方法 Symbol.hasInstance，那就直接调用这个方法

```js
// 设置 instanceOf 检查
// 并假设具有 canEat 属性的都是 animal
class Animal {
  static [Symbol.hasInstance](obj) {
    if (obj.canEat) return true
  }
}

let obj = { canEat: true }
alert(obj instanceof Animal) // true：Animal[Symbol.hasInstance](obj) 被调用
```

2. 大多数 class 没有 Symbol.hasInstance。使用 obj instanceOf Class 检查 Class.prototype 是否等于 obj 的原型链中的原型之一。

```
obj.__proto__ === Class.prototype?
obj.__proto__.__proto__ === Class.prototype?
// 如果任意一个的答案为 true，则返回 true
// 否则，如果我们已经检查到了原型链的尾端，则返回 false
```

如果 objA 处在 objB 的原型链中，则返回 true。所以，可以将 obj instanceof Class 检查改为 Class.prototype.isPrototypeOf(obj)。

### typeof 的增强版 / instanceof 的替代方法

```js
let user = {
  [Symbol.toStringTag]: 'User',
}

alert({}.toString.call(user)) // [object User]
```

不仅能检查原始数据类型，而且适用于内建对象，更可贵的是还支持自定义。可以用 {}.toString.call 替代 instanceof。

### more

判断 instanceof 最重要的指标是找 prototype，与其他无关。

## 大总结

- `extends` 语法会设置两个原型：
  1.  在构造函数的 "prototype" 之间设置原型（为了获取实例方法）。
  2.  在构造函数之间会设置原型（为了获取静态方法）。
- 扩展一个类 class Child extends Parent（即 Child.prototype.\_\_proto\_\_ 是 Parent.prototype）
- 箭头函数没有 this，也没有 super
- super.method(...) 调用一个父类方法
- super(...) 调用一个父类 constructor
- 继承对常规方法和静态方法都有效
- 内建类相互间不继承静态方法。
- 继承、重写、多态
  1.  继承：extends 关键字
  2.  重写：super 关键字
  3.  多态：instanceof 操作符

|             | 用于                                                       | 返回值     |
| ----------- | ---------------------------------------------------------- | ---------- |
| typeof      | 原始数据类型                                               | string     |
| {}.toString | 原始数据类型，内建对象，包含 Symbol.toStringTag 属性的对象 | string     |
| instanceof  | 对象                                                       | true/false |
