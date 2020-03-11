import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * 路由陪着参数说明
 * path 路径
 * redirect 重定向
 * component 组件
 * nickName 首页列表展示昵称
 * meta HTML meta数据 用来在路由切换时利用router.beforeEach设置titile 以及其他meta信息
 */

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('./views/Home.vue')
    },
  ],
});


export default router