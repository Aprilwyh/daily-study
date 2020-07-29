### 写在前面
为了让浏览器能够正确解析，需要使用webpack将我们的源代码进行打包
### 1. 创建webpack配置文件
根目录下创建webpack配置文件 webpack.config.js 编写最基本的配置
```js
// 导入path模块
const path = require('path')

module.exports = {
  // 打包入口
  enter: './src/main.js',
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