## what
### 唯一
Symbol("id") 不等于 Symbol("id")

### 类型
```js
typeof Symbol() // "symbol"
```

### 不能与其他类型的值进行运算
```js
let sym = Symbol('My symbol');

"your symbol is " + sym // TypeError: can't convert symbol to string
`your symbol is ${sym}` // TypeError: can't convert symbol 
```

### 类型转换
1. 转换为字符串
   - toString()
   - String(Symbol())
   - symbol.description 显示描述（即 Symbol('foo') 中的 foo）
2. 转换为布尔值
   - Boolean(Symbol())
   - !Symbol()
   - if (Symbol()) { ... }

## how
### 作为属性名
由于每一个 Symbol 值都不相等，所以 Symbol 值可以作为标识符，用于对象的属性名。
```js
let mySymbol = Symbol();
// 第一种写法
let a = {};
a[mySymbol] = 'hi';

// 第二种写法
let a = {
   [mySymbol]: 'hi';
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'hi' });
```
- **Symbol 值作为对象属性名时，不能用点运算符。**  
- Symbol 值作为属性名，遍历对象的时候该属性不会被遍历
   > 但该属性还是公开属性，不是私有属性。    
   >- Object.getOwnPropertySymbols() 方法可以获取指定对象的所有 Symbol 名。  
   >- Object.assign() 中也会被复制。  
   >- Reflect.ownKeys()方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
### 定义常量
常量使用 Symbol 值最大的好处，就是其他任何值都不可能有相同的值了。依旧是保证唯一性。
```js
const COLOR_RED = Symbol();
const COLOR_PINK = Symbol();

function get(color) {
   switch (color) {
         case COLOR_RED:
            return COLOR_PINK;
         case COLOR_PINK:
            return COLOR_RED;
         default:
            throw new Error('Undefined');
   }
}
```
旧式的写法就是 case 'red': ...; case 'pink': ...; 与代码形成“强耦合”，不利于将来的修改和维护。




### 定义非私有但又只用于内部的方法
利用 以 Symbol 值作为键名，不会被常规方法遍历得到 这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
```js
let size = Symbol('size');
class Collection {
   constructor() {
         this[size] = 0;
   }
   add(item) {
         this[this[size]] = item;
         this[size]++;
   }
   static sizeOf(instance) {
         return instance[size]++;
   }
}
let x = new Collection();
Collection.sizeOf(x); // 0

x.add('foo');
Collection.sizeOf(x); // 1

Object.keys(x); // ['0']
Object.getOwnPropertyNames(x); // ['0']
Object.getOwnPropertySymbols(x); // [Symbol(size)]
```

### 使用场景
1. “隐藏” 对象属性。向“属于”另一个脚本或者库的对象添加一个属性，该属性将受到保护，防止被意外使用或重写。
2. 使用它们来改变一些内置行为。

## API
### Symbol.for(key)
重新使用同一个 Symbol 值
```js
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 Symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 Symbol
alert( id === idAgain ); // true
```
id 和 idAgain 都是 Symbol 值，但是它们都是由同样参数的Symbol.for方法生成的，所以实际上是同一个值。  
**Symbol.for()为 Symbol 值登记的名字，是全局环境的，不管有没有在全局环境运行。**
   > 利用全局登记特性可以在不同的 iframe 或者 service worker 中取到同一个值（iframe 窗口生成的 Symbol 值，可以在主页面得到）。

### Symbol.keyFor(sym)
返回一个已登记的 Symbol 类型值的key。
```js
// 通过 key 获取 Symbol
let s1 = Symbol.for("foo");
let s2 = Symbol("foo");

// 通过 Symbol 获取 key
Symbol.keyFor(s1) // "foo"
Symbol.keyFor(s2) // undefined
```
变量s2属于未登记的 Symbol 值，所以返回undefined。

### 系统（内置的 Symbol 值）
- Symbol.hasInstance
当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。
   > 静态方法 Symbol.hasInstance 中设置自定义逻辑。详见 Class类的相关笔记。

- Symbol.isConcatSpreadable
对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。

- Symbol.iterator
   > 专门用于使对象可迭代的内置 symbol，详见 Iterator 相关笔记。
- Symbol.toPrimitive
- Symbol.species
   > 给这个类添加一个特殊的静态 getter Symbol.species，内建方法将使用这个作为 constructor。详见 Class类的相关笔记。
- Symbol.toStringTag
   > 使用特殊的对象属性 Symbol.toStringTag 自定义对象的 toString 方法的行为。
- ... 
更多略


## why
1. 为什么需要创建“隐藏”属性？
- 使用 Symbol("id") 作为键代替字符串 "id"
   1. 外面（第三方）访问不到，安全
   2. 我们与第三方库都使用 id 也不会发生冲突

2. 为什么 Symbol 不能使用 new ？
生成的 Symbol 是一个原始类型的值，不是对象。由于 Symbol 的值不是对象，所以不能添加属性。（它是类似于字符串的数据类型）

3. 为什么 Symbol 值作为对象属性名时，不能使用点运算符？
```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```
点运算符后面总是字符串，所以不会读取 mySymbol 作为标识名所指代的值，导致 a 的属性名其实是字符串而不是 Symbol 值。  
使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。

4. What's the difference between Symbol.for() and Symbol() ?
两种写法都会生成新的 Symbol。区别是
- Symbol.for() 会被登记在全局环境中供搜索，后者不会。
- Symbol.for() 不会每次调用就返回一个新的 Symbol 类型的值，而是先检查 key 是否已经存在，不存在才会新建值。

## 总结
- Symbol() 可以转换为字符串、布尔值，但不能转为数值。
- Symbol 作为属性名，遍历对象的时候，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。

## more
[实例：模块的 Singleton 模式](https://es6.ruanyifeng.com/#docs/symbol)  
单例模式指的是调用一个类，任何时候返回的都是同一个实例。