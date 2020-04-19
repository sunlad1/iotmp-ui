<template>
  <div class="loginContainer">
    <div class="formWrapper">
      <p class="title">
        <img src="/static/imgs/loginPage/logo.png" alt="">
        <span>智慧管廊运维平台</span>
      </p>
      <el-input placeholder="请输入内容" prefix-icon="el-icon-user" v-model="userName"></el-input>
      <el-input placeholder="请输入内容" type="password" prefix-icon="el-icon-lock" v-model="password"></el-input>
      <button class="submit" @click="submit()">登录</button>
    </div>
    <div class="copyRight">
      <p>{{ copyRight }}</p>
    </div>
  </div>
</template>

<script>
import { login, getCopyright } from "@/api/login";
export default {
  data() {
    return {
      userName: "",
      password: "",
      copyRight: ""
    };
  },
  methods: {
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      arr = document.cookie.match(reg);
      if (arr) return unescape(arr[2]);
      else return null;
    },
    submit() {
      if (this.userName.trim() == "" || this.password.trim() == "") {
        this.$message({
          type: "info",
          message: "账号和密码内容不能为空"
        });
        return;
      }
      login({
        username: this.userName,
        password: this.password
      }).then(res => {
        this.$store.dispatch("setUserInfo", res.data);
        this.$router.push({
          path: "/home/welcomePage?isCollapse=true"
        });
      });
    }
  },
  created() {
    getCopyright().then(res => {
      console.log(res);
      this.copyRight = res.data;
    });
  }
};
</script>

<style lang="less">
.loginContainer {
  width: 100vw;
  height: 100vh;
  background-image: url(/static/imgs/loginPage/loginBk.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .copyRight {
		width: 100vw;
		left: 0;
    position: fixed;
    bottom: 15px;
    display: flex;
    justify-content: center;
    p {
      color: #787db8;
      font-size: 0.11rem;
    }
  }
  .formWrapper {
    background-image: url(/static/imgs/loginPage/formBk.png);
    background-size: 100% 100%;
    padding: .50rem .8rem;
    margin-right: 1.8rem;
    .title {
      font-size: 0.25rem;
      background: linear-gradient(to right, #0390ff, #035cff);
      background-clip: text;
      font-weight: bold;
      color: transparent;
      margin-bottom: 0.36rem;
      text-align: center;
      img{
        width: .49rem;
        margin-right: .1rem;
      }
    }
    .el-input__icon {
      height: auto;
    }
    input {
      border: 1px solid #5270fd;
      color: #909aff;
      margin-bottom: 0.31rem;
    }
    .submit {
      height: 0.47rem;
      width: 100%;
      background: linear-gradient(
        126deg,
        rgba(3, 144, 255, 1),
        rgba(3, 92, 255, 1)
      );
      color: #fff;
      text-align: center;
      line-height: 0.47rem;
      font-size: 0.2rem;
      border: none;
    }
  }
}
</style>