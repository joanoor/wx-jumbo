const dayjs = require( './dayjs/index' )    // dayjs轻量级处理时间
const Event = require( './event/index' )    // 时间
const Storage = require( './storage/index' )      // 小程序的本地存储
const utils = require( './utils/index' )      // 一些常用方法
// const Libs = Object.assign( { Event, Map, Storage } )

const kale = Object.assign( {}, utils, {
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
  getRect: function ( selector = '', all = false ) {
    return new Promise( ( resolve ) => {
      wx.createSelectorQuery()
        .in( this )
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
  /* 封装存储对象 */
  setItem: function ( key, value, expiration ) {
    Storage.setStorageSync( key, value, expiration )
  },
  /* 封装获取存储对象 */
  getItem: function ( key ) {
    Storage.getStorageSync( key )
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

let methodObj = {}

function getBaseBehavior () {
  let obj = Object.assign( {}, kale )
  methodObj = Object.keys( obj ).reduce( ( acc, cur ) => {
    acc = Object.assign( acc, { [ `$${ cur }` ]: obj[ cur ] } )
  }, {} )
  return Behavior( {
    methods: methodObj
  } )
}

exports.methodObj = methodObj
exports.inject = function ( funcname, f ) {
  methodObj[ `$${ funcname }` ] = f
}
exports.dayjs = dayjs
exports.baseBehavior= getBaseBehavior()