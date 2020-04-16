<!--
 * @Author: slw
 * @Date: 2020-03-25 13:49:50
 * @LastEditTime: 2020-03-25 21:47:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /iotmp-ui/src/views/dataMonitor/index.vue
 -->
<template>
  <div class="dataMonitor">
    <!-- 以及筛选 -->
    <div class="oneLevelFilter">
      <el-menu
        :default-active="activeIndex1"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect1"
        background-color="#0A082A"
        text-color="#2DA2FD"
        active-text-color="#00FFD8"
      >
        <el-menu-item
          :index="String(index)"
          v-for="(item,index) in filterArr1"
          :key="index"
        >
        <!-- <img :src="item." alt=""> -->
        {{ item.groupName }}
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 二级筛选  -->
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect2"
      background-color="#0A082A"
      text-color="#2DA2FD"
      active-text-color="#00FFD8"
    >
      <el-menu-item
        :index="String(index)"
        v-for="(item,index) in filterArr2"
        :key="index"
      >{{ item.deviceName }}</el-menu-item>
    </el-menu>
    <div class="monitorWrapper">
      <!-- 表格数据 -->
      <div class="monitorTableGrid" id="monitorTableGrid">
        <div class="inGrid">
          <div class="titleGrid" id="monitorGrid">
            <img src="/static/imgs/dataMonitor/historyIcon.png" alt />
            <p style="margin-right: auto;">{{ filterArr1.length > 0 && filterArr1[Number(activeIndex1)].groupName }}#{{ filterArr2.length > 0 && filterArr2[Number(activeIndex2)].deviceName }}历史数据</p>
            <div class="searchWrapper">
              <p>设备采集起止时间</p>
              <el-date-picker
                v-model="valueTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <el-button type="primary" size="mini" @click="searchClicked">查询</el-button>         
            <el-button type="info" size="mini" @click="clearSearch">重置</el-button>    
          </div>
          <div class="dataGrid" id="dataHeight">
            <el-table :height="tableHeight" :data="historyList" style="width: 100%">
              <el-table-column v-for="(item,index) in tableList" :key="index" :prop="String(index)" :width="item == '设备地址' ? '200px' : 'auto' " :label="item"></el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="block" style="text-align:right">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="pageNumber"
              :page-size="10"
              layout="total, prev, pager, next"
              :total="totalDataNum"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="chartsGrid" id="echartsGridParent" v-show="radioArr.length > 0">
        <div class="titleGrid">
          <img src="/static/imgs/dataMonitor/historyIcon.png" alt />
          <p
            style="margin-right:auto;"
          >{{ filterArr1.length > 0 && filterArr1[Number(activeIndex1)].groupName }}#{{ filterArr2.length > 0 && filterArr2[Number(activeIndex2)].deviceName }}历史数据</p>
          <div>
            <!-- :label="item.subscribeId" -->
            <el-radio-group v-model="radio">
              <el-radio
                :label="index"
                v-for="(item,index) in radioArr"
                :key="index"
              >{{ item.subscribeTitle }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div id="chartsGrid"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getHistoryRecord,
  getAllDeviceGroup,
  getChartsDataKeys
} from "@/api/dataMonitor";
import { mapGetters } from "vuex";
import { websoketURL } from "@/config/env";

var echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/markPoint");
require("echarts/lib/component/markLine");

var data = [];
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
for (var i = 0; i < 1000; i++) {
  data.push(randomData());
}

function randomData() {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
      Math.round(value)
    ]
  };
}

