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
    this.config = rc('contained', Config.returnDefault())
    this.config = { ...this.config, ...options }
  }

  static returnDefault() {
    return {
      'env': 'dev',
      'port': 3000,
      'wsPort': 5000
    }
  }
}
