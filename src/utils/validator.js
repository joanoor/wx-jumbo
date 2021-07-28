let validType = require('./validType')
const _ = require('./helper')

module.exports = function (formData, validConfig, customValidateType = {}) {
  // 合并自定义验证请求
  validType = Object.assign({}, validType, customValidateType)

  if (!formData || typeof formData !== 'object') {
    throw new Error('model 属性必须是一个 Object')
  }

  if (!validConfig || typeof validConfig !== 'object') {
    throw new Error('rules 属性必须是一个 Object')
  }

  const validPromise = _.paths(formData)
    .reduce((arr, key) => {
      let value = _.get(formData, `${key}`)
      if (value && typeof value === 'string') {
        if (value.trim) {
          value = value.trim()
        } else {
          value = value.replace(/(^\s*)|(\s*$)/g, '')
        }
      }

      // rules 配置项转化为标准的 . 访问，所有 [] 访问对象都转化一下
      validConfig = Object.keys(validConfig)
        .reduce((newObj, key) => {
          const standardPath = _.standardPath(key)
          if (!newObj[standardPath]) {
            const currentObj = {
              [standardPath]: validConfig[key]
            }
            return Object.assign(newObj, currentObj)
          }
        }, {})

      const configArr = validConfig[key]

      // 没有相关验证配置，则验证通过
      if (!configArr || !configArr.length) {
        return arr
      }

      // 是否有 required 配置
      const isRequired = configArr.filter(c => c.type === 'required').length > 0

      // * 使用 some 函数来提前终结函数执行，只需检测到一个错误即可退出
      configArr.some(config => {
        if (!config.type) {
          console.log(config)
          throw new Error('验证规则必须配置 type')
        }

        config.name = key
        // 如果没有值但是也没有 required 配置，则默认通过
        if (isRequired) {
          if (!validType.required(value)) {
            arr.push(Promise.resolve(config))
            return false
          }
        }

        if (value) {
          // 可代入函数进行校验，支持异步校验函数
          if (typeof validType[config.type] === 'function') {
            const validFn = validType[config.type]
            if (config.isAsync) {
              // 异步校验
              const asyncFn = validFn(value, formData)
                .then(flag => {
                  if (!flag) {
                    return config
                  }
                })
              arr.push(asyncFn)
              return false
            }
            if (!validFn(value, formData, config)) {
              arr.push(Promise.resolve(config))
              return false
            }

          } else if (config.type === 'regexp') {
            if (!config.pattern.test(value)) {
              arr.push(Promise.resolve(config))
              return false
            }
          } else {
            const typeFunc = validType[config.type]
            if (typeFunc && !typeFunc(value, formData)) {
              arr.push(Promise.resolve(config))
              return false
            }
          }
        }
      })

      return arr
    }, [])

  return Promise.all(validPromise).then((arr) => {
    return arr.filter(item => item !== void 0)
  })
}
