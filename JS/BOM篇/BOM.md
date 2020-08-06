### 弹窗

#### 窗口位置
screenLeft screenTop（screenX screenY）  
moveTo() moveBy() // 不适用框架，只能对最外层window对象使用
#### 窗口大小
window.innerWidth/innerHeight（包括了滚动条）/ outerWidth outerHeight  

document.documentElement.clientWidth/clientHeight // 视口大小（不包含滚动条）  

resizeTo() resizeBy() // 不适用框架，只能对最外层window对象使用  

documentElement.scrollWidth/scrollHeight 测量文档的完整大小  
但是在该元素上，对于整个文档，这些属性均无法正常工作。  
为了可靠地获得完整的文档高度（包括滚动出去的部分），我们应该采用以下这些属性的最大值：
```js
let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);
```
#### 窗口滚动
特殊方法 window.scrollBy(x,y) 和 window.scrollTo(pageX,pageY)  
elem.scrollIntoView(true / false) true顶部 false底部  
禁止滚动 document.body.style.overflow = "hidden"
##### 获得当前滚动
DOM 元素的当前滚动状态在 elem.scrollLeft/scrollTop 中，但存在兼容问题（较旧的浏览器不行）  
针对这个问题，只需记住以下，因为滚动在 window.pageXOffset/pageYOffset 中都可用  
window.pageXOffset/pageXOffset（只读）
#### 打开窗口
window.open() window.close()
#### 窗口弹窗访问
只有在窗口是同源的时，窗口才能自由访问彼此的内容（相同的协议://domain:port）。[跨窗口通信](#diff)  
window.open() 从窗口访问弹窗 / window.opener() 从弹窗访问窗口
#### 弹窗的聚焦、失焦
window.focus() 和 window.blur()
### <span id="diff">跨窗口通信</span>
两个具有不同域的 URL 具有不同的源。  
获取iframe子元素  
- iframe.contentWindow 来获取 <iframe> 中的 window。  
- iframe.contentDocument 来获取 <iframe> 中的 document，是 iframe.contentWindow.document 的简写形式。  
获取iframe的window对象
通过索引获取：window.frames[0] —— 文档中的第一个 iframe 的 window 对象。
通过名称获取：window.frames.iframeName —— 获取 name="iframeName" 的 iframe 的 window 对象。

#### 相同二级域
如果窗口的二级域相同，例如 john.site.com，peter.site.com 和 site.com（它们共同的二级域是 site.com），我们可以使浏览器忽略该差异，使得它们可以被作为“同源”的来对待，以便进行跨窗口通信。
```js
document.domain = 'site.com'; // 每个窗口都执行这行代码
```


### 总结
window对象是BOM的核心，window对象指当前的浏览器窗口。window对象的方法
- open() close()
- setTimeout() clearTimeout() setInterval() clearInterval()
- alert() confirm() prompt()

### 参考
[Window 大小和滚动](https://zh.javascript.info/size-and-scroll-window)
[弹窗和 window 的方法](https://zh.javascript.info/popup-windows)