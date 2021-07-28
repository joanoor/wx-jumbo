/**
 * https://github.com/krasimir/EventBus
 * @constructor
 */

const EventBusClass = function () {
  this.listeners = {}
  // 统计所有 event 数量，方便添加 id
  this.count = 0
}

EventBusClass.prototype = {
  getGuid(type) {
    const _guid = `${type}${this.count}`
    this.count++
    return _guid
  },

  addEventListener(type, callback, scope) {
    console.log('Event 监听事件：', type)
    // 给对应事件分配一个 id
    callback._guid = this.getGuid(type)
    let args = []
    const numOfArgs = arguments.length
    for (let i = 0; i < numOfArgs; i++) {
      args.push(arguments[i])
    }
    args = args.length > 3 ? args.splice(3, args.length - 1) : []
    if (typeof this.listeners[type] !== 'undefined') {
      this.listeners[type].push({ scope, callback, args })
    } else {
      this.listeners[type] = [{ scope, callback, args }]
    }
  },

  removeEventListener(type) {
    if (typeof this.listeners[type] !== 'undefined') {
      this.listeners[type] = []
    }
  },

  removeSingleEventListener(type, callback, scope) {
    const currentType = this.listeners[type]
    if (currentType && scope) {
      const findIndex = currentType.findIndex(item => {
        return item.scope === scope
      })
      findIndex !== -1 && this.listeners[type].splice(findIndex, 1);
      return;
    }
    if (currentType) {
      const findIndex = currentType.findIndex(item => {
        return item.callback._guid === callback._guid
      })
      findIndex !== -1 && this.listeners[type].splice(findIndex, 1)
    }
  },

  hasEventListener(type, callback, scope) {
    if (typeof this.listeners[type] !== 'undefined') {
      const numOfCallbacks = this.listeners[type].length
      if (callback === undefined && scope === undefined) {
        return numOfCallbacks > 0
      }
      for (let i = 0; i < numOfCallbacks; i++) {
        const listener = this.listeners[type][i]
        if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
          return true
        }
      }
    }
    return false
  },
  dispatch(type, target) {
    console.log('Event 发布事件：', type, target)
    const event = {
      type,
      target
    }
    let args = []
    const numOfArgs = arguments.length
    for (let i = 0; i < numOfArgs; i++) {
      args.push(arguments[i])
    }
    args = args.length > 2 ? args.splice(2, args.length - 1) : []
    args = [event].concat(args)

    if (typeof this.listeners[type] !== 'undefined') {
      const listeners = this.listeners[type].slice()
      const numOfCallbacks = listeners.length
      for (let i = 0; i < numOfCallbacks; i++) {
        const listener = listeners[i]
        if (listener && listener.callback) {
          const concatArgs = args.concat(listener.args);
          listener.callback.apply(listener.scope, concatArgs)
        }
      }
    }
  },

  getEvents() {
    let str = ''
    for (const type in this.listeners) {
      const numOfCallbacks = this.listeners[type].length
      for (let i = 0; i < numOfCallbacks; i++) {
        const listener = this.listeners[type][i]
        str += listener.scope && listener.scope.className ? listener.scope.className : 'anonymous'
        str += ' listen for \'' + type + '\'\n'
      }
    }
    return str
  }
}

module.exports = new EventBusClass()
