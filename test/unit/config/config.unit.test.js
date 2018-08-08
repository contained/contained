import Config from '../../../src/core/Config'

describe('Config.', () => {
  describe('read.env', () => {
    test('Config Value', () => {
      process.env.contained_localTest = 'yes'
      const config = new Config()
      expect(config.config.localTest).toBe('yes')
    })
  })
})
