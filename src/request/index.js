const _axios = function () {
  this.baseURL = ''
  this.config = {}
}

_axios.prototype = {
  create({ baseURL }) {
    const that = this
    this.baseURL = baseURL
    this.config = {
      header: {}
    }
    this.interceptors = {
      request: {
        use(callback) {
          that.config = callback.call(that, that.config)
        }
      }
    }
    return this
  },

  service(url, params) {
    const tmpUrlArr = url.split("/")
    if (!tmpUrlArr.every(v => v)) { // 处理以/开头的api路径
      tmpUrlArr.splice(0, 1)
    }
    url = tmpUrlArr.join('/')
    return new Promise((resolve, reject) => {
      const options = Object.assign({}, {
        url: `${this.baseURL}/${url}`,
        method: params.method,
        data: params.method,
        success: res => resolve(res),
        fail: error => reject(error)
      }, this.config)
      wx.request(options)
    })
  },
  get(url, options = {}) {
    return this.service(url, {
      method: 'GET',
      data: options
    })
  },

  post(url, options) {
    return this.service(url, {
      method: 'POST',
      data: options
    })
  },

  put(url, options) {
    return this.service(url, {
      method: 'PUT',
      data: options
    })
  },

  // 不能声明DELETE（关键字）
  remove(url, options) {
    return service(url, {
      method: 'DELETE',
      data: options
    })
  }
}

module.exports = new _axios()