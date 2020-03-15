module.exports = {
  publicPath:'/',
  devServer: {
    host: '0.0.0.0',
    port: 1888,
    proxy: {
      '/': {
        target: 'http://39.99.132.48:10098', // 公网ip
        ws: true
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          'primary-color': '#6666cc',
          'border-color-base': '#6666cc',
          'text-color':'#6666cc',
          'component-background':'none',
          'disabled-color':'#6666cc'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  }
};