export default class Base {
  registerHook() {
    if (typeof this._hooks === 'undefined') {
      this._hooks = []
    }
  }

  async callHook(name, ...args) {
    if (this._hooks[name]) {

    }
  }
}
