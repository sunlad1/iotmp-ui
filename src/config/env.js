const {VUE_APP_ENV} = process.env

let ENV = 'PROD'

if(VUE_APP_ENV === "development") {
  ENV = 'DEV'
  console.warn('当前处于开发环境')
} else if(VUE_APP_ENV === "qa"){
  ENV = 'QA'
  console.warn('当前处于QA环境')
}

export default ENV