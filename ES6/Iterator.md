## Async iterator 异步迭代器
异步迭代器（iterator）允许我们对按需通过异步请求而得到的数据进行迭代。例如，我们通过网络分段（chunk-by-chunk）下载数据时。异步生成器（generator）使这一步骤更加方便。

### why
1. 异步迭代器（async iterator）与常规的迭代器的区别？

| | Async Iterable | Iterable |
| - | - | - |
| 提供 iterator 的对象方法 | Symbol.asyncIterator | Symbol.iterator |
| next() 返回的值是 | resolve 成 {value:…, done: true/false} 的 Promise | {value:…, done: true/false} |
| 要进行循环，使用 | for await (let item of iterable) | for (let item of iterable) |

Spread 语法 ... 无法异步工作，因为它期望找到 Symbol.iterator，跟 for..of 没有 await 一样。

2. 异步生成器（async generator）与常规的生成器的区别？

| |	Async generator | Generator |
| - | - | - |
| 声明方式 | async function* | function* |
| next() 返回的值是 | resolve 成 {value:…, done: true/false} 的 Promise | {value:…, done: true/false} |

### more
分页的实际例子，见 现代JS 官网