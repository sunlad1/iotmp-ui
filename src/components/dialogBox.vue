<template>
  <div class="dialogBoxContainer">
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="true">
      <div class="fullWrapper">
        <div class="addDialog">
          <div class="closeBtn" @click="closeDialog"></div>
          <div class="dialogHeader">
            <slot name="header"></slot>
          </div>
          <div class="dialogForm">
              <slot name="middle"></slot>
          </div>
          <div class="operationWrapper">
            <el-button size="mini" type="primary" @click="onSubmit">提交</el-button>
            <el-button size="mini" @click="clearDialogSubmit">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
        }
    },
    props:{
        dialogTableVisible: {
            type: Boolean
        }
    },
    methods:{
        closeDialog(){
            this.$emit('closeDialog')
        },
        onSubmit(){
            this.$emit('onSubmit')
        },
        clearDialogSubmit(){
            this.$emit('clearDialogSubmit')
        }
    }
}
</script>

<style lang="less">
.dialogBoxContainer{
  .fullWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .operationWrapper {
      display: flex;
      justify-content: flex-end;
      padding-right: 0.3rem;
    }
    .dialogForm {
      box-sizing: border-box;
      padding-left: 0.6rem;
      padding-right: 0.3rem;
      padding-top: 0.3rem;
    }
    .dialogHeader {
      padding-top: 0.23rem;
      display: flex;
      align-items: center;
      padding-left: 0.3rem;
      input {
        background-color: transparent;
      }
      img {
        width: 0.2rem;
        height: 0.2rem;
        margin-right: 0.11rem;
      }
      p {
        color: #119bd8;
        font-size: 0.15rem;
        margin: 0;
      }
    }
    .addDialog {
      width: 4.87rem;
      height: 2.51rem;
      background: url("/static/imgs/operationManage/addBk.png") center center
        no-repeat;
      background-size: 100% 100%;
      position: relative;
      textarea {
        background: transparent;
      }
      .closeBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 0.8rem;
        height: 0.6rem;
        cursor: pointer;
      }
    }
  }

  .el-dialog {
    background: transparent;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__header {
    height: 0;
    padding: 0;
    .el-dialog__headerbtn {
      display: none;
    }
  }

}
</style>