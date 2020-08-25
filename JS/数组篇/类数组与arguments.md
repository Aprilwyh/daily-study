### 写在前面
类数组不是数组，不能直接使用数组的方法

### 类数组转数组
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
1. Array.from
Array.from(arrayLike);
2. 扩展运算符（...）
[...arrayLike];
3. slice
Array.prototype.slice.call(arrayLike); // 或者 [].slice.call(arguments);
4. splice
Array.prototype.splice.call(arrayLike, 0);
5. apply
Array.prototype.concat.apply([], arrayLike);

### Arguments对象
Arguments 对象只定义在函数体中，包括了函数的参数和其他属性。
#### length属性
表示实参的长度
#### callee属性（已不建议使用）
通过它可以调用函数自身  
早期版本的 JavaScript不允许使用命名函数表达式，所以无法创建一个递归函数表达式。因此才有arguments.callee。  
现在当一个函数必须调用自身的时候, 避免使用 arguments.callee(), 通过要么给函数表达式一个名字,要么使用一个函数声明。

### 注意事项
#### arguments 和对应参数的绑定
```js
function foo(name, age, sex) {
    console.log(name, arguments[0]); // name name
    // 改变形参
    name = 'new name';
    console.log(name, arguments[0]); // new name new name

    // 测试未传入的是否会绑定
    console.log(sex); // undefined
    sex = 'new sex';
    console.log(sex, arguments[2]); // new sex undefined
}
foo('name');
```
- 严格模式下，实参和 arguments 不会共享。
- 非严格模式下
   - 对于传入的参数，实参和 arguments 的值会共享
   - 没有传入的参数，实参与 arguments 值不会共享

#### arguments 与 this
```js
var obj = {  
    age: 18,  
    foo: function (func) {    
        func()    
        arguments[0]()  
    }
}
var age = 10
function temp () {  
    console.log(this.age)
}
obj.foo(temp)
```
> 10; undefined
向foo()中传递了temp函数，并且调用会发生隐式绑定丢失问题，从而使函数内的this指向window。所以func()的执行结果为10。    
而对于题目中的arguments[0]()，如果即将调用的方法是在数组(类数组)中的，那此时调用函数内的this是调用的这个数组。因此此时temp内的this就是arguments了，而在arguments内是没有age这个属性的，所以会打印出undefined。  
【升级版】
```js
var obj = { 
    age: 10,  
    foo: function (fn) {    
        fn.call(this)()
        arguments[0]()()
        arguments[0].call(this)()
        arguments[0]().call(this)
    }
}
var age = 20
function temp () {  
    return function () {    
        console.log(this.age)  
    }
}
obj.foo(temp)
```
> 20; 20; 20; 10
1. call(this)改变的是第一次调用this指向，第二次调用是window调用，结果20。  
2. 第二次调用是window调用，结果20。  
3. 同第一点  
4. 第一次调用得到一个返回函数，call(this)改变了它的this指向，将它绑定为foo函数内的this，此时foo函数内的this是指向的obj，因为调用foo的是obj，结果为10。  
综上，其实一个函数中返回另一个函数，如果没用call/apply进行显式绑定的话，调用它的都是window。

#### auguments 与箭头函数
**箭头函数没有 "arguments"**  
如果我们在箭头函数中访问 arguments，访问到的 arguments 并不属于箭头函数，而是属于箭头函数外部的“普通”函数。  
箭头函数也没有自身的 this，这在 this一节中已经讲到

### arguments的应用
参数不定长  
函数柯里化  
递归调用  
函数重载  
...  