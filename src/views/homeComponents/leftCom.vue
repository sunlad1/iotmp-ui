<template>
  <div class="leftContainer">
    <div class="environmentControl" style="padding-left: .13rem;">
      <div class="leftComtop">
        <img src="/static/imgs/home_icon2.png" alt />
        <p class="mainTitle subheading" style="margin-right: auto">环控仪表</p>
        <div style="width: 120px">
          <el-select v-model="groupVal" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.deviceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="botttom" style="padding-bottom:.15rem;">
        <div class="environmentBk">
          <div class="circle">
            <span class="level" v-if="meterLevelObj.level == '优'">{{ meterLevelObj.level }}</span>
            <span class="level" style="color:red" v-else>{{ meterLevelObj.level }}</span>
            <span>{{ meterLevelObj && meterLevelObj.partitionName }}</span>
            <span>当前状态</span>
          </div>
          <div class="manyData">
            <div
              v-for="(item,index) in meterList"
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

              <div class="item" @click="searchMore" style="color: 0e68f6;padding-right:.1rem;cursor:pointer" v-else>查看更多分组信息 >></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="equipmentWarn">
      <div class="leftComtop">
        <img src="/static/imgs/home_icon1.png" alt />
        <p class="mainTitle subheading">设备告警列表</p>
      </div>
      <div class="botttom" style="    flex: 1;overflow:auto;">
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

    <!-- 监控list -->
    <monitorList 
      :dialogTableVisible="dialogTableVisible"
      :options="options"
      @closeDialog="closeDialog"
    ></monitorList>
  </div>
</template>

<script>
import { websoketURL } from "@/config/env";
import { getMeterGroups } from "@/api/home";
import { mapGetters } from "vuex";
import monitorList from '@/components/monitorList'

export default {
  data() {
    return {
      dialogTableVisible: false,
      groupVal: "",
      alarmList: [],
      meterList: {},
      meterLevelObj: {},
      wsLeftArr: [],
      options: []
    };
  },
  components: {
    monitorList
  },
  computed: {
    ...mapGetters(["partitionId"])
  },
  watch: {
    'dialogTableVisible': function(n){
      this.$emit('changeIsCloseMonitor', n)
    },
    partitionId: function(n) {
      if (n != "") {
        this.alarmList = [];
        this.meterList = [];
        this.meterLevelObj = {};
        this.setAlarmList();
        this.initMeterList();
      }
    },
    groupVal: function(n) {
      if (n != "") {
        this.setMeterData(n);
        this.setMeterLevelObj(n);
      }
    }
  },
  methods: {
    handleEdit(){
      this.$router.push({
        path: '/home/warnList'
      })
    },
    searchMore(){
      this.dialogTableVisible = true
    },
    closeDialog(){
      this.dialogTableVisible = false
    },
    async initMeterList() {
      // 需要获取环控仪表的分组列表再请求数据
      try {
        let arr = await getMeterGroups({ partitionId: this.partitionId });

        if (arr.data instanceof Array && arr.data.length > 0) {
          this.groupVal = arr.data[0].id;
          this.options = arr.data;
        } else {
          // 清空数据的同时 还要关闭ws
          [1, 2].forEach(v => {
            this.wsLeftArr[v] && this.wsLeftArr[v].close(1000);
          });
          this.wsLeftArr[0] && this.wsLeftArr[0].close(1000);
          this.options = [];
          this.groupVal = "";
        }
      } catch (error) {
        console.log(error);
      }
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
      };

      this.wsLeftArr[0].onclose = (val)=> {
        // 关闭 websocket
        this.alarmList = [];
        if (val.code != 1000) {
          this.errorBox();
        }
        console.log("关闭ws-setAlarmList");
      };
    },
    beforeDestroy(){
      if (this.wsLeftArr[0]) {
        this.wsLeftArr[0].close(1000);
      }
      if (this.wsLeftArr[1]) {
        this.wsLeftArr[1].close(1000);
      }
      if (this.wsLeftArr[2]) {
        this.wsLeftArr[2].close(1000);
      }
    },
    errorBox() {
      this.$notify({
        title: "提示",
        message: "数据监控出现异常，请刷新网页",
        duration: 0
      });
    },
    setMeterData(deviceId) {
      console.log('deviceId')
      console.log(deviceId)
      console.log(websoketURL)
      if (this.wsLeftArr[1]) {
        this.wsLeftArr[1].close(1000);
      }

      // this.wsLeftArr[1] = new WebSocket(`ws://${websoketURL}/ws/getMeterData?partitionId=${this.partitionId}&groupId=${groupId}`)
      this.wsLeftArr[1] = new WebSocket(
        `ws://${websoketURL}/ws/getMeterData?deviceId=${deviceId}`
      );

      this.wsLeftArr[1].onopen = function() {
        console.log("打开ws-setMeterData");
      };

      this.wsLeftArr[1].onmessage = res => {
        this.meterList = JSON.parse(res.data);
        this.meterList.push([]);
      };

      this.wsLeftArr[1].onclose = (val)=> {
        // 关闭 websocket
        console.log('val');
        console.log(val);
        
        this.meterList = [];
        if (val.code != 1000) {
          this.errorBox();
        }
      };
    },
    setMeterLevelObj(deviceId) {
      if (this.wsLeftArr[2]) {
        this.wsLeftArr[2].close(1000);
      }

      // this.wsLeftArr[2] = new WebSocket(`ws://${websoketURL}/ws/getMeterLevel?partitionId=${this.partitionId}&groupId=${groupId}`)
      this.wsLeftArr[2] = new WebSocket(
        `ws://${websoketURL}/ws/getMeterLevel?deviceId=${deviceId}`
      );

      this.wsLeftArr[2].onopen = function() {
        console.log("打开ws-setMeterLevelObj");
      };

      this.wsLeftArr[2].onmessage = res => {
        this.meterLevelObj = JSON.parse(res.data);
      };

      this.wsLeftArr[2].onclose = (val)=> {
        // 关闭 websocket
        this.meterLevelObj = {};
        if (val.code != 1000) {
          this.errorBox();
        }
        console.log("关闭ws-setMeterLevelObj");
      };
    }
  },
  created() {
    if (this.partitionId != "") {
      this.setAlarmList();
      this.initMeterList();
    }
  }
};
</script>

