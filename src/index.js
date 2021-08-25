const dayjs = require( './dayjs' )    // dayjs轻量级处理时间
const Event = require( './event' )    // 时间
const Storage = require( './storage' )      // 小程序的本地存储
const service = require( './request' )
const utils = require( './utils' )      // 一些常用方法

const kale = Object.assign( {}, {
  /* 封装triggerEvent */
  emit: function ( ...args ) {
    this.triggerEvent( ...args )
  },
  /* 封装setData */
  set: function ( data = {}, callback = () => { } ) {
    this.setData( data, callback );
    return new Promise( ( resolve ) => wx.nextTick( resolve ) )
  },
  /* 封装boundingClientRect */
  getRect: function ( selector = '', iscom = false, that = this, all = false ) {
    return new Promise( ( resolve ) => {
      let _that = wx
      if ( iscom ) {
        _that = this
      }
      _that.createSelectorQuery()
        .in( that )
      [ all ? 'selectAll' : 'select' ]( selector )
        .boundingClientRect( ( rect ) => {
          if ( all && Array.isArray( rect ) && rect.length ) {
            resolve( rect );
          }
          if ( !all && rect ) {
            resolve( rect );
          }
        } )
        .exec()
    } )
  },
} )

const yoyo = Object.assign( {}, utils, {
  /* 封装存储对象 */
  setItem: function ( key, value, expiration ) {
    Storage.setStorageSync( key, value, expiration )
  },
  /* 封装获取存储对象 */
  getItem: function ( key ) {
    return Storage.getStorageSync( key )
  },
  /* 封装删除指定存储对象 */
  deleteItem: function ( key ) {
    Storage.removeStorageSync( key )
  },
  /* 封装清空存储对象 */
  clearItem: function () {
    Storage.clearStorageSync()
  },
  /* 添加事件监听 */
  addEventListener: function ( type, callback, scope ) {
    Event.addEventListener( type, callback, scope )
  },
  /* 移除事件监听 */
  removeEventListener: function ( type ) {
    Event.removeEventListener( type )
  },
  /* 发布事件 */
  dispatch: function ( type, target ) {
    Event.dispatch( type, target )
  }
} )

function getBaseBehavior ( apiMap ) {
  const newKale = Object.assign( {}, kale, apiMap )
  const methodObj = Object.keys( newKale ).reduce( ( acc, cur ) => {
    acc = Object.assign( acc, { [ `$${ cur }` ]: newKale[ cur ] } )
    return acc
  }, {} )
  return Behavior( {
    methods: methodObj
  } )
}

function awaitWrap ( promise ) {
  return promise
    .then( ( res ) => ( { success: res, error: null } ) )
    .catch( ( err ) => ( { success: null, error: err } ) )
}

/**
 * 小程序封装方法，使用inject，全局混入
 * @param {string} funcname 
 * @param {func} func 
 */
const inject = async ( funcname, func, ...successCodes ) => {
  if ( [ 'promise', 'function' ].indexOf( utils.getTypeOfValue( func ) ) !== -1 ) {
    let resultFunc = ''
    if ( utils.getTypeOfValue( func ) === 'promise' ) {
      resultFunc = async ( ...funcParams ) => {
        if ( !successCodes || successCodes.length === 0 ) {
          successCodes = [ 200, 0 ]
        } else {
          successCodes = [ ...successCodes ]
        }
        const { success, error } = await awaitWrap( func( ...funcParams ) )
        if ( error !== null ) {
          console.log( 'Oh......, 出错了!', error )
          return {
            data: null,
          }
        } else {
          const { code = 200, message = '' } = success
          if ( successCodes.indexOf( code ) > -1 ) {
            return success
          } else {
            console.log( `返回数据报错---->${ code }---->${ message }` )
          }
        }
      }
    } else if ( utils.getTypeOfValue( func ) === 'function' ) {
      resultFunc = func
    }
    yoyo[ `${ funcname }` ] = resultFunc
  } else {
    console.log( '检测到不支持的注入的格式，跳过注入' )
  }
}


module.exports = {
  baseBehavior: getBaseBehavior,
  inject,
  _axios: service,
  dayjs,
  yoyo
}