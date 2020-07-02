import { 
  SET_PARTITIONID,
  SET_PARTITION_LIST,
  SET_CURRENT_PARTITION_LEVEL,
  SET_USER_INFO,
  SET_DESIGN_IMG_URL
} from '../types'

const state = {
  partitionId: '',   // 当前分区id
  partitionedList: [], // 分区数据数组
  currentPartitionLevel: '', // 当前分区的层级
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
  designImgUrl: ''
}

const mutations = {
  [SET_DESIGN_IMG_URL] (state, val) {
    state.designImgUrl = val
  },
  [SET_CURRENT_PARTITION_LEVEL] (state, val) {
    state.currentPartitionLevel = val
  },
  [SET_PARTITIONID] (state, val) {
    state.partitionId = val
  },
  [SET_PARTITION_LIST] (state, val) {
    state.partitionedList = val
  },
  [SET_USER_INFO] (state, val){
    state.userInfo = val
  }
}

const actions = {
  setDesignImg({commit}, val){
    commit('SET_DESIGN_IMG_URL', val)
  },
  setUserInfo({commit}, val){
    commit('SET_USER_INFO', val)
    localStorage.setItem('userInfo',JSON.stringify(val))
  },
  setCurrentPartitionLevel({commit},val) {
    commit('SET_CURRENT_PARTITION_LEVEL', val)
  },
  setPartitionList({commit},val) {
    commit('SET_PARTITION_LIST', val)
  },
  setPartitionId({commit},val) {
    commit('SET_PARTITIONID', val)
  }
}

const getters = {
  getDesignImg(state){
    return state.designImgUrl
  },
  getUserInfo(state){
    return state.userInfo
  },
  // 获取当前选择的层级level
  getCurrentPartitionLevel(state){
    return state.currentPartitionLevel
  },
  // 获取当前分区列表
  getPartitionList(state){
    return state.partitionedList
  },
  // 获取当前分区id
  getPartitionId(state){
    return state.partitionId
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}