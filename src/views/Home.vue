<template>
  <div class="Home">
    <navMenu></navMenu>
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
    <div class="insideWarper">
      <div class="showContainer">
        <div class="content">
          <div class="top">
            <div class="left">
              <leftCom></leftCom>
            </div>
            <div class="right" id="right">
              <VideoSurveillance/>
            </div>
          </div>
        </div>
        <div class="equipmentManage">
          <equipmentManage></equipmentManage>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VideoSurveillance from '@/components/videoSurveillance';
  import leftCom from './homeComponents/leftCom';
  import equipmentManage from './homeComponents/equipmentManage';
  import navMenu from './homeComponents/navMenu';

  export default {
    name: 'Home',
    components: {
      VideoSurveillance,
      leftCom,
      equipmentManage,
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
<style lang="less">
  .Home {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    align-items: center;
    background: url("./../assets/images/bg.jpg") center center no-repeat;


  .el-table thead{
    color: #fff;
  }
  .el-table .cell{
    line-height: unset;
  }

  .el-table td, .el-table th{
    padding: .039rem 0;
  }


  .el-table::before{
    height: 0 !important;
  }
  .el-table{
    background: transparent !important;
    color: #fff !important;
  }
  .el-table td,.is-leaf{
    border-bottom: 1px solid #3625ab;
  }

   .el-table th{
     border:none !important;
   }

  .el-table th, .el-table tr{
    background: transparent !important;
  }

.el-table__row:hover{
  background: rgba(0, 153, 204, .4) !important;
}
.el-table__row:active{
  background: rgba(0, 153, 204, .4);
}
.el-table tbody tr:hover>td { 
  background: rgba(0, 153, 204, .4) !important;
}
    
    table{
      width: auto !important;
      td{
        div{
          white-space: nowrap;
          font-size: .09rem !important;
          span{
            font-size: .09rem !important;
          }
        }
      }
      th{
        div{
          white-space: nowrap;
          font-size: .09rem !important;
          span{
            font-size: .09rem !important;
          }
        }
      }
    }
    .showContainer{
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
    }
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
    .equipmentManage{
      flex: 0 0 33.8%;
      overflow: hidden;
    }
    .content {
      width: 100vw;
      margin: 0 auto;
      flex: 0 0 50.7%;
      .top {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .left {
          flex: 0 0 32.38%;
        }
        .right {
          height: auto;
          flex: 0 0 65%;
        }
      }
    }
  }
</style>
