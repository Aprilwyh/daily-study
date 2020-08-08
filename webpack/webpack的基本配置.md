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
npm run build 进行打包，左侧目录结构中生成dist文件夹，其中包含bundle.js打包文件。  