<template>
  <div class="operationManageContainer">
    <div class="historyWarnGrid">
      <div class="inGrid">
        <div class="titleGrid" id="monitorGrid">
          <img src="/static/imgs/operationManage/operationIcon.png" alt />
          <p style="margin-right:auto">用户列表</p>
          <div class="searchWrapper" style="padding: 0 20px">
            <p>用户名</p>
            <el-input v-model="valueTime" placeholder="请输入"></el-input>
          </div>
          <el-button type="info" size="mini" @click="searchClicked">查询</el-button>
          <el-button type="info" size="mini" @click="clearSearch">重置</el-button>
          <el-button type="primary" size="mini" @click="addClicked()" v-if="userInfo.roleId == 0">新增</el-button>
        </div>
        <div class="dataGrid" id="historyDataHeight">
          <el-table :height="historyTableHeight" :data="historyAlarmList" style="width: 100%">
            <el-table-column prop="seq" label="序号"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="realName" label="姓名"></el-table-column>
            <el-table-column prop="tel" label="联系方式"></el-table-column>
            <el-table-column prop="role" label="账户角色"></el-table-column>
            <el-table-column prop="crtTs" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="您确定重置此用户密码吗？" @onConfirm="resetPassword(scope.$index,scope.row)">
                  <span slot="reference" class="clickBtn" style="color: #009dd5">重置密码</span>
                </el-popconfirm>  
                <span class="bar">|</span>
                <span
                  class="clickBtn"
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color: #009dd5"
                >修改</span>
                <span class="bar" v-if="userInfo.roleId == 0">|</span>
                <el-popconfirm title="您确定删除此记录吗？" @onConfirm="delRights(scope.$index,scope.row)">
                  <span slot="reference" class="clickBtn" style="color: #009dd5" v-if="userInfo.roleId == 0">删除</span>
                </el-popconfirm>                
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="block" style="text-align:right">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchPage.page"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalDataNum"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="true">
      <div class="fullWrapper">
        <div class="addDialog">
          <div class="closeBtn" @click="closeDialog"></div>
          <div class="dialogHeader">
            <img src="/static/imgs/operationManage/operationIcon.png" alt />
            <p style="margin-right:auto">运维信息新增</p>
          </div>
          <div class="dialogForm">
            <el-form ref="form" :model="form" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="用户名">
                    <el-input placeholder="请输入" v-model="form.username"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="姓名">
                    <el-input placeholder="请输入" v-model="form.realName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式">
                    <el-input placeholder="请输入" v-model="form.tel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="userInfo.roleId == 0">
                  <el-form-item label="账户角色">
                    <el-select v-model="form.roleId" placeholder="请选择">
                      <el-option
                        v-for="item in statusArr"
                        :key="item.value"
                        :label="item.desc"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
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
import { getAllUser } from "@/api/user";
import { queryList, resetPasswd, deleteUser, updateUser, addUser } from "@/api/systemManage";
  import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {
        username: "",
        realName: "",
        tel: "",
        roleId: ""
      },
      isAdd: true,
      statusArr: [
        {
          value: "0",
          desc: "系统管理员"
        },
        {
          value: "1",
          desc: "平台操作员"
        }
      ],
      historyAlarmList: [],
      totalDataNum: 0,
      inspectPerson: "",
      inspectTime: "",
      historyTableHeight: "0",
      personList: [],
      valueTime: "",
      pageSize: 0,
      dialogTableVisible: false,
      searchPage: {
        page: 1
      }
    };
  },
  created() {
    if(this.userInfo.roleId != 0){
      delete this.form.roleId
    }
    // 初始化巡检列表
    this.getHistoryList();
    // 初始化用户列表
    getAllUser().then(res => {
      this.personList = res.data;
    });
  },
  computed:{
      ...mapGetters(['userInfo']),
  },
  mounted() {
    this.$nextTick(() => {
      this.historyTableHeight = document.querySelector(
        "#historyDataHeight"
      ).offsetHeight;
    });
  },
  watch: {
  },
  methods: {
    resetPassword(index,row){
      resetPasswd({
        userId: row.id
      }).then(() => {
        this.$message({
          type: "success",
          message: "重置成功"
        });
      });
    },
    delRights(index, row) {
      this.historyAlarmList.splice(index, 1);
      deleteUser({
        userId: row.id
      }).then(() => {
        this.$message({
          type: "info",
          message: "删除成功"
        });
      });
    },
    addClicked(){
      this.dialogTableVisible = true;
      this.isAdd = true
    },
    clearDialogSubmit() {
      this.dialogTableVisible = false;
      for (const key in this.form) {
        this.form[key] = "";
      }
    },
    onSubmit() {
      for (const key in this.form) {
        if(key === 'id'){
          continue
        }
        if (this.form[key].trim() === "") {
          this.$message({
            type: "info",
            message: "请完善信息"
          });
          return;
        }
      }
      if(!this.isAdd){
        updateUser(this.form).then(() => {
          this.$message({
            type: "info",
            message: "修改成功"
          });
          this.getHistoryList()
          this.dialogTableVisible = false;
          for (const key in this.form) {
            this.form[key] = "";
          }
        })
        return
      }
      addUser(this.form)
        .then(() => {
          this.$message({
            type: "info",
            message: "新增成功"
          });
          this.getHistoryList()
          this.dialogTableVisible = false;
          for (const key in this.form) {
            this.form[key] = "";
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "新增失败，请重试"
          });
        });
    },
    closeDialog() {
      this.dialogTableVisible = false;
    },
    clearSearch() {
      this.valueTime = "";
      delete this.searchPage.realName;
      this.searchPage.page = 1;
      this.historyAlarmList = [];
      this.getHistoryList();
    },
    handleEdit(index,row) {
      this.isAdd = false
      this.form.id = row.id
      this.form.username = row.username
      this.form.realName = row.realName
      this.form.tel = row.tel
      if(this.userInfo.roleId == 0){
        this.form.roleId = row.roleId === '系统管理员' ? '0' : '1' 
      }
      this.dialogTableVisible = true;
    },
    searchClicked() {
      // 重新搜索
      if (this.valueTime === "") {
        return;
      }
      if (this.valueTime === "") {
        delete this.searchPage.realName;
      } else {
        this.searchPage.realName = this.valueTime;
      }
      // 页数初始化
      this.searchPage.page = 1;
      this.historyAlarmList = [];
      this.getHistoryList();
    },
    handleCurrentChange(e) {
      // 分页数据改变
      this.searchPage.page = e;
      this.getHistoryList();
    },
    getHistoryList() {
      queryList(this.searchPage).then(res => {
        this.historyAlarmList = res.data.content;
        this.totalDataNum = res.data.totalElements;
        this.pageSize = res.data.size;
      });
    }
  }
};
</script>

