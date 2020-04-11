<template>
  <div class="monitorList">
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="true">
      <div class="fullWrapper">
        <div class="addDialog">
          <div class="closeBtn" @click="closeDialog"></div>
          <p class="title">防火分区1#分组列表</p>
          <el-carousel
            trigger="click"
            height="4.2rem"
            :autoplay="false"
            indicator-position="outside"
          >
            <el-carousel-item v-for="(v,vi) in totalList" :key="vi">
              <div class="gridWrapper">
                <div
                  class="environmentControl"
                  style="padding-left: .13rem;"
                  v-for="(el,i) in v"
                  :key="i"
                >
                  <div class="leftComtop">
                    <img src="/static/imgs/home_icon2.png" alt />
                    <p class="mainTitle" style="margin-right: auto">环控仪表{{ vi*4 + i + 1 }}#</p>
                  </div>
                  <div class="botttom" style="padding-bottom:.15rem;">
                    <div class="environmentBk">
                      <div class="circle">
                        <span
                          class="level"
                          v-if="el.meterLevelObj.level == '优'"
                        >{{ el.meterLevelObj.level }}</span>
                        <span class="level" style="color:red" v-else>{{ el.meterLevelObj.level }}</span>
                        <span>{{ el.meterLevelObj.partitionName }}</span>
                        <span>当前状态</span>
                      </div>
                      <div class="manyData">
                        <div
                          v-for="(item,index) in el.meterList"
                          :key="index"
                          class="enItem"
                          :style="{'justify-content': item.id ? 'flex-start' : 'flex-end'}"
                        >
                          <div class="item" v-if="item.id">
                            <div class="point">
                              <span></span>
                            </div>
                            <span>{{ item.valueName }}</span>
                            <span class="bar">|</span>
                            <span>{{ item.deviceValue }}{{ item.valueUnitName }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { websoketURL } from "@/config/env";

export default {
  name: "monitorList",
  data() {
    return {
      meterLevelObj: {},
      wsLeftArr: [
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        []
      ],
      meterList: [],
      /**
       * 二维数组进行轮播的每个页面展示的数量为4个进行拆分
       * totalList:[
       * 	[
       * 		{
       * 				deviceId:''
       * 				meterLevelObj:{},
       * 				meterList: []
       *    }
       * 	],
       *  []
       * ]
       */
      totalList: []
    };
  },
  props: {
    options: {
      type: Array
    },
    dialogTableVisible: {
      type: Boolean
    }
  },
  watch: {
    options: {
      handler: function() {
        // 每次options改变时 就开始整理totalList的数据格式
        let arr = [[]];
        let index = 0;
        this.options.forEach((v, i) => {
          if (i > 0 && i % 4 === 0) {
            index += 1;
            arr[index] = new Array();
          }
          arr[index].push({
            deviceId: v.id,
            meterLevelObj: {},
            meterList: []
          });
        });
        this.totalList = arr;
        console.log(this.totalList);
      },
      immediate: true
    },
    dialogTableVisible: function(n) {
      // 开启options中的所有监控
      if (n) {
        this.totalList.forEach((v, i) => {
          v.forEach((el, index) => {
            this.setMeterData(el.deviceId, i, index);
            this.setMeterLevelObj(el.deviceId, i, index);
          });
        });
        console.log(n);
      } else {
        // 关闭options中的所有监控
        this.totalList.forEach((v, i) => {
          v.forEach((el, index) => {
            this.wsLeftArr[i][index].meterList &&
              this.wsLeftArr[i][index].meterList.close(true);
            this.wsLeftArr[i][index].meterLevelObj &&
              this.wsLeftArr[i][index].meterLevelObj.close(true);
          });
        });
      }
    }
  },
  beforeDestroy(){
    this.totalList.forEach((v, i) => {
      v.forEach((el, index) => {
        this.wsLeftArr[i][index].meterList &&
          this.wsLeftArr[i][index].meterList.close(true);
        this.wsLeftArr[i][index].meterLevelObj &&
          this.wsLeftArr[i][index].meterLevelObj.close(true);
      });
    });
  },
  methods: {
    setMeterData(deviceId, index, secondIndex) {
      if (this.wsLeftArr[index][secondIndex].meterList) {
        this.wsLeftArr[index][secondIndex].meterList.close(true);
      }
      this.wsLeftArr[index][secondIndex].meterList = new WebSocket(
        `ws://${websoketURL}/ws/getMeterData?deviceId=${deviceId}`
      );

      this.wsLeftArr[index][secondIndex].meterList.onopen = function() {
        console.log("打开ws-setMeterData");
      };

      this.wsLeftArr[index][secondIndex].meterList.onmessage = res => {
        this.totalList[index][secondIndex].meterList = JSON.parse(res.data);
        this.totalList[index][secondIndex].meterList.push([]);
      };

      this.wsLeftArr[index][secondIndex].meterList.onclose = function(flag) {
        // 关闭 websocket
        this.totalList[index][secondIndex].meterList = [];
        if (!flag) {
          this.errorBox();
        }
      };
    },
    errorBox() {
      this.$notify({
        title: "提示",
        message: "数据监控出现异常，请刷新网页",
        duration: 0
      });
    },
    setMeterLevelObj(deviceId, index, secondIndex) {
      if (this.wsLeftArr[index][secondIndex].meterLevelObj) {
        this.wsLeftArr[index][secondIndex].meterLevelObj.close(true);
      }
      this.wsLeftArr[index][secondIndex].meterLevelObj = new WebSocket(
        `ws://${websoketURL}/ws/getMeterLevel?deviceId=${deviceId}`
      );

      this.wsLeftArr[index][secondIndex].meterLevelObj.onopen = function() {
        console.log("打开ws-setMeterLevelObj");
      };

      this.wsLeftArr[index][secondIndex].meterLevelObj.onmessage = res => {
        this.totalList[index][secondIndex].meterLevelObj = JSON.parse(res.data);
      };

      this.wsLeftArr[index][secondIndex].meterLevelObj.onclose = function(
        flag
      ) {
        // 关闭 websocket
        this.totalList[index][secondIndex].meterLevelObj = {};
        if (!flag) {
          this.errorBox();
        }
        console.log("关闭ws-setMeterLevelObj");
      };
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="less">
.monitorList {
  .el-dialog__wrapper {
    z-index: 100002 !important;
  }
  .fullWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .gridWrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 0.51rem;
      grid-row-gap: 0.31rem;

      // display: flex;
      // flex-wrap: wrap;
      height: 100%;
      max-height: 100%;
      padding: 0 0.8rem;
      .environmentControl {
        width: 100%;
      }
    }
    .closeBtn {
      position: absolute;
      top: 0;
      right: 0;
      width: 0.8rem;
      height: 0.6rem;
      cursor: pointer;
    }
    .addDialog {
      width: 11.0236rem;
      height: 5.3543rem;
      background: url("/static/imgs/monitorList/gridBk.png") no-repeat;
      background-size: 100% 100%;
      position: relative;
      .title {
        font-size: 0.141rem;
        color: #119bd8;
        padding-top: 0.472rem;
        padding-bottom: 0.165rem;
        padding-left: 1.0629rem;
        margin-bottom: 0;
      }
    }
    .dialogForm {
      box-sizing: border-box;
      padding-left: 0.6rem;
      padding-right: 0.3rem;
      padding-top: 0.3rem;
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