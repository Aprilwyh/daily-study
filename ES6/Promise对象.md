### 写在前面
回调中添加回调，层数少还可以但多层回调函数就不好了。（回调地狱、厄运金字塔）  
你需要Promise

### Promise的含义
Promise是异步编程的一种解决方案，比传统方案更合理更强大
~~传统的解决异步方案：回调函数和事件~~

Promise是一个对象，从它可以获取异步操作的消息
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

***
```js
let promise = new Promise(function(resolve, reject) {
  // executor（生产者代码）
  // executor 只能调用一个 resolve 或一个 reject
  // 所有其他的再对 resolve 和 reject 的调用都会被忽略
  // resolve/reject 只需要一个参数（或不包含任何参数），并且将忽略额外的参数。
});
```

unhandledrejection 事件  
当Promise 被 reject 且没有 reject 处理器的时候,会触发 unhandledrejection 事件

