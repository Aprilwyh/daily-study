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
> for...of 循环、扩展运算符（...）、解构赋值、Array.from()
以上内部均调用遍历器接口，所以 Generator 返回的 Iterator 对象可以作为以上的参数

### next()
next() 的两个属性
- value（产出的(yielded)值 **return 的值不展示**）
- done（true / false）

next() 的参数
- 可带一个参数，此参数就当作上一个 yield 表达式的返回值
> 这个功能的意义在于 Generator 函数运行的不同阶段，可以给 next() 不同的参数来调整函数的行为（从外部影响）

- 第一个 next() 的参数无效（因为还没有执行yield）V8 引擎直接忽略第一次使用next方法时的参数
> 如果想要第一次调用 next() 就输出 yield 值，需要做处理（详见 ES6教程）

next() 的执行
- 第一次执行相当于启动执行 Generator 函数内部代码
- 之后执行可以传参，开始遍历

### throw()
throw() 的捕获  
- 前提：必须至少执行过一次next方法
- 过程：连续抛出多个错误时，首先会**被 Generator 函数体内的catch语句捕获**。如果 Generator 函数内部的catch语句已经执行过了（或者没有部署try...catch代码块），就抛出 Generator 函数体，**被函数体外的catch语句捕获**。如果 Generator 函数内部和外部，都没有部署try...catch代码块，那么程序将报错，直接中断执行。
- throw方法被捕获以后，会附带执行下一条yield表达式（即附带执行一次next方法）
- Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。
> 在 Generator 函数内部部署了try...catch情况下，throw方法抛出的错误不影响下次遍历

throw() 的参数
- 一个参数，该参数会被 catch 语句接收（建议抛出Error对象的实例）

### return()
return() 的执行
- Generator 函数内部有try...finally代码块，且正在执行try代码块，那么return方法会导致立刻进入finally代码块

### yield* 表达式
用来在 Generator 函数内部执行另一个 Generator 函数

## why
1. yield 表达式 和 return 语句 有什么差别？  
- 每次遇到 yield 函数暂停执行，下一次再从该位置继续向后执行（多次）
- return 直接返回，不具备位置记忆功能（仅一次）

2. 使得原生JS对象可以使用 for...of 遍历  
法一：通过 Generator 函数加上遍历接口
```js
function* objectEntries(obj) {
  // Reflect.ownKeys() 返回一个由目标对象自身的属性键组成的数组。
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```
法二：将 Generator 函数加到对象的 Symbol.iterator 属性上
```js
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

3. next()、throw()、return() 的共同点  
作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。
- next()是将yield表达式替换成一个值
- throw()是将yield表达式替换成一个throw语句
- return()是将yield表达式替换成一个return语句

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

## 总结
- Generator 是通过 generator 函数 function* f(…) {…} 创建的。
- 在 generator（仅在）内部，存在 yield 操作。
- 外部代码和 generator 可能会通过 next/yield 调用交换结果。