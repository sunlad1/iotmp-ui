/*
 * @Author: your name
 * @Date: 2020-03-11 19:12:22
 * @LastEditTime: 2020-03-25 19:18:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /iotmp-ui/src/router.js
 */
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
      redirect: "/home/showControl",
      component: () => import('./views/Home.vue'),
      children:[
        {
          path: 'showControl',
          component:  () => import('./views/showControl.vue'),
          name: 'showControl'
        },
        {
          path: 'dataMonitor',
          component:  () => import('./views/dataMonitor/index.vue'),
          name: 'dataMonitor'
        }
      ]
    },
  ],
});


export default router