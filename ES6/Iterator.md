## what
JS的四种数据集合：1. Array 2. Object 3. Map 4. Set  
以上可以组合使用，这样就需要一种统一的接口机制，来处理所有不同的数据结构。  
遍历器（Iterator）就是这样一种机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

### Iterator 的作用
1. 为各种数据结构，提供一个统一的、简便的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

### Iterator 的遍历过程
1. 创建一个指针对象，指向当前数据结构的起始位置。
2. 调用指针对象的next方法，将指针指向数据结构的第一个成员
3. 调用next方法返回数据结构的当前成员信息（value 和 done。前者是当前成员的值，后者是表示遍历是否结束的布尔值）
4. 不断重复 2~3 步骤，直至指针指向数据结构的结束位置。

### 默认 Iterator 接口
默认的 Iterator 接口部署在数据结构的Symbol.iterator属性
```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```
对象obj是可遍历的: 1. 具有Symbol.iterator属性 2. 部署了 Iterator 接口  
原生具备 Iterator 接口的数据结构如下（可遍历）
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象
对于原生部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of循环会自动遍历它们。  
当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。  



## Async iterator 异步迭代器
异步迭代器（iterator）允许我们对按需通过异步请求而得到的数据进行迭代。例如，我们通过网络分段（chunk-by-chunk）下载数据时。异步生成器（generator）使这一步骤更加方便。

## why
1. 判断一个对象是否可遍历？
除了原生具备 Iterator 接口的数据结构外，其他数据结构（主要是对象）的判定条件是
   1. 具有Symbol.iterator属性 2. 部署了 Iterator 接口（有1默认就有2，需要手动部署）

2. 为什么 Object 没有默认部署 Iterator 接口？
因为对象的哪个属性先遍历，哪个属性后遍历是不确定的。

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