### 一些概念
实现new之前首先要明白它有哪些特性，使用new创建的实例  
1. 能访问到构造函数里的属性
2. 能访问到原型中的属性

new 的过程包括以下四个阶段：
- 创建一个新对象。
- 这个新对象的 \_\_proto__ 属性指向原函数的 prototype 属性。(即继承原函数的原型)
- 将这个新对象绑定到此函数的 this 上 。
- 返回新对象，如果这个函数没有返回其他对象。

### 模拟实现
```js
// 1. 生成新对象
// 2. 链接到原型
// 3. 绑定 this
// 4. 返回新对象
function create(Con, ...args){
    // 创建空对象
    let obj = {};
    // 设置空对象的原型(链接对象的原型)
    obj._proto_ = Con.prototype;
    // 绑定 this 并执行构造函数(为对象设置属性)
    let result = Con.apply(obj,args)
    // 如果 result 没有其他选择的对象，就返回 obj 对象
    return result instanceof Object ? result : obj;
}
// 测试用例
// 构造函数
function Cat(color) {
    this.color = color;
}
Cat.prototype.start = function () {
    console.log(this.color + " cat start");
}
const car = create(Cat, "black");
console.log(car.color); // black
car.start(); // black cat start
```

