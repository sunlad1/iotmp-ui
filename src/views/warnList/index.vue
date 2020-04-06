<template>
  <div class="warnListContainer">
    <div class="realTimeDataGrid">
      <div class="inGrid">
        <div class="titleGrid" id="monitorGrid">
          <img src="/static/imgs/dataMonitor/historyIcon.png" alt />
          <p>实时告警列表</p>
        </div>
        <div class="dataGrid" id="dataHeight">
          <el-table :height="tableHeight" :data="alarmList" style="width: 100%">
            <el-table-column prop="alarmDeviceName" label="报警名称"></el-table-column>
            <el-table-column prop="alarmSource" label="报警源"></el-table-column>
            <el-table-column prop="alarmType" label="报警类型"></el-table-column>
            <el-table-column prop="alarmAttr" label="源属性"></el-table-column>
            <el-table-column prop="alarmDescribe" label="报警描述"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="clickBtn addTimeBox" @click="relieveHandleEdit(scope.$index, scope.row)" style="color: #009dd5">
                  <p>解除报警</p>
                  <div class="chooseTimeGrid">
                    <el-date-picker
                      :prefix-icon="''"
                      @change="changeTime"
                      v-model="relieveTime"
                      type="datetime"
                      placeholder="解除报警">
                    </el-date-picker>
                  </div>
                </div>
                <!-- <span class="clickBtn" @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5">解除报警</span> -->
                <span style="padding:0 5px;color: #16EAF7;">|</span>
                <span class="clickBtn" @click="logHandleEdit(scope.$index, scope.row)" style="color: #009dd5">记录日志</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="setWarnGrid">
      <div class="inGrid">
        <div class="titleGrid" id="monitorGrid">
          <img src="/static/imgs/warnList/setIcon.png" alt />
          <p style="margin-right:auto;">报警设置</p>
          <el-button type="primary" round size="mini" @click="upalarmEvents">修改</el-button>
        </div>
        <div class="dataGrid">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
            >
              <div class="stepWarpper" v-if="index === 0">
                <p class="title activeColor">阈值设置：</p>
                <ul class="stepGrid">
                  <li v-for="(item,index) in alarmConfig.configList" :key="index">
                    <span class="activeColor">{{ item.subscribeTitle }}:</span>
                    <span>上限</span>
                    <input type="text" :value="item.maxValue" @input="changeInput($event,index)">
                    <!-- <span class="activeColor">{{ item.maxValue }}</span> -->
                    <span>℃</span>
                    <span class="bar"></span>
                    <span>下限</span>
                    <input type="text" :value="item.minValue">
                    <!-- <span class="activeColor">{{ item.minValue }}</span> -->
                    <span>℃</span>
                  </li>
                </ul>
              </div>
              <div v-else class="stepWarpper">
                <p class="title activeColor">是否报警：</p>
                <div style="padding-inline-start: 20px !important;">
                  <el-radio v-model="isWarn" label="1">是</el-radio>
                  <el-radio v-model="isWarn" label="0">否</el-radio>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    <div class="historyWarnGrid">
      <div class="inGrid">
        <div class="titleGrid" id="monitorGrid">
          <img src="/static/imgs/warnList/timesIcon.png" alt />
          <p style="margin-right:auto">历史报警信息</p>
          <el-cascader
            placeholder="请选择设备类型"
            v-model="cascaderValue"
            :options="options"
            :props="{ expandTrigger: 'hover',value: 'id',label:'partitionName',children: 'childPartition' }"
            @change="handleChange">
          </el-cascader>
          <div style="padding: 0 20px">
            <el-cascader
              placeholder="请选择设备名称"
              v-model="cascaderValue1"
              :options="optionsName"
              :props="{ expandTrigger: 'hover',value: 'id',label:'deviceName',children: 'deviceList' }"
              @change="handleChangeName">
            </el-cascader>
            <!-- <el-input v-model="historySearch" placeholder="请输入设备昵称"></el-input> -->
          </div>
          <el-button type="info" size="mini" @click="searchClicked">查询</el-button>         
          <el-button type="info" plain size="mini">重置</el-button>         
        </div>
        <div class="dataGrid" id="historyDataHeight">
          <el-table :height="historyTableHeight" :data="historyAlarmList" style="width: 100%">
            <el-table-column prop="deviceName" label="报警设备"></el-table-column>
            <el-table-column prop="deviceArea" label="所属区域"></el-table-column>
            <el-table-column prop="alarmSource" label="报警源"></el-table-column>
            <el-table-column prop="alarmType" label="报警类型"></el-table-column>
            <el-table-column prop="alarmAttr" label="源属性"></el-table-column>
            <el-table-column prop="alarmDescribe" label="报警描述"></el-table-column>
            <el-table-column prop="startTs" label="开始报警时间"></el-table-column>
            <el-table-column prop="endTs" label="解除报警时间"></el-table-column>
            <el-table-column prop="handleLog" label="日志"></el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="block" style="text-align:right">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchPage.page"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="totalDataNum"
          ></el-pagination>
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
import { websoketURL } from "@/config/env";
import { removeAlarm, recordLog, getAlarmConfig, updateAlarmConfig, getDeviceByPartitionId, getAlarmRecord } from '@/api/warnList'
import { getPartitionList } from '@/api/home'

