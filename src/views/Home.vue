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

  </div>
</template>

<script>
  import navMenu from './homeComponents/navMenu';
  import { mapGetters } from 'vuex';
  import { logout, changePasswd } from '@/api/user';
  import dialogBox from '@/components/dialogBox'

  export default {
    name: 'Home',
    components: {
      navMenu,
      dialogBox
    },
    data() {
      return {
        form:{
          oldPasswd: '',
          newPasswd: '',
          confirmPasswd: ''
        },
        dialogTableVisible: false,
        routeData: [],
        current: ['0'],
        levelArr: [],
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
      'current': function(){
        console.log(Number(this.current[0]));
        this.$router.push({
          path: this.pages[Number(this.current[0])].name
        })        
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      host() {
        return location.origin;
      }
    },
    created() {
      this.routeData = this.$router.options.routes.filter(_ => _.meta);
      this.current[0] = String(this.pages.findIndex(v => v.name === this.$route.path))
    },
    methods: {
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
