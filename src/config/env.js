const {NODE_ENV} = process.env
console.log(window);

let BASE_URL = ''

// let websoketURL = '39.99.132.48:10098'
// let websoketURL = '192.168.10.200'
let websoketURL = '127.0.0.1:8111'
 
if(NODE_ENV === 'production'){
  BASE_URL = ''
}else if(NODE_ENV === 'development'){
  BASE_URL = 'http://39.99.132.48:10098/'
  // BASE_URL = 'http://127.0.0.1:8111/'

}

export {
  BASE_URL,
  websoketURL
}