export default {
  name: "warnList",
  data() {
    return {
      historySearch: '',
      alarmConfig: {},
      alarmList: [],
      historyAlarmList: [],
      totalDataNum: 0,
      tableHeight: "0",
      historyTableHeight: '0',
      wsLeftArr: [],
      relieveTime: '',
      isWarn: '0',
      alarmId: '',
      options:[],
      optionsName: [],
      cascaderValue: [],
      cascaderValue1: [],
      searchId: '',
      searchNameId: '',
      searchPage: {
        page: 1
      },
      activities: [
        {
          content: "支持使用图标",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "支持自定义颜色",
          timestamp: "2018-04-03 20:46",
          color: "#0bbd87"
        }
      ]
    };
  },
  watch:{
    'isWarn': function(n){
      if(n == 0){
        this.alarmConfig.disabled = false
      }else{
        this.alarmConfig.disabled = true
      }
    }
  },
  methods: {
    handleCurrentChange(e) {
      // 分页数据改变
      this.searchPage.page = e;
      this.getHistoryList();
    },
    getHistoryList(){
      getAlarmRecord(this.searchPage).then(res => {
        this.historyAlarmList = [...this.historyAlarmList,...res.data.content]
        this.totalDataNum = res.data.totalElements;
      })
    },
    searchClicked(){
      // 重新搜索 
      if(this.searchId === ''){
        return
      }else{
        this.searchPage.partitionId = this.searchId
      }

      if(this.searchNameId === ''){
        delete this.searchPage.deviceId
      }else{
        this.searchPage.deviceId = this.searchNameId
      }
      // 页数初始化
      this.searchPage.page = 1
      this.historyAlarmList = []
      this.getHistoryList()
    },
    handleChangeName(value){
      this.searchNameId = value[value.length - 1]
    },
    handleChange(value){
      this.searchId = value[value.length - 1]
      // 选择分区后 直接获取设备列表
      getDeviceByPartitionId({
        partitionId: this.searchId
      }).then(res=> {
        (res.data || []).map(v => {
          v.deviceName = v.groupName
        })
        this.optionsName = res.data
        //清空设备类型数据 重新选择
        this.searchNameId = ''
      })

    },
    upalarmEvents(){
      let {groupId, disabled, configList} = this.alarmConfig
      updateAlarmConfig({
        groupId,
        disabled,
        configList
      }).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
      })
    },
    changeInput(e,index){
      this.alarmConfig.configList[index] = e.srcElement.value
    },
    getGetAlarmConfig(){
      getAlarmConfig().then(res => {
        this.alarmConfig = res.data
        this.isWarn = this.alarmConfig.disabled ? '1' : '0'
      })
    },
    changeTime(){
      // 获取时间 设置解除告警时间
      removeAlarm({
        alarmId: this.alarmId,
        endTime: new Date(this.relieveTime).format("yyyy-MM-dd hh:mm:ss")
      }).then(res => {
        console.log(res + '解除成功');
      })
    },
    logHandleEdit(index,row){
      let that = this
      this.$prompt('请输入距离内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        recordLog({
          alarmLog: value,
          alarmId: row.id
        }).then(() => {
          that.$message({
            type: 'success',
            message: '提交成功'
          });
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '取消输入'
        });       
      })
    },
    relieveHandleEdit(index,row){
      this.alarmId = row.id
    },
    setAlarmList() {
      if (this.wsLeftArr[0]) {
        this.wsLeftArr[0].onclose(true);
      }

      this.wsLeftArr[0] = new WebSocket(
        `ws://${websoketURL}/ws/getUnRemovedAlarmList`
      );
      this.wsLeftArr[0].onopen = function() {
        console.log("打开ws-setAlarmList");
      };

      this.wsLeftArr[0].onmessage = res => {
        this.alarmList = JSON.parse(res.data);
        console.log('推送内容');
        console.log(this.alarmList);
      };

      this.wsLeftArr[0].onclose = function(flag) {
        // 关闭 websocket
        this.alarmList = [];
        if (!flag) {
          this.errorBox();
        }
        console.log("关闭ws-setAlarmList");
      };
    },
    recursionList(array){
      for (let index = 0; index < array.length; index++) {
        if(array[index].childPartition.length == 0){
          delete array[index].childPartition
        }else{
          array[index].childPartition = this.recursionList(array[index].childPartition)
        }        
      }
      return array
    },
    initPartitionList(){
      getPartitionList().then(res => {
        res.data = this.recursionList(res.data)
        console.log(res.data);
        this.options = res.data
      })
    }
  },
  created() {
    // 获取实时告警列表
    this.setAlarmList();
    // 获取报警设置
    this.getGetAlarmConfig()
    // 获取分区接口
    this.initPartitionList()
    // 获取报警列表
    this.getHistoryList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.querySelector("#dataHeight").offsetHeight;
      this.historyTableHeight = document.querySelector('#historyDataHeight').offsetHeight;
    });
  }
};
</script>

