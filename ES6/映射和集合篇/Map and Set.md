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

***

## Set 集合
### what
Set 是一个特殊的类型集合 —— “值的集合”（没有键名，只有键值），它的每一个值只能出现一次。  
Set本身是一个构造函数，用来生成 Set 数据结构。

#### 去重
Set 结构不会添加重复的值（重复的添加会被忽略）  
1. 去除数组重复成员
```js
// 法一
[...new Set(array)]

// 法二
Array.from(new Set(array))
```
2. 去除字符串里面的重复字符
```js
[...new Set('ababbc')].join('')
```

#### 无类型转换
向 Set 加入值的时候，不会发生类型转换
- 5和"5"是两个不同的值。
- 对象和对象也是不相同的，即使是两个空对象。
- NaN 等于 NaN，所以 NaN 只能加入一个

#### 可遍历
- Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法
```js
Set.prototype[Symbol.iterator] === Set.prototype.values // true
```
- Set的遍历顺序就是插入顺序

#### Set 实例的属性和方法
##### 属性
- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。

##### 操作方法（用于操作数据）
- Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
- Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
- Set.prototype.clear()：清除所有成员，没有返回值。
```js
s.add(1).add(2).add(2); // 2被加入了两次

s.size // 2

s.has(1) // true
s.has(3) // false

s.delete(2);
s.has(2) // false
```

##### 遍历方法（用于遍历成员）
- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员
```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item); // 依次输出 red  green  blue
}
// 由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

### why
1. Set 中讲的唯一和 Symbol 中讲的唯一 有什么差别？
```js
let array = [Symbol('id'), Symbol('id'), Symbol.for('id'), Symbol.for('id')];
console.log([...new Set(array)]); // [Symbol(id), Symbol(id), Symbol(id)]
```
Symbol 中的唯一是指定义即是唯一  
Set 中的唯一是指去重后，每一个元素都是唯一的（Symbol.for('id') 就是重复的定义，需要去除） 

2. 遍历 Set 的方法？
除了上述四种自带的遍历方法外，还可以使用以下方式来遍历 Set
- for...of
- forEach
- 扩展运算符（...））（内部使用for...of循环，所以也可以用于 Set 结构）
- 数组的map和filter方法也可以间接用于 Set
```js
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

3. 如何在遍历操作中同步修改 Set 结构？
- 利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构
- 利用Array.from方法
```js
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```

### more
Set 的替代方法可以是一个用户数组，用 arr.find 在每次插入值时检查是否重复。但是这样性能会很差