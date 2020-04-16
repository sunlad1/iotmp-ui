import request from '@/utils/request';


// 查询所有用户
export const login = (obj) => {
  return request({
    url: '/system/login',
    method: 'get',
    params: obj
  })
}


export const getCopyright = (obj) => {
  return request({
    url: '/system/getCopyright',
    method: 'get',
    params: obj
  })
}