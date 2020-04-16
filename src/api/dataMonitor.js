import request from '@/utils/request';

// 获取监控历史数据
export const getHistoryRecord = (obj) => {
  return request({
    url: '/dataMonitor/getHistoryRecord',
    method: 'post',
    data: obj
  })
}

// 获取数据监控顶部的筛选
export const getAllDeviceGroup = (obj) => {
    return request({
      url: '/device/getAllDeviceGroup',
      method: 'get',
      params: obj
    })
  }

// 获取 走势图数据
export const getChartsDataKeys = (obj) => {
    return request({
      url: '/dataMonitor/getChartsDataKeys',
      method: 'get',
      params: obj
    })
  }

// 获取 走势图数据
export const getMeterHistoryRecord = (obj) => {
  return request({
    url: '/dataMonitor/getMeterHistoryRecord',
    method: 'post',
    data: obj
  })
}