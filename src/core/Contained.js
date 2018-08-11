import { Config } from 'Config'
import consola from 'consola'
import Koa from 'koa'
import koaWebpack from 'koa-webpack'
import body from 'koa-json-body'
import Router from 'koa-router'
import KoaBody from 'koa-bodyparser'
import websockify from 'koa-websocket'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import Base from './Base'

export default class Contained extends Base {
  constructor(options = {}) {
    super()
    this.config = new Config(options)
    this.app = new Koa()
    this.socket = websockify(this.app)
    this.http = new Router()
    this.ws = new Router()
  }

  async _configure(port, host) {
    consola.start('Starting Contained Server...')
    await this.callHook('start', this)
    if (port) {
      this.config.port = port
    }

    if (host) {
      this.config.host = host
    }
  }
  async _setupCoreMiddleware() {
    await this.callHook('start-core-middleware', this)
    consola.info('Setting Up Core Middleware...')
    this.app.use(body({
      limit: '100kb',
      fallback: true
    }))
    this.app.use(mount('/graphql', graphqlHTTP({
      schema,
      graphiql: env === 'development'
    })))
    this.app.use(koaWebpack({
      config: webpackConfig
    }))
  }
  async _setupCustomMiddleware() {
    await this.callHook('start-custom-middleware', this)
    consola.info('Processing Custom Middleware...')
  }

  async _startApp() {
    this.app.listen(this.config.port, () => {
      consola.ready(`Contained listening on http://${this.config.host}:${this.config.port}`)
    })
  }

  listen(port, host) {
    this._configure(port, host)
      .then(() => { return this._setupCoreMiddleware() })
      .then(() => { return this._setupCustomMiddleware() })
      .then(() => { return this._startApp() })
  }
}
