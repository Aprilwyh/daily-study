## what
Promise是异步编程的一种解决方案，比传统方案更合理更强大  
回调中添加回调，层数少还可以但多层回调函数就不好了。（回调地狱、厄运金字塔）这时候就需要Promise
~~传统的解决异步方案：回调函数和事件~~

### Promise的优缺点及特点
Promise是一个对象（也是一个构造函数），从它可以获取异步操作的消息
优点：
- 将异步操作以同步操作的流程表达出来避免了层层嵌套的回调函数
- 提供统一接口，使得控制异步操作更加容易

缺点：
- 无法中途取消，一旦新建立即执行
- 如果不设置回调函数。Promise内部抛出的错误不会反应到外部
- 当处于Pending状态时，无法得知目前进展到哪一阶段（刚刚开始 or 即将完成）

Promise对象有两个特点
- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态
   - Pending（进行中）
   - Fulfilled（已成功）
   - Rejected（已失败）
- 一旦状态改变就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变只有两种可能
   - 从Pending变为Fulfilled
   - 从Pending变为Rejected

### Promise 错误处理
#### Promise 内部的错误不会影响到 Promise 外部的代码
.catch 不必是立即执行的，可能在一个或多个 .then 之后出现  
通常情况下 .catch 根本不会被触发。但是如果任意一个 promise 被 reject（网络问题或者无效的 json 或其他），.catch 就会捕获它。  
.catch 处理 promise 中的各种 error：在 reject() 调用中的，或者在处理程序（handler）中抛出的（thrown）error。
#### 隐式 try..catch
Promise 的执行者（executor）和 promise 的处理程序（handler）周围有一个“隐式的 try..catch”。  
.catch 不仅会捕获显式的 rejection，还会捕获它上面的处理程序（handler）中意外出现的 error。
#### 再次抛出
如果我们在 .catch 中 throw，那么控制权就会被移交到下一个最近的 error 处理程序（handler）。如果我们处理该 error 并正常完成（ .catch 块正常完成），那么它将继续到最近的成功的 .then 处理程序（handler）。
```js
// ...
.catch(function(error) {
   if(/* ... */) {
      // 处理
   } else {
      throw error; // 再次抛出此 error 或另外一个 error，执行将跳转至下一个 catch
   }
})
```
如果没有办法从 error 中恢复的话，不使用 .catch 也可以。
#### 没被处理的 error
如果出现 error，promise 的状态将变为 “rejected”，然后执行应该跳转至最近的 rejection 处理程序（handler）。但如果忘了在链的尾端附加 .catch， error 会“卡住（stuck）”。没有代码来处理它。JavaScript 引擎会跟踪此类 rejection，在这种情况下会生成一个全局的 error。  

#### unhandledrejection 事件  
当Promise 被 reject 且没有 reject 处理器的时候,会触发 unhandledrejection 事件

#### finally()
finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。  
finally方法的回调函数不接受任何参数（与状态无关的，不依赖于 Promise 的执行结果）  
使用场景：服务器使用 Promise 处理请求，然后使用finally方法关掉服务器。  
finally 的实现
```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```
finally方法总是会返回原来的值

### 微任务
当一个 promise 准备就绪时，它的 .then/catch/finally 处理程序（handler）就会被放入队列中：但是它们不会立即被执行。当 JavaScript 引擎执行完当前的代码，它会从队列中获取任务并执行它。也被称为“微任务队列”（ES8 术语）。  
因此，.then/catch/finally 处理程序（handler）总是在当前代码完成后才会被调用。  

如果我们需要确保一段代码在 .then/catch/finally 之后被执行，我们可以将它添加到链式调用的 .then 中。

### 其他方法
#### Promise.all()
（有点类似 与）
```js
const p = Promise.all([p1, p2, p3]); // p1、p2、p3都是 Promise 实例
```
- 只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled。此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
- 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected。此时第一个被reject的实例的返回值，会传递给p的回调函数。
#### Promise.race()
（有点类似 或）
```js
const p = Promise.all([p1, p2, p3]); // p1、p2、p3都是 Promise 实例
```
只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
#### Promise.allSettled()
Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。
#### Promise.any() （提案）
Promise.any()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。
#### Promise.resolve()
将现有对象转为 Promise 对象
#### Promise.reject()
返回一个新的 Promise 实例，该实例的状态为rejected。
#### Promise.try()
同步函数同步执行，异步函数异步执行，并且它们具有统一的 API  
- 第二种方法：async 函数
- 第三种方法：new Promise()

### async/await
async/await 是以更舒适的方式使用 promise 的一种特殊语法  
async 确保了函数返回一个 promise，也会将非 promise 的值包装进去(被包装在一个 resolved 的 promise 中)
```js
async function f() {
  return 1;
}
```
await 让 JavaScript 引擎等待直到 promise 完成（settle）并返回结果。(只在 async 函数内工作)
```js
// 只在 async 函数内工作
let value = await promise; // 等待，直到 promise resolve
```
相比于 promise.then，它只是获取 promise 的结果的一个更优雅的语法，同时也更易于读写。  
#### Error 处理
以上的 await 都是针对 resolve，但是发生错误的时候 await 如何处理？  
1. 使用 try...catch
```js
async function f() {
  try {
    let response = await fetch('http://no-such-url');
    // let response1 = await ... 可以用 try 包装多行 await 代码
  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }
}
f();
```
2. 可以函数调用后直接添加 .catch
```js
async function f() {
  let response = await fetch('http://no-such-url');
}
// f() 变成了一个 rejected 的 promise
f().catch(alert); // TypeError: failed to fetch // (*)
```
3. 也可以使用全局事件处理程序 unhandledrejection 来捕获这类 error。

### 使用场景
1. 异步加载图片
```js
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}
```

2. 用Promise对象实现的 Ajax 操作
```js
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

3. Generator 函数与 Promise 的结合

## why
1. try/catch 和 Promise.prototype.then()/catch() 方法的区别？
try/catch无法捕获promise.reject的问题，因为 try 里面不能写异步代码  
没有使用catch()方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。