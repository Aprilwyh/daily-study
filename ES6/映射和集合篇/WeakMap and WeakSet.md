what why how more
## 写在前面
使用对象作为常规 Map 的键，那么当 Map 存在时，该对象也将存在。它会占用内存，并且应该不会被（垃圾回收机制）回收。

### WeakMap
#### what
WeakMap 与 Map 的区别
- WeakMap 的键必须是对象，不能是原始值
- 使用一个对象作为键，并且没有其他对这个对象的引用，WeakMap：从内存中删除。Map：可以使用 map.keys() 来获取对象
- WeakMap 不支持迭代以及 keys()，values() 和 entries() 方法。所以没有办法获取 WeakMap 的所有键或值。

#### why
1. 主要应用场景是 额外数据的存储。  
假如我们正在处理一个“属于”另一个代码的一个对象，也可能是第三方库，并想存储一些与之相关的数据，那么这些数据就应该与这个对象共存亡
```js
weakMap.set(john, "secret documents");
// 如果 john 消失，secret documents 将会被自动清除
```
2. 缓存。当对象被垃圾回收时，对应的缓存的结果也会被自动地从内存中清除。（Map 不会，但优点是可以读取缓存）
#### how
当一个用户离开时（该用户对象将被垃圾回收机制回收），这时我们就不再需要他的访问次数了。

## WeakSet
### what
#### 创建
const ws = new WeakSet();

#### 传值
WeakSet 可以接受一个数组或类似数组的对象作为参数。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```
是a数组的成员成为 WeakSet 的成员，而不是a数组本身

#### WeakSet 的方法
- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
```js
const ws = new WeakSet();
const foo = {};

ws.add(window);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window);    // false
```

### how
1. 储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

2. 
```js
const foos = new WeakSet()
class Foo {
    constructor() {
        foos.add(this)
    }
    method() {
        if (!foos.has(this)) {
            throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
        }
    }
}
```
foos对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑foos，也不会出现内存泄漏。

### why
1. WeakSet 和 Set 的区别？
- 只能向 WeakSet 添加对象（而不能是原始值）
- WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
- 不支持 size 和 keys()，并且不可迭代
> 由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

### more
可以将用户添加到 WeakSet 中，以追踪访问过我们网站的用户