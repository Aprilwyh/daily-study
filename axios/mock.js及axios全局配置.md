### Mock.js
生成随机数据，拦截 ajax 请求  
cnpm install mockjs  
src 目录下新建 mock 文件夹
#### /mock/home.js
```js
import Mock from 'mockjs'

export default {
  getHomeData: () => {
    return {
      code: 20000,
      data: { /* ... */ }
    }
  }
}
```

#### /mock/index.js
```js
import Mock from 'mockjs'
import homeApi from './home'

// 设置延时请求数据
Mock.setup({
  timeout: '200-2000'
})

// 首页相关
Mock.mock(/\/home\/getData/, 'get', homeApi.getHomeData)
```

#### main.js
import './mock'

#### Home.vue
```js
mounted() {
  this.$http.get('/home/getData').then(res => {
    console.log(res.data)
  })
}
```

### axios
src 目录下新建 api （统一存放接口）  
src/api/config.js
```js
import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  // 请求超时时间
  timeout: 3000
})
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    console.log(err)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    let res = {}
    res.status = response.status
    res.data = response.data
    return res
  },
  err => console.log(err)
)

export default service
```