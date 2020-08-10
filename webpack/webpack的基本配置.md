### 写在前面
为了让浏览器能够正确解析，需要使用webpack将我们的源代码进行打包
### 1. 创建webpack配置文件
根目录下创建webpack配置文件 webpack.config.js 编写最基本的配置
```js
// 导入path模块
const path = require('path')

module.exports = {
  // 打包入口
  entry: './src/main.js',
  // 打包出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```
### 2. 编写webpack脚本
npx webpack命令指定访问局部webpack，但一般不这么做。  
一般做法是在package.json文件中编写脚本
```js
"scripts": {
    "build": "webpack"
  },
```
可以使用npm run build指令  
webpack只能打包js文件，对于后缀名为vue的文件不能打包。要通过vue-loader来打包vue文件  
```js
module.exports = {
  // ...
  // 打包规则
  module: {
    rules: [{
      test: /\.vue$/, // 正则匹配.vue后缀名文件
      loader: 'vue-loader' // 匹配到了.vue文件就用vue-loader进行打包
    }]
  }
}
```
从vue-loader@15版本开始，需要在webpack中添加一个插件
```js
// 引入vue-loader的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // ...
  // 插件
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

### 3. 打包
**npm run build**进行打包，左侧目录结构中生成dist文件夹，其中包含bundle.js打包文件。  
打包过程中会产生警告  
> WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

这是因为没有指定打包模式，需要添加配置
```js
module.exports = {
  mode: 'production', // 生产环境
  // mode: 'development', // 开发环境
}
```
上述两种模式的区别
- 生产环境： 打包文件大小较小，打包文件中去除无用空格等，对代码进行了压缩，不方便阅读。
- 开发环境： 打包文件大小较大，打包文件可读，开发时使用此种模式。

### 4. 测试
index.html引入bundle.js进行测试，会发现浏览器报错
> vue.runtime.esm.js:620 [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
(found in <Root>)  

原因是因为Vue打包生成三个文件
- runtime only 的文件 vue.common.js // 默认
- compiler only 的文件 compiler.js
- runtime + compiler 的文件 vue.js
在webpack中添加别名的配置
```js
module.exports = {
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js' // 导入vue的时候其实导入的是vue下的dist中的vue.js
    }
  }
}
```

### 5. 其他loader的配置
这里以file-loader为例
```js
module.exports = {
  // ...
  // 打包规则 中添加
  module: {
    rules: [{
      // ...
    }, {
      test: /\.(jpg|jpeg|png|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]' // 命名规则：原文件名.原文件后缀。详细见官网
      }
    }]
  }
}
```

### 6. 打包css文件
webpack通过css-loader和style-loader来打包css文件  
npm install -D style-loader
```js
// 打包规则
module: {
  rules: [
  // ...
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'] // 依赖多个loader就要使用use，值为数组，顺序有讲究
  }]
},
```
注意：执行顺序是从右到左，从下到上

### 小结
- webpack本身只能打包js文件，如果要打包其他文件就需要借助于loader
- loader是专门用于打包特定文件的处理程序