### what
在 JavaScript 中，我们只能继承单个对象。  
每个对象只能有一个 [[Prototype]]。  
每个类只可以扩展另外一个类。  
mixin 是一个包含可被其他类使用而无需继承的方法的类。
```js
// mixin
let sayHiMixin = {
    sayHi() {
        alert('hi ' + this.name)
    },
    sayBye() {
        alert('bye ' + this.name)
    }
};
class User {
    constructor(name) {
        this.name = name;
    }
}
Object.assign(User.prototype, sayHiMixin);
new User("Tom").sayHi(); // hi Tom
```
Mixin 可以在自己内部使用继承。
```js
let sayMixin = {
  say(phrase) {
    alert(phrase);
  }
};
let sayHiMixin = {
  __proto__: sayMixin, // (或者使用 Object.create 来设置原型)

  sayHi() {
    // 调用父类方法
    super.say(`hi ${this.name}`);
  }
};
```
在 sayHiMixin 内部对父类方法 super.say() 的调用会在 mixin 的原型中查找方法，而不是在 class 中查找。  
当 super 寻找父方法时，意味着它搜索的是 sayHiMixin.\[\[Prototype]]，而不是 User.\[\[Prototype]]。

### 总结
- Mixin — 是一个通用的面向对象编程术语：一个包含其他类的方法的类。
- JavaScript 不支持多重继承，但是可以通过将方法拷贝到原型中来实现 mixin。

### more
构造一个 mixin（ EventMixin ），使我们能够轻松地将与事件相关的函数添加到任意 class/object 中  
见 现代JS官网吧