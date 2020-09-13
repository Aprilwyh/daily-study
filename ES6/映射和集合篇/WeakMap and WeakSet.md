what why how more
## 写在前面
使用对象作为常规 Map 的键，那么当 Map 存在时，该对象也将存在。它会占用内存，并且应该不会被（垃圾回收机制）回收。

## WeakMap
### what
#### 只接受对象作为键名（null除外）
```js
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

#### 不计入垃圾回收机制,有助于防止内存泄漏
键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。  

**注意：**WeakMap 弱引用的只是键名，而不是键值。即使在 WeakMap 外部消除了obj的引用，WeakMap 内部的引用依然存在。

#### WeakMap 的属性和方法
- 没有遍历操作（即不支持迭代以及keys()、values()和entries()方法）
- 没有size属性。
- 不支持clear方法

> 因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。

因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。

### why
1. WeakMap 与 Map 的区别？
- WeakMap 的键必须是对象（null 除外），不能是原始值
- 使用一个对象作为键，并且没有其他对这个对象的引用，WeakMap：从内存中删除。Map：可以使用 map.keys() 来获取对象
- WeakMap的键名所指向的对象，不计入垃圾回收机制
- WeakMap 不支持迭代以及 keys()，values() 和 entries() 方法，也没有size属性。所以没有办法获取 WeakMap 的所有键或值。

### how
#### 应用场景1 DOM 节点作为键名
```js
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0})
;

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);
```
document.getElementById('logo')是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是这个节点对象。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

#### 应用场景2 额外数据的存储
假如我们正在处理一个“属于”另一个代码的一个对象，也可能是第三方库，并想存储一些与之相关的数据，那么这些数据就应该与这个对象共存亡
```js
weakMap.set(john, "secret documents");
// 如果 john 消失，secret documents 将会被自动清除
```

#### 应用场景3 部署私有属性
类的内部属性，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。

#### 应用场景4 缓存
当对象被垃圾回收时，对应的缓存的结果也会被自动地从内存中清除。（Map 不会，但优点是可以读取缓存）

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