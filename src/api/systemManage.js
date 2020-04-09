import request from '@/utils/request';


// 查询所有用户
export const queryList = (obj) => {
  return request({
    url: '/system/queryUser',
    method: 'get',
    params: obj
  })
}

// 密码重置
export const resetPasswd = (obj) => {
    return request({
      url: '/system/resetPasswd',
      method: 'get',
      params: obj
    })
  }

// 密码重置
export const deleteUser = (obj) => {
    return request({
      url: '/system/deleteUser',
      method: 'get',
      params: obj
    })
  }

// 密码重置
export const updateUser = (obj) => {
    return request({
      url: '/system/updateUser',
      method: 'post',
      data: obj
    })
  }

//  新建用户
export const addUser = (obj) => {
    return request({
      url: '/system/addUser',
      method: 'post',
      data: obj
    })
  }