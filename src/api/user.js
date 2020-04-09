import request from '@/utils/request';

//  获取所有用户列表
export const getAllUser = (obj) => {
  return request({
    url: '/system/getAllUser',
    method: 'get',
    params: obj
  })
}

//  获取所有用户列表
export const logout = (obj) => {
  return request({
    url: '/system/logout',
    method: 'get',
    params: obj
  })
}