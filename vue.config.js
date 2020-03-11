module.exports = {
  publicPath:'/',
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