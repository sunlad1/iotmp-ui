import request from '@/utils/request';


// 解除报警
export const removeAlarm = (obj) => {
  return request({
    url: '/alarmHandle/removeAlarm',
    method: 'get',
    params: obj
  })
}

// 设备报警
export const recordLog = (obj) => {
    return request({
      url: '/alarmHandle/recordLog',
      method: 'get',
      params: obj
    })
}

// 获取报警列表
export const getAlarmConfig = (obj) => {
    return request({
      url: '/alarmHandle/getAlarmConfig',
      method: 'get',
      params: obj
    })
  }

// 获取报警列表
export const updateAlarmConfig = (obj) => {
    return request({
      url: '/alarmHandle/updateAlarmConfig',
      method: 'POST',
      data: obj
    })
  }

// 根据id查询设备
export const getDeviceByPartitionId = (obj) => {
    return request({
      url: '/device/getDeviceByPartitionId',
      method: 'get',
      params: obj
    })
  }

// 获取历史报警列表
export const getAlarmRecord = (obj) => {
    return request({
      url: '/alarmHandle/getAlarmRecord',
      method: 'get',
      params: obj
    })
  }