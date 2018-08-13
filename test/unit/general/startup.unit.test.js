import consola from 'consola'
import Contained from '../../../src/core/Contained'
const contained = new Contained()

describe('General.', () => {
  describe('Test Startup Output', () => {
    test('Check Startup Output', () => {
      jest.spyOn(consola, 'start')
      jest.spyOn(consola, 'ready')
      jest.spyOn(consola, 'info')
      contained.registerHook('started', (ctx) => {
        // console.log(ctx)
        expect(consola.start).toHaveBeenCalledWith('Starting Contained Server...')
        expect(consola.info).toHaveBeenCalledWith('Setting Up Core Middleware...')
        expect(consola.info).toHaveBeenCalledWith('Finished Setting up Core Middleware...')
        expect(consola.ready).toHaveBeenCalledWith('Contained Fully Started')
        consola.ready.mockRestore()
      })
      contained.listen()
    })
  })
})