<style lang="less">
.warnListContainer {
  display: flex;
  flex-direction: column;
  padding: 0.23rem;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  .clickBtn{
    cursor: pointer;
    user-select: none;
  }
  .dataGrid{
    flex: 1;
    .cell{
      display: flex;
    }
    .addTimeBox{
      position: relative;
      p{
        margin-bottom: 0;
      }
      .chooseTimeGrid{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }
    // 设置日历选择框的样式
    .el-date-editor.el-input{
      opacity: 0;
      width: auto !important;
      .el-input__prefix{
        display: none;
      }
      .el-input__inner{
        padding-left: 0 !important;
        padding-right: 0 !important;
        border: none !important;
        width: 50px !important;
        color: rgb(0, 157, 213) !important;
        cursor: pointer;
        &::-webkit-input-placeholder { /* WebKit browsers */
          color: rgb(0, 157, 213) !important;
        }
      }
      .el-input__suffix{
        display: none;
      }
    }
  }
  .stepWarpper{
    display: flex;
    align-items: flex-start;
    .title{
      word-break: keep-all;
    }
    .activeColor{
      color: #00C3FF;
    }
    .stepGrid{
      color: #DDDDDD;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-inline-start: 20px !important;
      li{
        width: 25%;
        min-width: 25%;
        display: flex;
        align-items: center;
        margin-bottom: .157rem;
        input{
          background: transparent;
          border: none;
          width: 50px;
          text-align: center;
          color: #00C3FF;
        }
      }
      .bar{
        width: 1px;
        height: .157rem;
        background:rgba(255,255,255,.2);
        margin: 0 .173rem;
        display: inline-block;
      }
      font{
        size: .125rem;
      };
    }
  }
  .el-timeline-item{
        padding-bottom: 0 !important;
  }
  .el-timeline-item__node--normal{
    left: -8px;
    top: -5px;
    width: 0.2rem;
    height: 0.2rem;
    min-height: 0.2rem;
    max-height: 0.2rem;
    min-width: 0.2rem;
    max-width: 0.2rem;
    background: url("/static/imgs/warnList/stepIcon.png") center center
      no-repeat;
    background-size: 100% 100%;
    background-color: transparent !important;
  }

  .el-timeline-item__tail {
    border-left: 2px solid #0363FF !important;
  }
  .el-icon-more {
    width: 0.2rem;
    height: 0.2rem;
    min-height: 0.2rem;
    max-height: 0.2rem;
    min-width: 0.2rem;
    max-width: 0.2rem;
    background: url("/static/imgs/warnList/stepIcon.png") center center
      no-repeat;
    background-size: 100% 100%;
    &:before {
      content: "" !important;
    }
  }
  .inGrid {
    display: flex;
    flex-direction: column;
    padding: 0.07rem;
    max-height: 100%;
    height: 100%;
  }
  .titleGrid {
    padding-bottom: 0.12rem;
    display: flex;
    align-items: center;
    padding-left: 0.15rem;
    p {
      font-size: 0.18rem;
      margin: 0;
    }
    img {
      width: 0.15rem;
      height: 0.15rem;
      margin-right: 0.11rem;
    }
  }
  .historyWarnGrid {
    width: 100%;
    flex: 4;
    background: url("/static/imgs/warnList/bk3.png") center center no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .el-input__inner{
      height: 28px;
    }
  }
  .setWarnGrid {
    width: 100%;
    flex: 3;
    overflow: hidden;
    background: url("/static/imgs/warnList/bk2.png") center center no-repeat;
    background-size: 100% 100%;
    margin-bottom: 20px;
  }
  .realTimeDataGrid {
    width: 100%;
    flex: 3;
    margin-bottom: 20px;
    background: url("/static/imgs/warnList/bk1.png") center center no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
}
</style>