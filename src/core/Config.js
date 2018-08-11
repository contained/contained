import rc from 'rc'

export default class Config {
  /**
   * Options Priority:
   * 1 - Constructor
   * 2 - rc File/env
   * 3 - defaults
   * @param options
   */
  constructor(options = {}) {
    const rcOptions = rc('contained', Config._$returnDefault())
    Object.assign(this, rcOptions, options)
  }

  static _$returnDefault() {
    return {
      'env': 'dev',
      'port': 3000,
      'wsPort': 5000,
      'host': 'localhost'
    }
  }
}