<style lang="less">
.leftContainer {
  height: 100%;
  padding-right: 0.15rem;

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
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .environmentBk {
    background: url("/static/imgs/environmentBk.png") no-repeat;
    // background-size: 100% 100%;
    background-size: cover;
    width: 100%;
    display: flex;
  }
  .botttom {
    padding: 0 0.15rem;
    display: flex;
    .manyData {
      flex: 1;
      display: grid;
      grid-template-columns: 50% 50%;
      padding: 0.15rem 0;
      .enItem {
        // height: 15px;
        display: flex;
        align-items: center;
      }
      .item {
        display: flex;
        align-items: center;
        white-space: nowrap;
        span {
          color: #009dd5;
          font-weight: bold;
          font-size: 12px;
          white-space: nowrap;
        }
        .bar {
          padding: 0 0.03rem;
        }
        .point {
          margin: 0;
          line-height: 0;
          margin-right: 0.07rem;
          span {
            display: inline-block;
            margin: 0.03rem;
            background: #009dd5;
            width: 0.07rem;
            height: 0.07rem;
            border-radius: 50%;
          }
          border-radius: 50%;
          border: 1px solid #009dd5;
        }
      }
    }
    .circle {
      width: 1.25rem;
      height: 1.4rem;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 0.22rem;
      padding-left: 0.2rem;
      span {
        color: #ddd;
        font-size: 0.12rem;
      }
      .level {
        color: #21a7fc;
        font-size: 0.25rem;
        font-weight: bold;
        padding-top: 0.07rem;
        padding-bottom: 0.05rem;
      }
    }
  }

  .leftComtop {
    display: flex;
    align-items: center;
    padding: 0.07rem 0.15rem;
    padding-top: 0.12rem;
    img {
      width: 0.15rem;
      height: 0.15rem;
      margin-right: 0.11rem;
    }
    p {
      color: #00a0d8;
      font-size: 0.18rem;
      padding: 0;
      margin: 0;
    }
  }
  .environmentControl {
    background: url("/static/imgs/bk_1.png") center center no-repeat;
    background-size: 100% 100%;
    // height: 50%;
  }
  .equipmentWarn {
    margin-top: 10px;
    background: url("/static/imgs/bk_2.png") center center no-repeat;
    // background-size: contain;
    background-size: 100% 100%;
    height: 50%;
    flex: 1;
  }
}
</style>