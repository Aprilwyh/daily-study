## what
- 一种异步编程解决方案
- 封装了多个内部状态
- 可以返回一系列的值（名曰 生成器）

```js
function* helloGenerator() { // *
  yield 'hello'; // *
  return 'ending';
}
var hw = helloGenerator();
```
- *：区别于普通函数的特征（但 Generator 函数仍然是普通函数）
- 调用后，Generator 函数并不执行
- 执行后返回一个指向内部状态的指针（遍历器对象 Iterator），使用 next() 依次遍历内部状态

### 和 Iterator 的关系
Generator 函数是遍历器生成函数（Generator 生成 Iterator）
```js
function* gen(){}
var g = gen();
g[Symbol.iterator]() === g // true
```
- 将 Generator 函数赋值给 Symbol.iterator 属性，拥有此属性的对象就具有了 Iterator 接口。间接开挂有没有XD

### next()
next() 的两个属性
- value（产出的(yielded)值 **return 的值不展示**）
- done（true / false）

next() 的参数
- 可带一个参数，此参数就当作上一个 yield 表达式的返回值
> 这个功能的意义在于 Generator 函数运行的不同阶段，可以给 next() 不同的参数来调整函数的行为（从外部影响）

- 第一个 next() 的参数无效（因为还没有执行yield）V8 引擎直接忽略第一次使用next方法时的参数
> 如果想要第一次调用 next() 就输出 yield 值，需要做处理（详见 ES6教程）

## why
1. yield 表达式 和 return 语句 有什么差别？
- 每次遇到 yield 函数暂停执行，下一次再从该位置继续向后执行（多次）
- return 直接返回，不具备位置记忆功能（仅一次）


## 使用 generator 进行迭代
```js
let range = {
    from: 1,
    to: 5,
    *[Symbol.iterator]() { // [Symbol.iterator]: function*() 的简写形式
        for (let value = this.from; value <= this.to; value++) {
            yield value;
        }
    }
}
alert([...range]); // 1,2,3,4,5
```
## yield* 组合 generator
写一个公共的方法
```js
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
```
然后使用`yield*`将一个个 generator 组合起来，生成一个更复杂的序列
```js
function* generatePasswordCodes() {
  // A..Z
  yield* generateSequence(65, 90);

  // a..z
  yield* generateSequence(97, 122);
}
```
使用
```js
let str = '';
for(let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}
alert(str); // A..Za..z
```
## yield 是一条双向路
1. 向外返回结果 2. 将外部的值传递到 generator 内
```js
function* gen() {
    // 向外部代码传递一个问题并等待答案
    let result = yield "2 + 2 = ?";
    alert(result);
}
let generator = gen();
let question = generator.next().value; // <-- yield 返回的 value
generator.next(question); // --> 将结果传递到 generator 中
```
执行过程图解见 现代JS 官网

## generator throw
外部代码可能会将一个值传递到 generator，作为 yield 的结果。error 也是一种结果。  
调用 generator.throw(err) 向 yield 传递一个 error，err 将被抛到对应的 yield 所在的那一行。
```js
try {
  generator.throw(new Error("The answer is not found in my database"));
} catch(e) {
  alert(e); // 显示这个 error
}
```

## 总结
- Generator 是通过 generator 函数 function* f(…) {…} 创建的。
- 在 generator（仅在）内部，存在 yield 操作。
- 外部代码和 generator 可能会通过 next/yield 调用交换结果。