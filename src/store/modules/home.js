import { 
  SET_PARTITIONID,
  SET_PARTITION_LIST,
  SET_CURRENT_PARTITION_LEVEL
} from '../types'

const state = {
  partitionId: '',   // 当前分区id
  partitionedList: [], // 分区数据数组
  currentPartitionLevel: '' // 当前分区的层级
}

const mutations = {
  [SET_CURRENT_PARTITION_LEVEL] (state, val) {
    console.log('val');
    console.log(val);
    state.currentPartitionLevel = val
  },
  [SET_PARTITIONID] (state, val) {
    state.partitionId = val
  },
  [SET_PARTITION_LIST] (state, val) {
    state.partitionedList = val
  }
}

const actions = {
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