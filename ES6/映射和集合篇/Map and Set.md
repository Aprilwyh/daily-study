## Map 映射
### what
一个带键的数据项的集合，就像一个 Object 一样。  

#### 属性与方法
```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

// Map 也接受一个数组作为参数
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.clear()
map.size // 0
```
- size属性返回 Map 结构的成员总数。
- set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
> 每一次 map.set 调用都会返回 map 本身，所以map **支持链式调用**

- get方法读取key对应的键值，如果找不到key，返回undefined。
- has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
- delete方法删除某个键，返回true。如果删除失败，返回false。
- clear方法清除所有成员，没有返回值。

##### 遍历方法
使用 Map 的正确方式是使用 map 方法：set 和 get 等。**不要用map[key]**  
Map 的遍历顺序就是插入顺序。
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
- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历 Map 的所有成员（与 Array 类似）

#### Set和Map都可以用来生成新的 Map
```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

#### 同一个键多次赋值，后者覆盖前者
```js
const map = new Map();

map.set(1, 'aaa').set(1, 'bbb');
map.get(1) // "bbb"
```

#### 同一个对象的引用才是同一个键
```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined

const k1 = ['a'];
const k2 = ['a'];

map.set(k1, 111).set(k2, 222);
map.get(k1) // 111
map.get(k2) // 222
```
内存地址不一样，就视为两个键。（同名属性碰撞：扩展别人的库时，如果使用对象作为键名，不用担心自己的属性与原作者的属性同名。）

#### 简单类型判定是否为同一个键
- 0 和 -0 是同一个键
- NaN 和 NaN 视为同一个键
- 布尔 true 和字符串 true **不是**同一个键
- undefined 和 null **不是**同一个键

#### 类型转换
1. Map 转数组
使用扩展运算符（...）
```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map] // [[1,'one'], [2, 'two'], [3, 'three']]
```
结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）。

2. 数组转 Map
将数组传入 Map 构造函数
```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

3. Map 转对象
如果所有 Map 的键都是字符串，它可以无损地转为对象。  
```js
function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}
const myMap = new Map().set('yes', true).set('no', false);
strMapToObj(myMap); // { yes: true, no: false }
```
如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

4. 对象转 Map
对象转为 Map 可以通过Object.entries()。
```js
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```
或者自己写一个转换函数
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false}) // Map {"yes" => true, "no" => false}
```

5. Map 转为 Json
- Map 的键名都是字符串，这时可以选择转为对象 JSON。
```js
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap)); // strMapToObj 方法在上面
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap) // '{"yes":true,"no":false}'
```
- Map 的键名有非字符串，这时可以选择转为数组 JSON。
```js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap) // '[[true,7],[{"foo":3},["abc"]]]'
```

6. Json 转为 Map
- 正常情况下，所有键名都是字符串。
```js
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}') // Map {'yes' => true, 'no' => false}
```
- 特殊情况：整个 JSON 就是一个数组
```js
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]') // Map {true => 7, Object {foo: 3} => ['abc']}
```

### why
1. Map 和 Object 的区别？
- Object 只能使用字符串作为键（Object 字符--值）
- Map 各种类型的值（包括对象）都可以当做键（Map 值--值）
- Map 迭代的顺序与插入值的顺序相同（与普通的 Object 不同）

### 小总结
- 每一次 map.set 调用都会返回 map 本身，所以map **支持链式调用**
- 使用 Map 的正确方式是使用 map 方法：set 和 get 等。**不要用map[key]**

### more
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