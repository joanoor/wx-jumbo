const { observable, action } =require("mobx-miniprogram")
const { getTypeOfValue } = require( '../utils' )

/**
 * 创建mobx store
 */
class createMobxStore {
  constructor ( option ) {
    if ( getTypeOfValue( option ) !== 'object' ) {
      throw new Error( '传入类型错误' )
    }
    const optKeys = Object.keys( option )
    optKeys.forEach( v => {
      if ( getTypeOfValue( option[ v ] ) === 'object' ) {
        this[ v ] = option[ v ]
      }
    } )
    return this.initMobxStore()
  }
  initMobxStore () {
    let opt = {}
    if ( this.state ) {
      opt = Object.assign( {}, opt, this.state )
    }
    if ( this.actions ) {
      const actions = Object.keys( this.actions ).map( v => {
        return {
          [ v ]: action( this.actions[ v ] )
        }
      } )
      opt = Object.assign( {}, opt, ...actions )
    }
    return observable( opt )
  }
}

/* *******************这是分割线******************* */

function expendStates ( store, arr ) {
  return arr.reduce( ( acc, cur ) => {
    if ( !acc[ cur ] ) acc[ cur ] = () => store[ cur ]
    return acc
  }, {} )
}

function expendActions ( store ) {
  const keysArr = Object.keys( store )
  keysArr.reduce( ( acc, cur ) => {
    if ( getTypeOfValue( cur ) === 'function' ) {
      if ( !acc[ cur ] ) acc[ cur ] = cur
      return acc
    }
  }, {} )
}

/**
 * 生成getStoreBindings绑定
 */
function getStoreBindings ( store, arr ) {
  if ( getTypeOfValue( store ) === 'object' && getTypeOfValue( arr ) === 'array' ) {
    return {
      store,
      fields: expendStates( store, arr ),
      actions: expendActions( store )
    }
  }
}

module.exports = {
  createMobxStore,
  getStoreBindings
}
