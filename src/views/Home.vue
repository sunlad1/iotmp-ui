<template>
  <div class="Home">
    <!-- 侧边栏 -->
    <navMenu v-if="isShowNavMenu"></navMenu>
    <!-- 顶部信息 -->
    <div class="header">
      <div class="header-left">
        <div class="logon">智慧管廊运维平台</div>
        <div class="menu">
          <a-menu v-model="current" mode="horizontal">
            <a-menu-item key="0"> 展示控制</a-menu-item>
            <a-menu-item key="1"> 数据监控</a-menu-item>
            <a-menu-item key="2"> 报警列表</a-menu-item>
            <a-menu-item key="3"> 资产管理</a-menu-item>
            <a-menu-item key="4">运维管理</a-menu-item>
            <a-menu-item key="5">系统设置</a-menu-item>
          </a-menu>
        </div>
      </div>
      <div class="header-right">
        <span>操作账号:</span>
        <span>{{ userInfo.realName }}</span>
        <span>|</span>
        <span class="active cursor" @click="editPassword">修改密码</span>
        <i @click="logOut" class="cursor el-icon-switch-button" color="#035CFF"></i>
      </div>
    </div>
    <!-- 中心部分 -->
    <div class="insideWarper">
      <router-view></router-view>
    </div>

    <dialogBox :dialogTableVisible="dialogTableVisible" @closeDialog="closeDialog" @clearDialogSubmit="clearDialogSubmit" @onSubmit="onSubmit">
      <template v-slot:header>
        <img src="/static/imgs/operationManage/operationIcon.png" alt />
        <p style="margin-right:auto">修改密码</p>
      </template>
      <template v-slot:middle>
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="旧密码">
                <el-input placeholder="请输入" v-model="form.oldPasswd"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码">
                <el-input placeholder="请输入" v-model="form.newPasswd"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="确认密码">
                <el-input placeholder="请输入" v-model="form.confirmPasswd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </dialogBox>


    <!-- 设别告警列表 -->

    <div class="equipmentWarnFixed" v-if="isWarnBox">
      <div class="closeBtn" @click="closeWarnDialog"></div>
      <div class="leftComtop">
        <img src="/static/imgs/home_icon1.png" alt />
        <p>设备告警列表</p>
      </div>
      <div class="botttom" style="flex: 1;overflow:auto;">
        <el-table height="100%" :data="alarmList" style="width: 100%">
          <el-table-column prop="alarmDeviceName" label="报警名称"></el-table-column>
          <el-table-column prop="alarmType" label="报警类型"></el-table-column>
          <el-table-column prop="alarmAttr" label="源属性"></el-table-column>
          <el-table-column prop="alarmDescribe" label="报警描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5;cursor:pointer">更多</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
  import navMenu from './homeComponents/navMenu';
  import { mapGetters } from 'vuex';
  import { logout, changePasswd } from '@/api/user';
  import dialogBox from '@/components/dialogBox'
  import { websoketURL } from "@/config/env";
  export default {
    name: 'Home',
    components: {
      navMenu,
      dialogBox
    },
    data() {
      return {
        isShowNavMenu: true,
        isWarnBox: false,
        form:{
          oldPasswd: '',
          newPasswd: '',
          confirmPasswd: ''
        },
        dialogTableVisible: false,
        routeData: [],
        current: ['0'],
        levelArr: [],
        wsLeftArr: [],
        pages: [
          {
            name: '/home/showControl'
          },
          {
            name: '/home/dataMonitor'
          },
          {
            name: '/home/warnList'
          },
          {
            name: '/home/assetManage'
          },
          {
            name: '/home/operationManage'
          },
          {
            name: '/home/systemManage'
          }
        ]
      };
    },
    watch:{
      '$route': function(){
        this.current[0] = String(this.pages.findIndex(v => v.name === this.$route.path))
      },
      'current':{
        handler:function(){
          this.$router.push({
            path: this.pages[Number(this.current[0])].name
          })
          
          if(Number(this.current[0]) > 1){
            this.isShowNavMenu = false
          }else{
            this.isShowNavMenu = true
          }
        }
      },
      'partitionId': function(n) {
        if (n != "") {
          this.alarmList = [];
          this.setAlarmList();
        }
      },
    },
    computed: {
      ...mapGetters(['userInfo','partitionId']),
      host() {
        return location.origin;
      }
    },
    created() {
      this.routeData = this.$router.options.routes.filter(_ => _.meta);
      this.current[0] = String(this.pages.findIndex(v => v.name === this.$route.path))
      // 设置监听
    },
    beforeDestroy(){
      if (this.wsLeftArr[0]) {
        this.wsLeftArr[0].close(1000);
      }
    },
    methods: {
      handleEdit(){
        this.$router.push({
          path: '/home/warnList'
        })
      },
      setAlarmList() {
        if (this.wsLeftArr[0]) {
          this.wsLeftArr[0].close(1000);
        }

        this.wsLeftArr[0] = new WebSocket(
          `ws://${websoketURL}/ws/getUnRemovedAlarmList?partitionId=${this.partitionId}`
        );
        this.wsLeftArr[0].onopen = function() {
          console.log("打开ws-setAlarmList");
        };

        this.wsLeftArr[0].onmessage = res => {
          this.alarmList = JSON.parse(res.data);
          console.log('推送 是首页的');
          if(this.alarmList.length > 0){
            this.isWarnBox = true
          }
        };

        this.wsLeftArr[0].onclose = (val) => {
          // 关闭 websocket
          this.alarmList = [];
          if (val.code != 1000) {
            this.errorBox();
          }
          console.log("关闭ws-setAlarmList");
        };
      },
      closeWarnDialog(){
        this.isWarnBox = false
      },
      closeDialog(){
        this.clearDialogSubmit()
      },
      onSubmit(){
        if(this.form.oldPasswd.trim() == '' || this.form.newPasswd.trim() == '' || this.form.confirmPasswd.trim() == ''){
          this.$message({
            type: "info",
            message: "请完善信息后提交"
          });
          return
        }
        if(this.form.newPasswd != this.form.confirmPasswd){
          this.$message({
            type: "info",
            message: "新密码和确认密码不一致"
          });
          return
        }

        let obj = JSON.parse(JSON.stringify(this.form))
        delete obj.confirmPasswd

        changePasswd(obj).then(() => {
          this.clearDialogSubmit()
          this.$message({
            type: "success",
            message: "修改成功"
          });
        })
      },
      clearDialogSubmit(){
        this.dialogTableVisible = false
        for (const key in this.form) {
          this.form[key] = ''
        }
      },
      editPassword(){
        this.dialogTableVisible = true
      },
      logOut(){
        logout().then(() => {
          this.$router.push({
            path: '/loginPage'
          })
        })
      }
    }
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


  .equipmentWarnFixed {
    z-index: 999999;
    position: fixed;
    right: 0;
    bottom: 0;
    height: 2.28rem;
    width: 4.7rem;
    background: url('/static/imgs/loginPage/warnBk.png') no-repeat;
    // background: url("/static/imgs/bk_2.png") center center no-repeat;
    // background-size: contain;
    background-size: 100% 100%;
    padding: .31rem .51rem;
    display: flex;
    flex-direction: column;
    .closeBtn {
      position: absolute;
      top: 0;
      right: 0;
      width: 0.8rem;
      height: 0.6rem;
      cursor: pointer;
    }
    .botttom{
      padding: 0.07rem 0.15rem;
    }
    .leftComtop {
      display: flex;
      align-items: center;
      padding: 0.07rem 0.15rem;
      padding-top: 0;
      img {
        width: 0.15rem;
        height: 0.15rem;
        margin-right: 0.11rem;
      }
      p {
        color: #00a0d8;
        font-size: 0.125rem;
        padding: 0;
        margin: 0;
      }
    }
  }

    .insideWarper{
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      width: 100vw;
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
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: .433rem;
        .cursor{
          cursor: pointer;
        }
        .active{
          color: #035CFF;
          text-decoration: underline;
        }
        span{
          color: #fff;
          padding-right: .157rem;
          font{
            size: .125rem;
          }
        }
      }
    }
  }
</style>
