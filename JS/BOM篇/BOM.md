### 弹窗

#### 窗口位置
screenLeft screenTop（screenX screenY）  
moveTo() moveBy() // 不适用框架，只能对最外层window对象使用
#### 窗口大小
innerWidth innerHeight outerWidth outerHeight
document.documentElement.clientWidth document.documentElement.clientHeight // 视口大小
resizeTo() resizeBy() // 不适用框架，只能对最外层window对象使用


只有在窗口是同源的时，窗口才能自由访问彼此的内容（相同的协议://domain:port）。[跨窗口通信]()

window.open / window.opener

### 跨窗口通信
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
