## wx-jumbo（wx-summer升级）
一个小程序Component框架，通过引入wx-kale，封装了混入、存储、时间、事件和一些常用的方法；

## 使用方法
具体使用与Vue类似
```
import xComponent from 'wx-jumbo'

xComponent({
  props:{},
  mixins:[],
  data:{},
  beforeCreate(){},
  created(){},
  mounted(){},
  destroyed(){},
  relations:{},
  watch:{},
  classes:[],       // 外部样式类
  storeBindings:{}  // mobx状态管理
})
```

## 全局混入的方法（在每个xComponent中可以直接this.调用）
| 方法名称 | 说明 |  
|---------|-------|
| $emit | emit事件 |
| $set | setData的promise写法 |
| $getRect | boundingClientRect的promise写法 |
| $setItem | 储存 |
| $getItem | 获取存储 |
| $deleteItem | 删除指定存储数据 |
| clearItem | 清空存储数据 |
| $addEventListener | 添加事件监听 |
| $removeEventListener | 移除事件监听 |
| $dispatch | 发布事件 |
| $debounce | 防抖 |
| $throttle | 节流 |
| $generateGUID | 生成n位唯一的GUID |
| $deepClone | 深拷贝 |
| $hideIdCard | 身份证号码或者手机号码脱敏 |
