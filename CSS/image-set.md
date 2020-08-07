### what & why
CSS新属性。可以用来根据不同设备的屏幕密度或者分辨率显示不同的背景图片（background-image）或者遮罩图片（mask-image）等。  
举例
```css
background-image: image-set(url(zxx.png) 1x, url(zxx-2x.png) 2x, url(zxx-print.png) 600dpi);
```
图片地址外面需要用url()包起来  
上面CSS代码的意思是：如果屏幕是一倍屏，也就是设备像素比是1的话，就使用zxx.png作为背景图片；如果屏幕是2倍屏及其以上，则使用zxx-2x.png这张图作为背景图；如果设备的分辨率大于600dpi，则使用zxx-print.png作为背景图。  
关于设备[像素比](https://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/)  
- dpi表示每英寸点数。屏幕通常每英寸包含72或96点，打印文档的dpi通常要大得多。所以，dpi值在600以上我们就可以认为是打印设备了。
- 1x，2x这里的x其实是dppx的别称，表示每像素单位的点数，也可以理解为屏幕密度。

### 参考
[我们一起学习CSS image-set()](https://www.zhangxinxu.com/wordpress/2019/11/css-image-set/)