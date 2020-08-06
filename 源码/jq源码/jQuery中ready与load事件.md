### ready与load
jQuery有3种针对文档加载的方法
```js
$(document).ready(function() {
    // ...
})
```
```js
$(function() {
    // ... 上述代码的简写
})
```
```js
$(document).load(function() {
    // ...
})
```
> DOM文档加载的步骤
1. 解析HTML结构
2. 加载外部脚本和样式表文件
3. 解析并执行脚本代码
4. 构造HTML DOM模型。// ready
5. 加载图片等外部文件
6. 页面加载完毕。// load

ready和load的区别
- ready先执行，load后执行
- 越早处理DOM越好（ready），图片资源过多load事件就会迟迟不触发

### jQuery如何处理文档加载时机？
```js
jQuery.ready.promise = function (obj) {
    if (!readyList) {
        readyList = jQuery.Deferred();
        if (document.readyState === "complete") {
            setTimeout(jQuery.ready);
        } else {
            document.addEventListener("DOMContentLoaded", completed, false);
            window.addEventListener("load", completed, false);
        }
    }
    return readyList.promise(obj);
};
```
jQuery的ready是通过promise给包装过的，统一了回调体系。  
jQuery兼容的具体策略：针对高级的浏览器，用DOMContentLoaded事件省时省力。针对旧IE的处理方案
```js

```