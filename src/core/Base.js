export default class Base {
  registerHook(name, fn) {
    if (typeof this._hooks === 'undefined') {
      this._hooks = {}
    }
    this._hooks[name] = this._hooks[name] || []
    this._hooks[name].push(fn)
  }

  async callHook(name, ...args) {
    if (typeof this._hooks !== 'undefined' && this._hooks[name]) {
      return this._hooks[name].reduce(
        (promise, task) => promise.then(() => task(...args)),
        Promise.resolve()
      )
    }
  }
}
