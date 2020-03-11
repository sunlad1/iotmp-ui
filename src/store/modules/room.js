import _ from 'lodash'
import { fetchPlantDetail, fetchAccessRecord, fetchMessage, fetchRoomInfo } from '@/services/plant';
// import moment from 'moment'
export default {
  state: {
    name: 'room',
    roomType: '',
    userId: '',
    // acceptorNick: '',
    plants: [],
    accessRecord: [],
    comment: [],
    commentPageConfig: {
      pageSize: 10,
      noMore: false,
    },
    inviteLinkId: '',
    isRegister: false,  // 是否已经注册 用来跳转下载页面
    isLinkOK: true,  // 链接是否有效
    isRoomOK: true, // 房间是否存在
  },
  mutations: {
    UPDATE_USER_ID(state, userId) {
      state.userId = userId
    },
    UPDATE_INVITE_LINK_ID(state, val) {
      state.inviteLinkId = val
    },
    UPDATE_ROOM_TYPE(state, values) {
      state.roomType = values
    },
    UPDATE_PLANTS(state, values) {
      state.plants = values
    },
    UPDATE_ACCESS_RECORD(state, values) {
      state.accessRecord = values
    },
    UPDATE_COMMENT(state, values) {
      state.comment = _.sortBy(_.uniqBy(state.comment.concat(values), 'id'), _ => - _.id)
    },
    RESET_COMMENT(state, values) {
      state.comment = values
    },
    UPDATE_COMMENT_PAGE_CONFIG(state, values) {
      console.log(values)
      state.commentPageConfig = {
        ...state.commentPageConfig,
        ...values,
      }
    },
    UPDATE_IS_REGISTER(state, value) {
      state.isRegister = value
    },
    UPDATE_IS_LINK_OK(state, value) {
      state.isLinkOK = value
    },
    UPDATE_IS_ROOM_OK(state, value) {
      state.isRoomOK = value
    }
  },
  actions: {
    setInvitorId({ commit }, { inviteLinkId }) {
      commit('UPDATE_INVITE_LINK_ID', inviteLinkId)
    },
    getPlants({ state, commit }) {
      const { userId } = state;
      fetchPlantDetail({ userId }).then((res) => {
        commit('UPDATE_PLANTS', res.plants || [])
        commit('UPDATE_ROOM_TYPE', res.roomType)
      }).catch(() => {
        commit('UPDATE_IS_ROOM_OK', false)
      })
    },
    getAccessRecord({ state, commit }, { callback }) {
      const { userId } = state
      fetchAccessRecord({ userId }).then(content => {
        commit('UPDATE_ACCESS_RECORD', content)
      }).finally(
        () => {
          callback && typeof callback === 'function' && callback()
        }
      )
    },
    getComment({ state, commit }, { payload, callback, reload }) {
      const { userId, commentPageConfig: { pageSize } } = state
      fetchMessage({ userId, ...payload }).then(content => {
        const { datas } = content
        if (reload) { // 如果是刷新
          commit('RESET_COMMENT', datas)
        } else {
          commit('UPDATE_COMMENT', datas)
        }
        if (datas.length < pageSize) {
          commit('UPDATE_COMMENT_PAGE_CONFIG', {
            noMore: true
          })
        } else {
          commit('UPDATE_COMMENT_PAGE_CONFIG', {
            noMore: false
          })
        }

      }).finally(
        () => {
          callback && typeof callback === 'function' && callback()
        }
      )
    },
    // 刷新功能 目前没有使用
    reload({ dispatch, state }, { success, fail }) {
      const getPlants = dispatch('getPlants')
      const getAccessRecord = dispatch('getAccessRecord')
      const getComment = dispatch({
        type: 'getComment',
        payload: {
          pageSize: state.commentPageConfig.pageSize,
          pageNum: 1
        },
        reload: true
      })
      Promise.all([getPlants, getAccessRecord, getComment]).then(
        () => {
          success && typeof success === 'function' && success()
        }
      ).catch(() => {
        fail && typeof fail === 'function' && fail()
      })
    },
    // 判断链接是否有效
    getRoomInfo({commit, dispatch}, {inviteLinkId}) {
      fetchRoomInfo({inviteLinkId}).then((res) => {
        const {invitorId, invitorName} = res
        commit('UPDATE_IS_LINK_OK', true)
        commit('UPDATE_USER_ID', invitorId)
        if(invitorName) {
          document.title = `${invitorName}家中的植物`
        }
        // 获取房间植物信息
        dispatch('getPlants')
      }).catch(() => {
        // 链接无效
        console.log('error')
        commit('UPDATE_IS_LINK_OK', false)
      })
    },
  },
  getters: {

  },
}
