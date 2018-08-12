import consola from 'consola'
import Koa from 'koa'
// import koaWebpack from 'koa-webpack'
import KoaRouter from 'koa-router'
import { ApolloServer, gql } from 'apollo-server-koa'
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

      // Construct a schema, using GraphQL schema language
      const typeDefs = gql`
        type Query {
          hello: String
        }
      `
      // Provide resolver functions for your schema fields
      const resolvers = {
        Query: {
          hello: () => 'Hello world!'
        }
      }
      this.apolloServer = new ApolloServer({ typeDefs, resolvers })
      this.apolloServer.applyMiddleware({ app: this.app })
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
    this.server = this.app.listen(this.config.port, () => {
      consola.info(`Contained listening on http://${this.config.host}:${this.config.port}`)
    })
  }

  async _setupAfterStartup() {
    await this.callHook('started', this)
    consola.ready('Contained Fully Started')
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
