const {NODE_ENV} = process.env

let BASE_URL = ''

let websoketURL = '39.99.132.48:10098'

if(NODE_ENV === 'production'){
  BASE_URL = ''
}else if(NODE_ENV === 'development'){
  BASE_URL = 'http://39.99.132.48:10098/'

}

export {
  BASE_URL,
  websoketURL
}