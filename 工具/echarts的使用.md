### 需要引入 Echarts 的组件
```html
<echart style="height:280px" :chartData="echartData.order"></echart>
```
```js
import Echart from '../../components/Echart'

components: {
  Echart
},
data() {
  return {
    // Echarts 数据
    echartData: {
      order: {
        xData: [],
        series: []
      }
      // ...
    }
  }
},
methods: {
  getTableData() {
    this.$http.get('/home/getData').then(res => {
      const order = res.data.data.orderData
      this.echartData.order.xData = order.data
      let keyArray = Object.keys(order.data[0])
      keyArray.forEach(key => {
        this.echartData.order.series.push({
          name: key,
          data: order.data.map(item => item[key]),
          type: 'line' // 折线图
        })
      })
    })
  }
},
created() {
  this.getTableData()
}
```

### 封装的 Echarts 组件
```html
  <div style="height: 100%" ref="echart"></div>
```
```js
import echarts from 'echarts'
export default {
  props: {
    // 指定图表的配置项和数据
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      }
    },
    // 有横纵坐标的图表
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    }
  },
  watch: {
    // chartData 改变就重新初始化图表
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
    }
  },
  data() {
    return {
      echart: null,
      axisOption: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      }, // 有坐标轴
      normalOption: {
        series: []
      } // 无坐标轴
    }
  },
  methods: {
    // 初始化
    initChart() {
      this.initChartData() // 渲染数据
      // 初始化图表
      if (this.echart) {
        this.echart.setOption(this.options)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options)
      }
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        console.log('normal')
      }
    }
  }
}
```

### Echarts 自适应
#### 浏览器窗口大小改变
官网 API 中的 resize 方法
```js
methods: {
  resizeChart() {
      this.echart ? this.echart.resize() : ''
    }
},
mounted() {
  window.addEventListener('resize', this.resizeChart)
},
destroyed() {
  // 避免内存泄漏
  window.removeEventListener('resize', this.resizeChart)
}
```

#### 收缩左侧导航栏
```js
computed: {
  isCollapse() {
    return this.$store.state.tab.isCollapse
  }
},
watch: {
  isCollapse() {
    setTimeout(() => {
      this.resizeChart() // 见上
    }, 300)
  }
}
```



### more
详见后台管理系统中的 Echart.vue 和 Home.vue 组件