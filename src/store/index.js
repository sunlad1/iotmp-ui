import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import * as getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  state: {
  },
  mutations: {

  },
  actions: {
  },
  modules: {
    home
  }
})
