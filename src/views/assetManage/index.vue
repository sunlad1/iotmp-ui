<template>
  <div class="operationManageContainer">
    <div class="historyWarnGrid">
      <div class="inGrid">
        <div class="titleGrid" id="monitorGrid">
          <img src="/static/imgs/operationManage/operationIcon.png" alt />
          <p class="subheading" style="margin-right:auto">资产列表</p>
          <div class="searchWrapper">
            <p>设备类型</p>
            <el-input v-model="valueTime" placeholder="请输入"></el-input>
            <!-- <el-date-picker
              v-model="valueTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>-->
          </div>

          <div class="searchWrapper" style="padding: 0 20px">
            <p>设备名称</p>
            <el-input v-model="curPersonList" placeholder="请输入"></el-input>
            <!-- <el-select v-model="curPersonList" placeholder="请选择">
              <el-option
                v-for="item in personList"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>-->
            <!-- <el-input v-model="historySearch" placeholder="请输入设备昵称"></el-input> -->
          </div>
          <el-button type="primary" size="mini" @click="searchClicked">查询</el-button>
          <el-button type="info" size="mini" @click="clearSearch">重置</el-button>
          <el-button type="primary" size="mini" @click="addClicked()">新增</el-button>
        </div>
        <div class="dataGrid" id="historyDataHeight">
          <el-table :height="historyTableHeight" :data="historyAlarmList" style="width: 100%">
            <el-table-column prop="seq" label="序号"></el-table-column>
            <el-table-column prop="organization" label="资产组织"></el-table-column>
            <el-table-column prop="typeCode" label="类别编码"></el-table-column>
            <el-table-column prop="typeName" label="类别名称"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
            <el-table-column prop="crtUsrName" label="创建人"></el-table-column>
            <el-table-column prop="crtTs" label="创建时间"></el-table-column>
            <el-table-column prop="deviceStatus" label="设备状态"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="您确定删除此记录吗？" @onConfirm="delRights(scope.$index,scope.row)">
                  <span slot="reference" class="clickBtn" style="color: #009dd5">删除</span>
                  <!-- <el-button slot="reference">删除</el-button> -->
                </el-popconfirm>
                <!-- <span
                  class="clickBtn"
                  @click="HandleDel(scope.$index, scope.row)"
                  style="color: #009dd5"
                >删除</span>-->
                <span class="bar">|</span>
                <span
                  class="clickBtn"
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color: #009dd5"
                >修改</span>
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
                  <el-form-item label="资产组织">
                    <el-input placeholder="请输入" v-model="form.organization"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类别编号">
                    <el-input placeholder="请输入" v-model="form.typeCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类别名称">
                    <el-input placeholder="请输入" v-model="form.typeName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备名称">
                    <el-input placeholder="请输入" v-model="form.deviceName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备状态">
                    <el-select v-model="form.deviceStatus" placeholder="请选择">
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
import { queryList, addInspection, deleteAsset, updateAsset } from "@/api/assetManage";
import { getAllUser } from "@/api/user";

export default {
  data() {
    return {
      form: {
        organization: "",
        typeCode: "",
        typeName: "",
        deviceName: "",
        deviceStatus: ""
      },
      isAdd: true,
      statusArr: [
        {
          value: "0",
          desc: "已激活"
        },
        {
          value: "1",
          desc: "未激活"
        }
      ],
      historyAlarmList: [],
      totalDataNum: 0,
      inspectPerson: "",
      inspectTime: "",
      historyTableHeight: "0",
      personList: [],
      valueTime: "",
      curPersonList: "",
      pageSize: 0,
      dialogTableVisible: false,
      searchPage: {
        page: 1
      }
    };
  },
  created() {
    // 初始化巡检列表
    this.getHistoryList();
    // 初始化用户列表
    getAllUser().then(res => {
      this.personList = res.data;
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.historyTableHeight = document.querySelector(
        "#historyDataHeight"
      ).offsetHeight;
    });
  },
  watch: {
    curPersonList: function(n) {
      console.log(n);
    },
    valueTime: function(n) {
      console.log("time");
      console.log(n);
    }
  },
  methods: {
    delRights(index, row) {
      this.historyAlarmList.splice(index, 1);
      deleteAsset({
        deleteId: row.id
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
        updateAsset(this.form).then(() => {
          this.$message({
            type: "info",
            message: "修改成功"
          });
          this.dialogTableVisible = false;
          for (const key in this.form) {
            this.form[key] = "";
          }
        })
        return
      }
      addInspection(this.form)
        .then(() => {
          this.$message({
            type: "info",
            message: "新增成功"
          });
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
      this.curPersonList = "";
      this.valueTime = "";
    },
    handleEdit(index,row) {
      this.isAdd = false
      this.form.id = row.id
      this.form.organization = row.organization
      this.form.typeCode = row.typeCode
      this.form.typeName = row.typeName
      this.form.deviceName = row.deviceName
      this.form.deviceStatus = row.deviceStatus === '已激活' ? '0' : '1' 
      this.dialogTableVisible = true;
    },
    searchClicked() {
      // 重新搜索
      if (this.curPersonList === "") {
        // delete this.deviceName.curPersonList;
        delete this.searchPage.deviceName
      } else {
        this.searchPage.deviceName = this.curPersonList;
      }
      if (this.valueTime === "") {
        delete this.searchPage.typeName;
      } else {
        this.searchPage.typeName = this.valueTime;
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