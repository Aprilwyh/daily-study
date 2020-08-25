what why how more
### 写在前面
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

### WeakSet
#### what
与 Set 类似，但是
- 只能向 WeakSet 添加对象（而不能是原始值）
- 不支持 size 和 keys()，并且不可迭代
#### why
可以将用户添加到 WeakSet 中，以追踪访问过我们网站的用户