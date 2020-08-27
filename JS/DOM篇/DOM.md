### DOM常用的节点属性
parentNode	获取当前节点的父节点
childNodes	获取当前节点的子节点集合
firstChild	获取当前节点的第一个子节点
lastChild	获取当前节点的最后一个子节点
previousSibling	获取当前节点的前一个兄弟节点
nextSibling	获取当前节点的后一个兄弟节点
attributes	元素的属性列表
#### 元素节点
不包含文本节点或注释节点（document 不是一个元素节点）  
children    仅那些作为元素节点的子代的节点。  
firstElementChild，lastElementChild 第一个和最后一个子元素。  
previousElementSibling，nextElementSibling  兄弟元素。  
parentElement   父元素。  
以上节点集合（类数组）使用for...of遍历（不用for...in）

### DOM节点操作
1. 创建节点
```js
var e = document.createElement("元素名");       //创建元素节点
var t = document.createTextNode("元素内容");  //创建文本节点
e.appendChild(t);                               //把元素内容插入元素中去
```
2. 插入节点
```js
obj.appendChild(new);
// ref指定一个节点，在这个节点前插入新的节点。
obj.insertBefore(new,ref);
```
3. 删除节点
```js
obj.removeChild(oldChild);
```
4. 复制节点
```js
obj.cloneNode(bool)
```
参数obj表示被复制的节点，而参数bool是一个布尔值，取值如下：
（1）1或true：表示复制节点本身以及复制该节点下的所有子节点；
（2）0或false：表示仅仅复制节点本身，不复制该节点下的子节点；
5. 替换节点
```js
obj.replaceChild(new,old)
```
6. 选择节点
getElement*，querySelector*  
elem.querySelector(css) 调用会返回给定 CSS 选择器的第一个元素。