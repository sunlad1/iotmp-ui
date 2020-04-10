// import { BASE_URL } from '@/config/env'
import {Message} from 'element-ui'
import axios from 'axios'


axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// axios.defaults.baseURL = BASE_URL
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
  const status = res.status || 200
  const message = res.data || '未知错误';
  // 如果请求为非200否者默认统一处理
  console.log('status');
  console.log(status);
  
  if(status == 302){
    return Promise.reject('302')
  }
  if (status !== 200) {
    console.log('res');
    console.log(res);
    
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  return Promise.reject(new Error(error));
})

export default axios;