<style lang="less">
.operationManageContainer {
  display: flex;
  flex-direction: column;
  padding: 0.23rem;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  .clickBtn {
    cursor: pointer;
  }
  .bar {
    padding: 0 0.03rem;
    color: rgb(0, 157, 213);
  }
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
  .dataGrid {
    flex: 1;
  }
  .historyWarnGrid {
    width: 100%;
    flex: 1;
    background: url("/static/imgs/operationManage/operationBk.png") center
      center no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .titleGrid {
      padding-bottom: 0.12rem;
      display: flex;
      align-items: center;
      padding-left: 0.15rem;
      input {
        background-color: transparent;
      }
      .el-date-editor .el-range-separator {
        line-height: initial;
      }
      .el-input__icon {
        line-height: initial;
      }
      p {
        font-size: 0.15rem;
        margin: 0;
      }
      img {
        width: 0.15rem;
        height: 0.15rem;
        margin-right: 0.11rem;
      }
      .searchWrapper {
        display: flex;
        align-items: center;
        white-space: nowrap;
        p {
          font-size: 0.13rem;
          margin: 0;
          padding-right: 0.1rem;
        }
      }
    }
    .inGrid {
      display: flex;
      flex-direction: column;
      padding: 0.1rem;
      max-height: 100%;
      height: 100%;
    }
    .el-input__inner {
      height: 28px;
    }
  }
}
</style>