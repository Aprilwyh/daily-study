class Stack {
  constructor() { 
    this.items = []
  }
  push(element) { 
    this.items.push(element)
  }
  pop() { 
    return this.items.pop() // this.items.pop() 是栈顶第一个元素
  }
  peek() { 
    return this.items[this.items.length - 1]
  }
  isEmpty() { 
    return this.items.length === 0
  }
  clear() { 
    this.items = []
  }
  size() { 
    return this.items.length
  }
  getItems() { 
    return this.items
  }
}

// ES5 实现
var _Stack = function () { 
  var _items = [] // 私有
  this._items = [] // 公有
  this.push = function (element) { 
    _items.push(element)
  }
  this.pop = function () { 
    return _items.pop()
  }
  this.peek = function () { 
    return _items[_items.length - 1]
  }
  this.isEmpty = function () { 
    return _items.length === 0
  }
  this.clear = function () { 
    _items = []
  }
  this.size = function () { 
    return _items.length
  }
  this.getItems = function () { 
    return _items
  }
}

// 用栈解决问题之 十进制转换二进制