export default {
  data() {
    return {
      valueTime:[],
      tableList:[],
      activeIndex1: null,
      activeIndex2: null,
      filterArr1: [],
      filterArr2: [],
      historyList: [],
      totalDataNum: 0,
      pageNumber: 1,
      tableHeight: "0",
      wsObj: null,
      radioArr: [1],
      radio: null,
      echartsData: [],
      echartStyle: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    ...mapGetters(["partitionId"])
  },
  watch: {
    activeIndex1: function(n) {
      if (!n) return;
      this.filterArr2 = this.filterArr1[Number(n)].deviceList;
      this.activeIndex2 = "0";
      this.getGroupData();
      this.pageNumber = 1
      this.getHistoryList();
    },
    activeIndex2: function(n) {
      if (!n) return;
      this.getGroupData();
      this.pageNumber = 1
      this.getHistoryList()
    },
    'partitionId': {
      handler: function(n) {
        if(n != ''){
          this.getFilterData();
        }
      },
      immediate: true
    },
    radio: function(n) {
      if (!n && n != 0) return;
      // 类型改变重新渲染 echarts
      this.setEchartsData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        // 覆盖table的高度
        this.tableHeight = document.querySelector("#dataHeight").offsetHeight;
        // 覆盖echarts的高度
        let height = document.querySelector("#chartsGrid").offsetHeight;
        let width = document.querySelector("#chartsGrid").offsetWidth;
        document.querySelector("#chartsGrid").style.width = width;
        document.querySelector("#chartsGrid").style.height = height;
        // 赋值宽高后再绘制
        this.initEcharts();
      }, 500);
    });
  },
  beforeDestroy(){
    if (this.wsObj) {
      this.wsObj.close(1000);
    }
  },
  methods: {
    clearSearch(){
      this.valueTime = []
    },
    searchClicked(){
      let obj = {
        deviceId: this.filterArr2[Number(this.activeIndex2)].id,
        page: 1
      }

      if(this.valueTime.length > 0){
        Object.assign(obj,{
          startTs: new Date(this.valueTime[0]).format('yyyy-MM-dd hh:mm:ss'),
          endTs: new Date(this.valueTime[1]).format('yyyy-MM-dd hh:mm:ss')
        })
      }
      getHistoryRecord(obj).then(res => {
        this.historyList = res.data.values;
        this.totalDataNum = res.data.total;
        this.tableList = res.data.subscribeTitles
      });
    },
    // 获取走势图数据
    setEchartsData() {
      if(!this.radioArr || this.radioArr.length== 0){
        return
      }
      if (this.wsObj) {
        this.wsObj.close(1000);
      }
      this.wsObj = new WebSocket(
        `ws://${websoketURL}/ws/getMeterHistoryRecord?subscribeId=${
          this.radioArr[this.radio].subscribeId
        }&deviceId=${this.filterArr2[Number(this.activeIndex2)].id}`
      );
      this.wsObj.onopen = function() {
        console.log("打开ws-setEchartsData");
      };

      this.wsObj.onmessage = res => {
        this.echartsData = JSON.parse(res.data);
        this.initEcharts();
      };

      this.wsObj.onclose = (val) => {
        // 关闭 websocket
        this.echartsData = [];
        if (val.code != 1000) {
          this.errorBox();
        }
        console.log("关闭ws-setEchartsData");
      };
    },
    errorBox() {
      this.$notify({
        title: "提示",
        message: "数据监控出现异常，请刷新网页",
        duration: 0
      });
    },
    // 获取分组数据
    async getGroupData() {
      try {
        let res = await getChartsDataKeys({
          deviceId: this.filterArr2[Number(this.activeIndex2)].id
        });
        this.radioArr = res.data || [];
        this.radio = 0
        // this.setEchartsData()
        // this.radio = this.radioArr.length > 0 && this.radioArr[0].subscribeId;
        // this.historyList = res.data
      } catch (error) {
        console.log(error);
      }
    },
    handleCurrentChange(e) {
      // 分页数据改变
      this.pageNumber = e;
      this.getHistoryList();
    },
    getHistoryList() {
      getHistoryRecord({
        deviceId: this.filterArr2[Number(this.activeIndex2)].id,
        page: this.pageNumber
      }).then(res => {
        this.historyList = res.data.values;
        this.totalDataNum = res.data.total;
        this.tableList = res.data.subscribeTitles
      });
    },
    getFilterData() {
      // 当分区改变时 初始化所有变量
      this.initAllVariable();
      getAllDeviceGroup({
        partitionId: this.partitionId
      }).then(res => {
        this.filterArr1 = res.data;
        this.filterArr2 = res.data[0].deviceList;
        this.activeIndex1 = "0";
        this.activeIndex2 = "0";
        this.radio = null;
      });
    },
    initAllVariable() {
      this.activeIndex1 = null;
      this.activeIndex2 = null;
      this.radio = null;
    },
    handleSelect1(key) {
      this.activeIndex1 = String(key)
    },
    handleSelect2(key) {
      this.activeIndex2 = String(key)
    },
    initEcharts() {
      // 找到y的最大值
      let num = this.echartsData[0] && Number(this.echartsData[0].value[1]) || 0;
      let minNum = this.echartsData[0] && Number(this.echartsData[0].value[1]) || 0;
      (this.echartsData || []).forEach(v => {
        if(Number(v.value[1]) > num){
          num = Number(v.value[1])
        }

        if(Number(v.value[1]) < minNum){
          minNum = Number(v.value[1])
        }

      })

      if(num == minNum){
        num = num + 0.01
      }

      let myChart = echarts.init(document.getElementById("chartsGrid"));
      let option = {
        grid: {
          top: "20px",
          left: "50px",
          right: "15px",
          bottom: "50px"
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
            lineStyle: {
                // 使用深浅的间隔色
                color: '#5FC8E1'
            }
          },
          axisLine:{
              lineStyle:{
                  color:'#5FC8E1'
              }
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          max: function() {
              return Number(num);
          },
          min: function() {
              return Number(minNum);
          },
          splitLine: {
            show: true,
            lineStyle: {
                // 使用深浅的间隔色
                color: '#5FC8E1'
            }
          },
          axisLine:{
              show: false,
              lineStyle:{
                  color:'#5FC8E1' //transparent
              }
          }
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.echartsData,
            itemStyle: {
                normal: {
                    color: '#0363FF',
                    lineStyle:{
                      width: 4
                    }
                }
            }
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="less">
// 包含X轴的NavMenu的修改样式
.dataMonitor {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  padding-left: 25px;
  display: flex;
  flex-direction: column;
    .el-input__inner{
      height: 28px;
    }
  .monitorWrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-bottom: 0.23rem;
    overflow: hidden;
    .titleGrid {
      padding-bottom: 0.12rem;
      display: flex;
      align-items: center;
      padding-left: 0.15rem;
      input{
        background-color: transparent;
      }
      .el-date-editor .el-range-separator{
        line-height: initial;
      }
      p {
        font-size: 0.18rem;
        margin: 0;
      }
      img {
        width: 0.15rem;
        height: 0.15rem;
        margin-right: 0.11rem;
      }
      .el-input__icon{
        line-height: initial;
      }
      .searchWrapper{
        display: flex;
        align-items: center;
        margin-right: 10px;
        p{
          font-size: 0.13rem;
          margin: 0;
          padding-right: 0.1rem;
        }
      }
    }
    .monitorTableGrid {
      flex: 0.5;
      background: url("/static/imgs/dataMonitor/bk2.png") no-repeat;
      background-size: 100% 100%;
      overflow: auto;
      .inGrid {
        display: flex;
        flex-direction: column;
        padding: 0.12rem;
        max-height: 100%;
        height: 100%;
      }
      .dataGrid {
        flex: 1;
        overflow: hidden;
      }
    }
    .chartsGrid {
      flex: 0.5;
      overflow: hidden;
      background: url("/static/imgs/dataMonitor/bk1.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 20px;
      padding: 0.12rem;
      display: flex;
      flex-direction: column;
      #chartsGrid {
        flex: 1;
        overflow: hidden;
      }
    }
  }

  .el-table thead {
    color: #ddd;
  }

  .el-table::before {
    height: 0 !important;
  }
  .el-table {
    background: transparent !important;
    color: #ddd !important;
  }
  .el-table td,
  .is-leaf {
    border-bottom: 1px solid #3625ab;
  }

  .el-table th {
    border: none !important;
  }

  .el-table th,
  .el-table tr {
    background: transparent !important;
  }

  .el-table .cell {
    white-space: nowrap;
    // max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: 1px solid rgba(3, 99, 255, 0.3) !important;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom-color: transparent !important;
  }
  .oneLevelFilter {
    .el-menu--horizontal > .el-menu-item.is-active {
      background-color: rgba(0, 255, 255, 0.1) !important;
    }
  }
}
</style>