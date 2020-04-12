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

//  修改密码
export const changePasswd = (obj) => {
  return request({
    url: '/system/changePasswd',
    method: 'get',
    params: obj
  })
}

//  修改密码
export const getVideoMonitorInfo = (obj) => {
  return request({
    url: '/videoMonitor/getVideoMonitorInfo',
    method: 'get',
    params: obj
  })
}

//  获取视频编号
export const getVideoIndexCode = (obj) => {
  return request({
    url: '/videoMonitor/getVideoIndexCode',
    method: 'get',
    params: obj
  })
}