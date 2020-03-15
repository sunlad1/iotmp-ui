import { SET_PARTITIONID } from '../types'

const state = {
  partitionId: ''
}

const mutations = {
  [SET_PARTITIONID] (state, val) {
    state.partitionId = val
  }
}

const actions = {
  setPartitionId({commit},val){
    commit('SET_PARTITIONID',val)
  }
}

const getters = {
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