import rc from 'rc'
import { gql } from 'apollo-server-koa'

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

  $getApolloConfig() {
    // TODO: Actually replace it with custom schema loader - this was left here just for testing
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
    let apolloConfig = { typeDefs, resolvers }

    if (this.env.toLowerCase() === 'dev') {
      apolloConfig.introspection = true
      apolloConfig.playground = true
    } else {
      apolloConfig.introspection = false
      apolloConfig.playground = false
    }

    // override enable/disable apollo introspection
    if (this.apollo && this.apollo.introspection === true) {
      apolloConfig.introspection = true
    } else if (this.apollo && this.apollo.introspection === false) {
      apolloConfig.introspection = false
    }

    // override enable/disable apollo playground
    if (this.apollo && this.apollo.playground === true) {
      apolloConfig.playground = true
    } else if (this.apollo && this.apollo.playground === false) {
      apolloConfig.playground = false
    }

    return apolloConfig
  }

  static _$returnDefault() {
    return {
      'env': 'dev',
      'port': 3000,
      'host': 'localhost'
    }
  }
}
