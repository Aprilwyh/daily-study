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


### 模拟实现
