### Map 映射
#### what
一个带键的数据项的集合，就像一个 Object 一样。   

#### why
- 普通的 Object 会将键转化为字符串
- Map 会保留键的类型，允许任何类型的键（key）
- Map 迭代的顺序与插入值的顺序相同（与普通的 Object 不同）

#### how
使用 Map 的正确方式是使用 map 方法：set 和 get 等。**不要用map[key]**  
每一次 map.set 调用都会返回 map 本身，所以map **支持链式调用**
```js
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// 遍历所有的键（vegetables）
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// 遍历所有的值（amounts）
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// 遍历所有的实体 [key, value]
for (let entry of recipeMap) { // 与 recipeMap.entries() 相同
  alert(entry); // cucumber,500 (and so on)
}
```
此外，Map 有内置的 forEach 方法，与 Array 类似

#### more
Object.entries() 从对象创建 Map
```js
let obj = {
  name: "John",
  age: 30
};
let map = new Map(Object.entries(obj));
// Object.entries 返回键/值对数组：[ ["name","John"], ["age", 30] ]
alert( map.get('name') ); // John
```
Object.fromEntries 从 Map 创建对象
```js
let map = new Map();
map.set('banana', 1).set('orange', 2).set('meat', 4);
let obj = Object.fromEntries(map); // 创建一个普通对象。map 与 map.entries() 结果相同
// obj = { banana: 1, orange: 2, meat: 4 }
```

### Set 集合
#### what
Set 是一个特殊的类型集合 —— “值的集合”（没有键），它的每一个值只能出现一次。

#### why
重复使用同一个值调用 set.add(value) 并不会发生什么改变。这就是 Set 里面的每一个值只出现一次的原因。
```js
let set = new Set();
set.add(1).add(2).add(1);
alert(set.size); // 2
```

#### how
可以使用 for..of 或 forEach 来遍历 Set  
用于数组去重
```js
const arr = [1, 1, 2, 3, 4, 4]
const arrRemove = [...new Set(arr)]
// 等同于 Array.from(new Set(arr))
```
#### more
Set 的替代方法可以是一个用户数组，用 arr.find 在每次插入值时检查是否重复。但是这样性能会很差