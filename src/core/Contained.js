import http from 'http'
import consola from 'consola'
import Koa from 'koa'
// import koaWebpack from 'koa-webpack'
import KoaRouter from 'koa-router'
import {ApolloServer} from 'apollo-server-koa'
import KoaLogger from 'koa-logger'
import Base from './Base'
import Config from './Config'

export default class Contained extends Base {
  constructor(options = {}) {
    super()
    this.config = new Config(options)
    this.app = new Koa()
    this.router = new KoaRouter()
  }

  async _configure(port, host) {
    consola.start('Starting Contained Server...')
    await this.callHook('config', this)
    if (port) {
      this.config.port = port
    }

    if (host) {
      this.config.host = host
    }
  }
  async _setupCoreMiddleware() {
    await this.callHook('before-core-middleware', this)
    consola.info('Setting Up Core Middleware...')
    try {
      this.app.use(KoaLogger((str, args) => {
        consola.info(str)
        consola.info(args)
      }))

      this.apolloServer = new ApolloServer(this.config.$getApolloConfig())
      this.apolloServer.applyMiddleware({ app: this.app })
      this.httpServer = http.createServer(this.app)
      this.apolloServer.installSubscriptionHandlers(this.httpServer)
    } catch (err) {
      consola.fatal(err)
    }
    // this.app.use(koaWebpack({
    //   config: webpackConfig
    // }))
  }
  async _setupCustomMiddleware() {
    await this.callHook('after-core-middleware', this)
    consola.info('Finished Setting up Core Middleware...')
  }

  async _startApp() {
    let promise = await new Promise((resolve, reject) => {
      this.httpServer.listen(this.config.port, () => {
        consola.info(`Contained GraphQL is listening on http://${this.config.host}:${this.config.port}${this.apolloServer.graphqlPath}`)
        consola.info(`Contained GraphQL subscriptions are on ws://${this.config.host}:${this.config.port}${this.apolloServer.subscriptionsPath}`)
        resolve()
      })
    })
    return promise
  }

  async _setupAfterStartup() {
    consola.ready('Contained Fully Started')
    await this.callHook('started', this)
  }

  listen(port, host) {
    const series = async () => {
      await this._configure(port, host)
      await this._setupCoreMiddleware()
      await this._setupCustomMiddleware()
      await this._startApp()
      await this._setupAfterStartup()
      return this
    }

    return series()
      .then(() => {
        // console.log('SERIES DONE')
      }).catch(err => {
        consola.fatal(err)
      })
  }
  close() {
    this.server.close()
  }
}
