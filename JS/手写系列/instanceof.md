### instanceof是什么
instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上。
```js
function C() {}
function D() {}
var o = new C();
o instanceof C; // true，因为 Object.getPrototypeOf(o) === C.prototype
o instanceof D; // false，因为 D.prototype 不在 o 的原型链上
```
### instanceof的原理
一层一层查找 __proto__，如果和 constructor.prototype 相等则返回 true，如果一直没有查找成功则返回 false。  
instance.[__proto__...] === instance.constructor.prototype

### instanceof的实现
```js
function instance_of(L, R) { //L 表示左表达式，R 表示右表达式
    var O = R.prototype; // 取 R 的显示原型
    L = L.__proto__; // 取 L 的隐式原型
    while(true) {
        // Object.prototype.__proto__ === null
        if(L === null) {
            return false;
        }
        if(O === L) { // 这里重点：当 O 严格等于 L 时，返回 true 
            return true;
        }
        L = L.__proto__;
    }
}
// 测试
function C() {}
function D() {}
var o = new C();
instance_of(o, C); // true
instance_of(o, D); // false
```