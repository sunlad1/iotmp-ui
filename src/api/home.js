import request from '@/utils/request';


// 设备报警
export const getUnRemovedAlarmList = (obj) => {
  return request({
    url: '/alarmHandle/getUnRemovedAlarmList',
    method: 'get',
    params: obj
  })
}

// 侧边栏数据
export const getPartitionList = (obj) => {
  return request({
    url: '/device/getPartitionList',
    method: 'get',
    params: obj
  })
}


// 获取环控仪表的数据
export const getMeterData = (obj) => {
  return request({
    url: '/dataMonitor/getMeterData',
    method: 'get',
    params: obj
  })
}

// 获取环控等级数据
export const getMeterLevel = (obj) => {
  return request({
    url: '/dataMonitor/getMeterLevel',
    method: 'get',
    params: obj
  })
}

// 获取设备列表信息
export const deviceList = (obj) => {
  return request({
    url: '/device/deviceList',
    method: 'get',
    params: obj
  })
}

// 获取设备列表信息
export const getOperateDeviceTypes = (obj) => {
  return request({
    url: '/device/getOperateDeviceTypes',
    method: 'get',
    params: obj
  })
}

// 获取设备列表信息
export const getMeterGroups = (obj) => {
  return request({
    url: '/dataMonitor/getMeterGroups',
    method: 'get',
    params: obj
  })
}
