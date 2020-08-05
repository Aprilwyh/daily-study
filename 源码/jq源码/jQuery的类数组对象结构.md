### 为什么是类数组对象呢？
jQuery为什么能像数组一样操作，通过对象get方法或者直接通过下标0索引就能转成DOM对象？  
> 为了方便操作DOM，让节点与实例对象通过一个桥梁关联起来，jQuery内部就采用了一种叫“类数组对象”的方式作为存储结构。  
所以我们即可以像对象一样处理jQuery操作，也能像数组一样可以使用sort、each等类数组的方法操作jQuery对象
### jQuery对象可用数组下标索引是什么原理？
简单的模拟一个通过$(".Class")构建的对象的数据结构
```js
var aQuery = function (selector) {
    if (!(this instanceof aQuery)) { // 第一次this是window
        return new aQuery(selector); // 通过new创建一个新的aQuery对象
    }
    // ^代表的是以什么开头，[]代表包含的内容，[^]则代表不包含的内容。返回的是除了#之外的内容，因为是数组，所有要使用[0]来获取
    var elem = document.getElementById(/[^#].*/.exec(selector)[0]);
    this.length = 1;
    this[0] = elem;
    this.context = document;
    this.selector = selector;
    this.get = function (num) {
        return this[num];
    }
    return this; // 最后获得‘加工’后的this对象
}

$('#show1').append(aQuery("#book")[0]);
$('#show2').append(aQuery("#book").get(0));
```
以上是模拟jQuery的对象结构，通过aQuery方法抽象出了对象创建的具体过程，这也是软件工程领域中的广为人知的设计模式-工厂方法。  

- 函数aQuery()内部首先保证了必须是通过new操作符构建。这样就能保证当前构建的是一个带有this的实例对象
- 既然是对象我们可以把所有的属性与方法作为对象的key与value的方式给映射到this上  
所以如上结构就可以模拟出jQuery的这样的操作了，即可通过索引取值，也可以链式方法取值  

**这种结构的缺陷**
每次调用ajQuery方法等于是创建了一个新的实例，那么类似get方法就要在每一个实例上重新创建一遍，性能就大打折扣。  

所以jQuery在结构上的优化不仅仅只是我们看到的，除了实现类数组结构、方法的原型共享，而且还实现了方法的静态与实例的共存。后续说明