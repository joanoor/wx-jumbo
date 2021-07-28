
const computedBehavior = require( 'miniprogram-computed' )
import { methodObj, dayjs, inject,baseBehavior } from './src'

const relationFunctions = {
  ancestor: {   // 祖先
    linked ( parent ) {
      this.parent = parent;
    },
    unlinked () {
      this.parent = null;
    },
  },
  descendant: {   // 后代
    linked ( child ) {
      this.children = this.children || [];
      this.children.push( child );
    },
    unlinked ( child ) {
      this.children = ( this.children || [] ).filter( ( it ) => it !== child );
    },
  },
}

function mapKeys ( source = {}, target = {}, map = {} ) {
  Object.keys( map ).forEach( ( key ) => {
    if ( source[ key ] ) {
      target[ map[ key ] ] = source[ key ];
    }
  } );
}

function makeRelation ( options, xtOpitions, relation ) {
  const { type, name, linked, unlinked, linkChanged } = relation;
  const { beforeCreate, destroyed } = xtOpitions;
  if ( type === 'descendant' ) {
    options.created = function () {
      beforeCreate && beforeCreate.bind( this )();
      this.children = this.children || [];
    };
    options.detached = function () {
      this.children = [];
      destroyed && destroyed.bind( this )();
    };
  }
  options.relations = Object.assign( options.relations || {}, {
    [ `../${ name }/index` ]: {
      type,
      linked ( node ) {
        relationFunctions[ type ].linked.bind( this )( node );
        linked && linked.bind( this )( node );
      },
      linkChanged ( node ) {
        linkChanged && linkChanged.bind( this )( node );
      },
      unlinked ( node ) {
        relationFunctions[ type ].unlinked.bind( this )( node );
        unlinked && unlinked.bind( this )( node );
      },
    },
  } );
}

exports.methodObj=methodObj
exports.dayjs=dayjs
exports.inject=inject
module.exports = function ( xtOpitions ) {
  const options = {};
  mapKeys( xtOpitions, options, {
    data: 'data',
    props: 'properties',
    mixins: 'behaviors',
    methods: 'methods',
    beforeCreate: 'created',
    created: 'attached',
    mounted: 'ready',
    relations: 'relations',
    destroyed: 'detached',
    classes: 'externalClasses',
    storeBindings: 'storeBindings',        // 小程序MoBX
    computed: 'computed',                  // 小程序computed
    watch: 'watch'                         // 小程序watch
  } );

  const { relation } = xtOpitions;
  if ( relation ) {
    makeRelation( options, xtOpitions, relation );
  }

  // add default store, each page will use it
  // options.storeBindings = {
  //   store,
  //   fields: {
  //     // username: () => store.username
  //   },
  //   // actions: ['update']
  // }

  // add default externalClasses
  options.externalClasses = options.externalClasses || [];
  options.externalClasses.push( 'custom-class' );

  // add default behaviors
  options.behaviors = options.behaviors || [];
  options.behaviors.push( baseBehavior );
  // options.behaviors.push(storebehavior);
  options.behaviors.push( computedBehavior );

  // map field to form-field behavior
  if ( xtOpitions.field ) {
    options.behaviors.push( 'wx://form-field' );
  }

  if ( options.properties ) {
    Object.keys( options.properties ).forEach( ( name ) => {
      if ( Array.isArray( options.properties[ name ] ) ) {
        // miniprogram do not allow multi type
        options.properties[ name ] = null;
      }
    } );
  }

  // add default options
  options.options = {
    multipleSlots: true,
    addGlobalClass: true,
  };

  Component( options );
}
