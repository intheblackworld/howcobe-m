const path = require('path')
const meta = require('./src/info/meta')

const DEV_PATH = '/'
const PRD_PATH = '/'
const PATH = process.env.NODE_ENV === 'development' ? DEV_PATH : PRD_PATH
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  publicPath: PATH,

  devServer: {
    port: 8888, // CHANGE YOUR PORT HERE!
    https: false,
    host: 'localhost',
    disableHostCheck: true
  },

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = meta.info.title
      args[0].metaTitle = meta.info.title
      args[0].ogMetaTitle = meta.info.title
      args[0].metaDescription = meta.info.description
      args[0].ogMetaDescription = meta.info.description
      args[0].metaKeywords = meta.info.keywords
      args[0].ogMetaType = 'website'

      return args
    })
  }
}
