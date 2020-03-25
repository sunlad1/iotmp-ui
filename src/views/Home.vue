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
    <!-- 导航栏 -->
    <div class="guideGrid">
      <span>当前位置：</span>
      <p v-if="levelArr.length == 1">
        <span class="hignLightWord">{{ partitionedList[levelArr[0]].partitionName }}</span>
      </p>
      <p v-if="levelArr.length == 2">
        <span class="normalWord">{{ partitionedList[levelArr[0]].partitionName }} > </span>
        <span class="hignLightWord">{{ partitionedList[levelArr[0]].childPartition[levelArr[1]].partitionName }}</span>
      </p>
      <p v-if="levelArr.length == 3">
        <span class="normalWord">{{ partitionedList[levelArr[0]].partitionName }} > </span>
        <span class="normalWord">{{ partitionedList[levelArr[0]].childPartition[levelArr[1]].partitionName }} > </span>
        <span class="hignLightWord">{{ partitionedList[levelArr[0]].childPartition[levelArr[1]].childPartition[levelArr[2]].partitionName }}</span>
      </p>
    </div>
    <!-- 中心部分 -->
    <div class="insideWarper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import navMenu from './homeComponents/navMenu';
  import { mapGetters } from 'vuex';

  export default {
    name: 'Home',
    components: {
      navMenu
    },
    data() {
      return {
        routeData: [],
        current: ['a'],
        levelArr: []
      };
    },
    watch:{
      'currentPartitionLevel': function(n) {
        let arr = n.split('-')
        arr = arr.map( v => Number(v))
        this.levelArr = arr
        console.log('this.partitionedList');
        console.log(this.partitionedList[this.levelArr[0]].partitionName);
        console.log(this.levelArr.length);
      }
    },
    computed: {
      ...mapGetters(['currentPartitionLevel', 'partitionedList']),
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
    .guideGrid{
      display: flex;
      align-items: center;
      color: #787DB8;
      width: 100%;
      padding-left: 100px;
      padding-top: .23622rem;
      p{
        margin: 0;
      }
      .normalWord{
        color: #787DB8;
        font-size: 12px;
      }
      .hignLightWord{
        font-size: 12px;
        color: #00C3FF;
      }
    }
    .insideWarper{
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      width: 100vw;
      padding: .23rem;
      padding-top: 0.094488rem;
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
          background: url("/static/imgs/logo.png") center center no-repeat;
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
