import request from '@/utils/request';

// 查询列表
export const queryList = (obj) => {
  return request({
    url: '/inspection/query',
    method: 'post',
    data: obj
  })
}

// 新增巡检记录
export const addInspection = (obj) => {
  return request({
    url: '/inspection/add',
    method: 'post',
    data: obj
  })
}