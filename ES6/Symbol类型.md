### what
唯一。 Symbol("id") 不等于 Symbol("id")  

不会被自动转换为字符串
- toString()
- symbol.description 显示描述

### why
创建“隐藏”属性
- 使用 Symbol("id") 作为键代替字符串 "id"
   1. 外面（第三方）访问不到，安全
   2. 我们与第三方库都使用 id 也不会发生冲突

### how
字面量中使用  
```js
let id = Symbol("id");
let user = {
  [id]: 123 // 而不是 "id"：123
};
```
for...in 循环中使用，会被跳过  
Object.keys(user) 也会被忽略  
Object.assign() 会被复制。这并不矛盾
#### 使用场景
1. “隐藏” 对象属性。向“属于”另一个脚本或者库的对象添加一个属性，该属性将受到保护，防止被意外使用或重写。
2. 使用它们来改变一些内置行为。

### API
#### 全局
Symbol.for(key)
```js
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 Symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 Symbol
alert( id === idAgain ); // true
```
Symbol.keyFor(sym)
```js
// 通过 name 获取 Symbol
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 通过 Symbol 获取 name
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

#### 系统
- Symbol.hasInstance
- Symbol.isConcatSpreadable
- Symbol.iterator
- Symbol.toPrimitive

### 其他
- 内置方法 Object.getOwnPropertySymbols(obj) 允许我们获取所有的 Symbol。  
- Reflect.ownKeys(obj) 的方法可以返回一个对象的 所有 键，包括 Symbol。
虽然 Symbol 不是 100% 隐藏的，但是上述方法在很多库中都没有被使用