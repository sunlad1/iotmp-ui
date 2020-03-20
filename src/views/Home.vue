<template>
  <div class="Home">
    <!-- 侧边栏 -->
    <navMenu></navMenu>
    <!-- 顶部信息 -->
    <div class="header">
      <div class="header-left">
        <div class="logon">智慧管廊运维平台</div>
        <div class="menu">
          <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="a"> 展示控制</a-menu-item>
            <a-menu-item key="b"> 数据监控</a-menu-item>
            <a-menu-item key="c"> 报警列表</a-menu-item>
            <a-menu-item key="d"> 资产管理</a-menu-item>
            <a-menu-item key="e">运维管理</a-menu-item>
            <a-menu-item key="f">系统设置</a-menu-item>
          </a-menu>
        </div>
      </div>
      <div class="header-right"></div>
    </div>
    <!-- 中心部分 -->
    <div class="insideWarper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import navMenu from './homeComponents/navMenu';

  export default {
    name: 'Home',
    components: {
      navMenu
    },
    data() {
      return {
        routeData: [],
        current: ['a']
      };
    },
    computed: {
      host() {
        return location.origin;
      }
    },
    created() {
      this.routeData = this.$router.options.routes.filter(_ => _.meta);
    },
    methods: {}
  };
</script>
<style lang="less" scoped>
  .Home {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    align-items: center;
    background: url("./../assets/images/bg.jpg") center center no-repeat;
    background-size: 100% 100%;
    .insideWarper{
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      width: 100vw;
      padding: .23rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 100px;
      background: rgba(0, 0, 0, .5);
      border-bottom: solid 1px #003399;
      z-index: 10000;
      .header-left {
        display: flex;
        align-items: center;
        .logon {
          width: 352px;
          height: 100px;
          text-indent: -999px;
          margin-left: 65px;
          background: url("./../assets/images/logo.png") center center no-repeat;
        }
        .menu {
          width: 800px;
          height: 100%;
          color: #6666cc;
          margin-left: 77px;
          .ant-menu{
            background: none;
            color: #6666cc;
          }
          .ant-menu-horizontal{
            height: 98px;
            line-height: 98px;
            border: none;
          }
        }
      }
      .header-right {

      }
    }
  }
</style>
