## what
Reflect 是一个内建对象，可简化 Proxy 的创建。

| 操作 | Reflect 调用 |	内部方法 |
| - | - | - |
| obj[prop] | Reflect.get(obj, prop) | \[[Get]] |
| obj[prop] = value | Reflect.set(obj, prop, value) | \[[Set]] |
| delete obj[prop] | Reflect.deleteProperty(obj, prop) | \[[Delete]] |
| new F(value) | Reflect.construct(F, value) | \[[Construct]] |
| … | … | … |

**对于每个可被 Proxy 捕获的内部方法，在 Reflect 中都有一个对应的方法，其名称和参数与 Proxy 陷阱相同。**

### 读取属性的 Reflect.get(target, prop, receiver) 和 target[prop]
```js
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  }
});

let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

// 期望输出：Admin
alert(admin.name); // 输出：Guest
```
1. 读取 admin.name 时，由于 admin 对象自身没有对应的的属性，搜索将转到其原型。
2. 原型是 userProxy。
3. 从代理读取 name 属性时，get 陷阱会被触发，并从原始对象返回 target[prop] 属性，在 (*) 行。  
当调用 target[prop] 时，若 prop 是一个 getter，它将在 this=target 上下文中运行其代码。因此，结果是来自原始对象 target 的 this._name，即来自 user。  
如何把上下文传递给 getter？对于一个常规函数，我们可以使用 call/apply，但这是一个 getter，它不能“被调用”，只能被访问。
```js
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) { // receiver = admin
    return Reflect.get(target, prop, receiver); // (*)
  }
});


let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

alert(admin.name); // Admin
```
receiver 保留了对正确 this 的引用（即 admin），该引用是在 (*) 行中被通过 Reflect.get 传递给 getter 的。  
可以直接写成 `return Reflect.get(...arguments);`