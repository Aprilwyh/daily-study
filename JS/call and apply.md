二者差别略

### 应用场景
1. 合并数组
```js
Array.prototype.push.apply(arr1, arr2);
```
与 `arr1.concat(arr2)` 中 concat的合并差别是 apply中arr1会被影响，而concat中的arr1不会被影响

2. 获取数组最大/最小值
```js
Math.max.apply(Math, arr); // ES5
Math.max.call(Math, ...arr); // ES6
```

3. 验证是否为数组
```js
Object.prototype.toString.call(obj) === '[object Array]';
```
等同于 `Array.isArray(arr)`

4. 类数组转数组
```js
Array.prototype.slice.call(domNodes);
// 等同于
[].slice.call(domNodes);
```
ES6写法 `Array.from(arguments);` 或者 `[...arguments];`

5. 调用父构造函数实现继承
详见【继承篇】


### 模拟实现（ES6）
自实现 call
```js
// this 为调用的函数
// context 是参数对象
Function.prototype.myCall = function(context){
    // 判断调用者是否为函数
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    // 不传参默认指向 window
    context = context || window
    // 新增 fn 属性（后面需要删掉）,将值设置为需要调用的函数
    context.fn = this
    // 将 arguments 转化为数组将 call 的传参提取出来 [...arguments]
    const args = Array.from(arguments).slice(1)
    // 传参执行函数
    const result = context.fn(...args)
    // 删除函数
    delete context.fn
    // 返回执行结果
    return result;
}
// 普通函数
function print(age){
    console.log(this.name+" "+age);
}
// 自定义对象
var obj = {
    name:'名字'
}
// 调用函数的 call 方法
print.myCall(obj,1,2,3)
```

自实现 apply
```js
Function.prototype.myApply = function(context){
    // 判断调用者是否为函数
    if(typeof this !== 'function'){
        throw new TypeError('Error')
    }
    // 不传参默认为 window
    context = context || window
    // 新增 fn 属性,将值设置为需要调用的函数
    context.fn = this
    // 返回执行结果
    let result;
    // 判断是否有参数传入
    if(arguments[1]){
        result = context.fn(...arguments[1])
    }else{
        result = context.fn()
    }
    // 删除函数
    delete context.fn
    // 返回执行结果
    return result;
}
// 普通函数
function print(age,age2,age3){
    console.log(this.name+" "+ age + " "+ age2+" "+age3);
}
// 自定义对象
var obj = {
    name: '姓名'
}
// 调用函数的 call 方法
print.myApply(obj, [1, 2, 3])
```