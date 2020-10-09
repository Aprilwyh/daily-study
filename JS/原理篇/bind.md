bind 方法与 call / apply 最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数。  
call / apply 的实现见另一篇
### 模拟实现
```js
// 手写一个 bind 函数
Function.prototype.myBind = function (context) {
    // 判断调用者是否为函数
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    // 截取传递的参数
    const args = Array.from(arguments).slice(1)
    // self 指向调用的函数
    const self = this;
    // 返回一个函数
    return function F(){
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    // 对于 new 的情况来说，不会被任何方式改变 this
        if(this instanceof F){
            return new self(...args, ...arguments)
        }else{
            return self.apply(context,args.concat(...arguments))
        }
    }
}

// 测试用例
// 自定义对象
var foo = {
    value: 1
};
// 普通函数
function bar(name, age) {
    // new 的方式调用 bind 参数输出换做 [...arguments]
    console.log(this.value);
    console.log(name);
    console.log(age);
}
// 调用函数的 call 方法
let F = bar.myBind(foo, 'Jack');
// 返回对象
let obj = new F(20); // 返回正确
// undefined
// Jack
// 20
```