
import Promise from 'bluebird'

// exports
export default class EventEmitter {
  
  /**
   * EventEmitter constructor
   * 
   * @constructor
   */
  constructor() {
    this.parent = null
    this._listeners = {}
  }
  
  /**
   * Get the emitter listerners
   * 
   * @param {String} event
   * @return array
   */
  listeners(event) {
    return (this.parent ? this.parent.listeners(event) : []).concat(this._listeners[event] || [])
  }
  
  /**
   * Add a handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  on(event, fn) {
    // TODO ensure that `fn` is a function
    
    event.split(' ').forEach(name => {
      name && (this._listeners[name] = this._listeners[name] || []).push(fn)
      
      // TODO emit a warning if the listeners count is more than 10
    })
    
    return this
  }
  
  /**
   * Add a one time handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  once(event, fn) {
    // TODO ensure that `fn`` is a function
    
    // add `once` flag
    fn.once = true
    
    event.split(' ').forEach(name => { name && this.on(name, fn) })
    
    return this
  }
  
  /**
   * Trigger sequentially an event with arguments
   * 
   * @param {String} event
   * @param {Array} args
   * @return promise
   */
  emit(event, ...args) {
    return Promise.reduce(this.listeners(event), (_, fn) => {
      if ( fn.once && fn.called ) return false
      
      // add `called` flag
      fn.called = true
      
      return fn(...args)
    }, null)
  }
  
  /**
   * Remove an event handler
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  off(event = null, fn = null) {
    // call parent's off method to remove ancestor callbacks
    if ( this.parent ) this.parent.off(...arguments)
    
    if ( event == null ) this._listeners = {}
    else if ( fn == null ) this._listeners[event] = []
    else {
      let idx = 0, list = this._listeners[event] || []
      
      for ( let cb in list ) {
        if ( cb !== fn ) { idx++; continue }
        else { list.splice(idx, 1); break }
      }
    }
    
    return this
  }
  
  /**
   * Get a new instance of the event emitter
   * 
   * @return emitter instance
   */
  clone() {
    var emitter = new this.constructor()
    
    // just set the parent property to access parent listeners
    emitter.parent = this
    
    return emitter
  }
  
}
