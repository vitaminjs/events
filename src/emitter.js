
import Promise from 'bluebird'
import EventEmitter from 'events'

// exports
export default class extends EventEmitter {
  
  /**
   * Add a handler for the given event
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  on(event, fn) {
    event.split(' ').forEach(name => { name && super.on(name, fn) })
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
    event.split(' ').forEach(name => { name && super.once(name, fn) })
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
    return Promise.reduce(this.listeners(event), (_, fn) => fn(...args), 0)
  }
  
  /**
   * Remove an event handler
   * 
   * @param {String} event
   * @param {Function} fn
   * @return this
   */
  off(event = null, fn = null) {
    if ( fn ) this.removeListener(...arguments)
    else this.removeAllListeners(...arguments)
    
    return this
  }
  
}
