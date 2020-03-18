const webpack = require('webpack')
const { parsed: localEnv } = require('dotenv').config()
const path = require('path')

module.exports = {
  async exportPathMap(
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      // '/': { page: '/createdeal' },
      // '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      // '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }))

    config.resolve.alias.components = path.join(__dirname, 'components')
    config.resolve.alias.hooks = path.join(__dirname, 'hooks')
    config.resolve.alias.graphql_queries = path.join(__dirname, 'graphql_queries')

    config.plugins.push(
      new webpack.ProvidePlugin({
        _: 'lodash',
      })
    );

    return config
  },
  publicRuntimeConfig: {
    GRAPHQL_URL: process.env.GRAPHQL_URL,
  }
}
