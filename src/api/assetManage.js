import request from '@/utils/request';

// 获取资产相关列表
export const queryList = (obj) => {
  return request({
    url: '/property/query',
    method: 'get',
    params: obj
  })
}

// 获取资产相关列表
export const addInspection = (obj) => {
    return request({
      url: '/property/add',
      method: 'post',
      data: obj
    })
  }

// 删除资源
export const deleteAsset = (obj) => {
    return request({
      url: '/property/delete',
      method: 'get',
      params: obj
    })
  }

// 修改资源
export const updateAsset = (obj) => {
  return request({
    url: '/property/update',
    method: 'post',
    data: obj
  })
}