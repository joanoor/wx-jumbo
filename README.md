## wx-jumbo（wx-summer升级）
一个小程序语法糖框架，基于Component，封装了全局混入的方法，涉及存储、时间、事件及一些常用的方法；

## 用法
1、安装
```$ npm i wx-jumbo -S```  
2、npm构建（微信开发工具中——构建npm）  
3、具体使用与Vue类似
```
const { xComponent } = require('wx-jumbo')

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

## 全局混入的方法（xComponent中可以直接this调用）
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

## 封装了wx.request请求

1、新建req.js文件
```
const { _axios } = require('wx-jumbo')

const service = _axios.create({
  baseURL:'基地址(换成你自己的)'
})

service.interceptors.request.use(config=>{
  // 根据需要，在header字段中添加所需内容
  config.header['Authorization'] = '-------------'  
  ......
  return config
})

module.exports = service
```
2、新建api.js文件
```
const service = require('./req.js')
const { inject } = require('wx-jumbo)

module.exports = function () {
  inject('sendSms',(phoneNumber)=>{
    const url = `/user/sendVerificationCode`
    return service.post(url, {
      "phone_number": phoneNumber
    })
  })
  ......
}
// 在页面中可以const res = await this.$sendSms(13366668888)这样使用
```
目前支持的访问类型：
| 类型 | 使用 |
|------|------|
| post | service.post |
| get | service.get |
| put | service.put |
| delete | service.remove |

## inject
全局注入方法，会自动添加$符号，全局可以使用this调用   
例如：  
1、上面注入接口的用法  
2、注入普通util方法  
新建utils.js文件
```
const { inject } = require('wx-jumbo')

module.exports = function () {
  inject('jumpTo', (url, obj) =>
  wx.navigateTo({
    url,
    events: obj
  }))
}
```

注意：*inject方法之后，还不能立即生效，需要在app.js中，引入执行，才能全局生效使用*
```
const { xComponent } = require('wx-jumbo')
const startInject = require('api.js')
const startInstall = require('utils.js')

startInject()
startInstall()

// 以上注入的jumoTo，sendSms才能生效
// 在下面的xComponent中可以直接this.$sendSms()、this.$jumpTo()这样调用
xComponent({
  data:{},
  created(){},
  mounted(){},
  methods(){},
  ......
})

```

## 附录
>v1.1.0：添加_axios网络请求，xComponents中使用方法与axios相似，直接  ```_axios.get(url,params)```，返回是一个promise，返回结果已对正确码200或0以及错误码进行了处理，不需要再重复判断  
