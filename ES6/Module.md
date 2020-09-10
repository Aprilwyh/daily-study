## what
随着我们的应用越来越大，我们想要将其拆分成多个文件，即所谓的“模块（module）”。一个模块（module）就是一个文件。  
列举几个模块加载方案：AMD（用于浏览器）、CommonJS（用于服务器）、UMD  

### 模块始终默认使用 use strict
```html
<script type="module">
  a = 5; // error
</script>
```
ES6 模块之中，顶层的this指向undefined，即不应该在顶层代码使用this。

### export
export 关键字标记了可以从当前模块外部访问的变量和函数。  
export命令除了输出变量，还可以输出函数或类（class）。  
```js
// 导出一
export function method() {}

// 导出二
function method() {}
export { method }
```
二者等价，但第二种方式在脚本尾部，一眼看清楚输出了哪些变量。  
```js
// 导出三
// 将 export default 放在要导出的实体前,将其导入不需要花括号
// 每个文件最多只能有一个默认的导出
export default class User {}
import User from './user.js'; // 另一个文件中导入
```
export输出的变量就是本来的名字，但是可以使用as关键字重命名。
```js
// 导出四 （三的变体）
class User {}
export { User as default };

import { default as person } from ''; // 如此导入也是有效的
```

### import
import 关键字允许从其他模块导入功能。
```js
// 导入一
import { user } from '';
```
可以使用 as 让导入具有不同的名字
```js
// 导入二
import {sayHi as hi, sayBye as bye} from './say.js';
```
#### import命令输入的变量都是只读的
不可以 `sayHi = {};`
#### import命令具有提升效果，会提升到整个模块的头部，首先执行
#### import是静态执行，所以不能使用表达式和变量
#### import语句会执行所加载的模块
`import 'lodash';`（仅仅执行lodash模块，但是不输入任何值）  
#### 多次重复执行同一句import语句，那么只会执行一次
#### import语句是 Singleton 模式
```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

### 动态导入 import(module) 表达式
import(module) 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块对象。  
import() 不是函数，只是一种特殊语法。
```js
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)
```
异步函数中，我们可以使用 `let module = await import(modulePath)。`（如果有默认导出还可以 module.default）
#### 适用场景
1. 按需加载
import()方法放在click事件的监听函数之中，只有用户点击了按钮，才会加载这个模块。
2. 条件加载
import()可以放在if代码块，根据不同的情况，加载不同的模块。
3. 动态的模块路径
import()允许模块路径动态生成，根据函数的返回结果，加载不同的模块。

### 模块的继承

### 跨模块常量

### 模块级作用域
每个模块都有自己的顶级作用域（top-level scope）。一个模块中的顶级作用域变量和函数在其他脚本中是不可见的。

### 模块代码仅在第一次导入时被解析
模块只被执行一次。生成导出，然后它被分享给所有对其的导入，所以如果某个地方修改了它，其他的模块也能看到这个修改。

### import.meta
import.meta 对象包含关于当前模块的信息。（import.meta.url之类的..）

### 模块脚本是延迟的
模块脚本总是被延迟的，与 defer 特性对外部脚本和内联脚本的影响相同。
- 下载外部模块脚本 `<script type="module" src="...">` 不会阻塞 HTML 的处理，它们会与其他资源并行加载。
- 模块脚本会等到 HTML 文档完全准备就绪（即使它们很小并且比 HTML 加载速度更快），然后才会运行。
- 保持脚本的相对顺序：在文档中排在前面的脚本先执行。

模块脚本是被延迟的，所以要等到 HTML 文档被处理完成才会执行它（常规脚本则会立即运行）

### 不允许裸模块（“bare” module）
import 必须给出相对或绝对的 URL 路径。没有任何路径的模块被称为“裸（bare）”模块。


具有 defer 特性的脚本不会阻塞页面。
具有 defer 特性的脚本总是要等到 DOM 解析完毕，但在 DOMContentLoaded 事件之前执行。
`<script defer src="">`

    
| | 顺序 | DOMContentLoaded |
| - | - | - |
| async | 加载优先顺序。脚本在文档中的顺序不重要 —— 先加载完成先执行 | 不相关。可能在文档加载完成前加载并执行完毕。如果脚本很小或者来自于缓存，同时文档足够长，就会发生这种情况。 |
| defer | 文档顺序（它们在文档中的顺序） | 在文档加载和解析完成之后（如果需要，则会等待），即在 DOMContentLoaded 之前执行。|

## why
1. 模块与常规脚本的区别？
- 默认是延迟解析的（deferred）。
- Async 可用于内联脚本。
- 要从另一个源（域/协议/端口）加载外部脚本，需要 CORS header。
- 重复的外部脚本会被忽略

2. `import * as <obj>` 可以导入所有为什么还要用 import {}？
- 现代的构建工具（webpack 和其他工具）将模块打包到一起并对其进行优化，以加快加载速度并删除未使用的代码。如果我们只在我们的项目里使用了其中的一个函数，优化器（optimizer）就会检测到它，并从打包好的代码中删除那些未被使用的函数，从而使构建更小。这就是所谓的“摇树（tree-shaking）”。
- 明确列出要导入的内容会使得名称较短：method() 而不是 obj.method()。
- 导入的显式列表可以更好地概述代码结构：使用的内容和位置。它使得代码支持重构，并且重构起来更容易。

3. export 和 export default
|  | 导出 | 导入 |
| - | - | - |
| 命名的 | export class User {...} | import {User} from ... |
| 默认的 | export default class User {...} | import User from ... |