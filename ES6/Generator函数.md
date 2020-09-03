### what
常规函数只会返回一个单一值（或者不返回任何值）。而 Generator 可以按需一个接一个地返回（“yield”）多个值。
```js
// 特殊的语法结构：function*，即所谓的 “generator function”。  
function* generateSequence() {
    yield 1;
    yield 2;
    return 3;
}
// "generator function" 创建了一个 "generator object"
let generator = generateSequence();
alert(generator); // [object Generator]
```
其实它还没有执行，想要获取第一个产出的（yielded）值，需要使用**next()**  
next() 的结果始终是一个具有两个属性的对象：
- value: 产出的（yielded）的值。
- done: 如果 generator 函数已执行完成则为 true，否则为 false。
```js
let one = generator.next();
alert(JSON.stringify(one)); // {value: 1, done: false}

let two = generator.next();
alert(JSON.stringify(two)); // {value: 2, done: false}

let three = generator.next();
alert(JSON.stringify(three)); // {value: 3, done: true}
```
### iterable 可迭代
使用for...of
```js
for(let value of generator) {
  alert(value); // 1，然后是 2，它不会显示 3！（因为最后一个是 return，改成 yield 就显示3了）
}
```
使用 iterator 的所有相关功能
```js
let sequence = [0, ...generateSequence()];
alert(sequence); // 0, 1, 2，它不会显示 3！（因为最后一个是 return，改成 yield 就显示3了）
```
### 使用 generator 进行迭代
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
### yield* 组合 generator
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
### yield 是一条双向路
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

### generator throw
外部代码可能会将一个值传递到 generator，作为 yield 的结果。error 也是一种结果。  
调用 generator.throw(err) 向 yield 传递一个 error，err 将被抛到对应的 yield 所在的那一行。
```js
try {
  generator.throw(new Error("The answer is not found in my database"));
} catch(e) {
  alert(e); // 显示这个 error
}
```

### 总结
- Generator 是通过 generator 函数 function* f(…) {…} 创建的。
- 在 generator（仅在）内部，存在 yield 操作。
- 外部代码和 generator 可能会通过 next/yield 调用交换结果。