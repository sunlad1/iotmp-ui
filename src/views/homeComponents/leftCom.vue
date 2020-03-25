<template>
  <div class="leftContainer">
    <div class="environmentControl" style="padding-left: .13rem;">
      <div class="leftComtop">
        <img src="/static/imgs/home_icon2.png" alt="">
        <p class="mainTitle" style="margin-right: auto">环控仪表</p>
        <div style="width: 120px">
          <el-select v-model="groupVal" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.deviceName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>

      </div>
      <div class="botttom" style="padding-bottom:.15rem;">
        <div class="environmentBk">
          <div class="circle">
            <span class="level" v-if="meterLevelObj.level == '优'">{{ meterLevelObj.level }}</span>
            <span class="level" style="color:red" v-else>{{ meterLevelObj.level }}</span>
            <span>{{ meterLevelObj.partitionName }}</span>
            <span>当前状态</span>
          </div>
          <div class="manyData">
            <div v-for="(item,index) in meterList" :key="index" class="enItem" :style="{'justify-content': item.id ? 'flex-start' : 'flex-end'}">
              <div class="item" v-if="item.id">
                <div class="point"><span></span></div>
                <span>{{ item.valueName }}</span>
                <span class="bar">|</span>
                <span>{{ item.deviceValue }}{{ item.valueUnitName }}</span>
              </div>

              <div class="item" style="color: 0e68f6;padding-right:.1rem;" v-else>
                查看更多分组信息 >>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="equipmentWarn">
      <div class="leftComtop">
        <img src="/static/imgs/home_icon1.png" alt="">
        <p class="mainTitle">设备告警列表</p>
      </div>
      <div class="botttom" style="    flex: 1;overflow:auto;">
        <el-table
          height="100%"
          :data="alarmList"
          style="width: 100%">
          <el-table-column
            prop="alarmName"
            label="报警名称"
          >
          </el-table-column>
          <el-table-column
            prop="alarmSource"
            label="报警源"
          >
          </el-table-column>
          <el-table-column
            prop="alarmType"
            label="报警类型"
          >
          </el-table-column>
          <el-table-column
            prop="alarmAttr"
            label="源属性"
          >
          </el-table-column>
          <el-table-column
            prop="alarmDescribe"
            label="报警描述"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5">更多</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { websoketURL } from '@/config/env'
import { getMeterGroups } from '@/api/home'
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      groupVal: '',
      alarmList: [],
      meterList: {},
      meterLevelObj:{},
      wsLeftArr: [],
      options: [],
    }
  },
  computed:{
    ...mapGetters(['partitionId'])
  },
  watch:{
    'partitionId': function(n) {
      if(n != ''){
        this.alarmList = []
        this.meterList = []
        this.meterLevelObj = {}
        this.setAlarmList()
        this.initMeterList()
      }
    },
    'groupVal': function(n){
      if(n != ''){
        this.setMeterData(n)
        this.setMeterLevelObj(n)   
      }
    }
  },
  methods:{
    async initMeterList(){
      // 需要获取环控仪表的分组列表再请求数据
      try {
        let arr = await getMeterGroups({partitionId: this.partitionId})
        
        if(arr.data instanceof Array && arr.data.length >0){
          this.groupVal = arr.data[0].id
          this.options = arr.data  
        }else{
          // 清空数据的同时 还要关闭ws
          [1,2].forEach((v) => {
            this.wsLeftArr[v] && this.wsLeftArr[v].onclose(true)
          });
          this.wsLeftArr[0] && this.wsLeftArr[0].onclose(true)
          this.options = []
          this.groupVal = ''
        }
      } catch (error) {
        console.log(error)
      }
    },
    setAlarmList(){

      if(this.wsLeftArr[0]){
        this.wsLeftArr[0].onclose(true)
      }

      this.wsLeftArr[0] = new WebSocket(`ws://${websoketURL}/ws/getUnRemovedAlarmList?partitionId=${this.partitionId}`)
      this.wsLeftArr[0].onopen = function()
      {
        console.log('打开ws-setAlarmList');
      };
            
      this.wsLeftArr[0].onmessage = (res) => {
        this.alarmList = JSON.parse(res.data)
      }

      this.wsLeftArr[0].onclose = function(flag)
      { 
        // 关闭 websocket
        this.alarmList = []
        if(!flag){
          this.errorBox()
        }
        console.log('关闭ws-setAlarmList');
      };

    },
    errorBox(){
      this.$notify({
        title: '提示',
        message: '数据监控出现异常，请刷新网页',
        duration: 0
      });
    },
    setMeterData(deviceId){

      if(this.wsLeftArr[1]){
        this.wsLeftArr[1].onclose(true)
      }
      
      // this.wsLeftArr[1] = new WebSocket(`ws://${websoketURL}/ws/getMeterData?partitionId=${this.partitionId}&groupId=${groupId}`)
      this.wsLeftArr[1] = new WebSocket(`ws://${websoketURL}/ws/getMeterData?deviceId=${deviceId}`)

      this.wsLeftArr[1].onopen = function()
      {
        console.log('打开ws-setMeterData');
      };
            
      this.wsLeftArr[1].onmessage = (res) => {
        this.meterList = JSON.parse(res.data)
        this.meterList.push([])
      }

      this.wsLeftArr[1].onclose = function(flag)
      { 
        // 关闭 websocket
        this.meterList = []
        if(!flag){
          this.errorBox()
        }
      };

    },
    setMeterLevelObj(deviceId){

      if(this.wsLeftArr[2]){
        this.wsLeftArr[2].onclose(true)
      }

      // this.wsLeftArr[2] = new WebSocket(`ws://${websoketURL}/ws/getMeterLevel?partitionId=${this.partitionId}&groupId=${groupId}`)
      this.wsLeftArr[2] = new WebSocket(`ws://${websoketURL}/ws/getMeterLevel?deviceId=${deviceId}`)

      this.wsLeftArr[2].onopen = function()
      {
        console.log('打开ws-setMeterLevelObj');
      };

      this.wsLeftArr[2].onmessage = (res) => {
        this.meterLevelObj = JSON.parse(res.data)
      }
      
      this.wsLeftArr[2].onclose = function(flag)
      { 
        // 关闭 websocket
        this.meterLevelObj = {}
        if(!flag){
          this.errorBox()
        }
        console.log('关闭ws-setMeterLevelObj');
      };
    }
  },
  created(){
    if(this.partitionId != ''){
      this.setAlarmList()
      this.initMeterList()
    }
  }
}
</script>

<style lang="less">
.leftContainer{
  height: 100%;
  padding-right: .15rem;



  .el-table thead{
    color: #ddd;
  }

  .el-table::before{
    height: 0 !important;
  }
  .el-table{
    background: transparent !important;
    color: #ddd !important;
  }
  .el-table td,.is-leaf{
    border-bottom: 1px solid #3625ab;
  }

   .el-table th{
     border:none !important;
   }

  .el-table th, .el-table tr{
    background: transparent !important;
  }

  .el-table .cell{
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }




  .environmentBk{
    background: url('/static/imgs/environmentBk.png') no-repeat;
    // background-size: 100% 100%;
    background-size: cover;
    width: 100%;
    display: flex;
  }
  .botttom{
    padding:0 .15rem;
    display: flex;
    .manyData{
      flex: 1;
      display: grid;
      grid-template-columns: 50% 50%;
      padding: .15rem 0;
      .enItem{
        // height: 15px;
        display: flex;
        align-items: center;
      }
      .item{
        display: flex;
        align-items: center;
        white-space: nowrap;
        span{
          color: #009dd5;
          font-weight: bold;
          font-size: 12px;
          white-space: nowrap;
        }
        .bar{
          padding: 0 .03rem;
        }
        .point{
          margin: 0;
          line-height: 0;
          margin-right: .07rem;
          span{
            display: inline-block;
            margin: .03rem;
            background: #009dd5;
            width: .07rem;
            height:.07rem;
            border-radius: 50%;
          }
          border-radius: 50%;
          border:1px solid #009dd5;
        }
      }

    }
    .circle{
      width: 1.25rem;
      height: 1.4rem;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: .22rem;
      padding-left: .2rem;
      span{
        color: #ddd;
        font-size: .12rem;
      }
      .level{
        color: #21a7fc;
        font-size: .25rem;
        font-weight: bold;
        padding-top: .07rem;
        padding-bottom: .05rem;
      }
    }
  }

  .leftComtop{
    display: flex;
    align-items: center;
    padding: .07rem .15rem;
    padding-top: 0.12rem;
    img{
      width: .15rem;
      height: .15rem;
      margin-right: .11rem;
    }
    p{
      color: #00a0d8;
      font-size: .18rem;
      padding: 0;
      margin: 0;
    }
  }
  .environmentControl{
    background: url('/static/imgs/bk_1.png') center center no-repeat;
    background-size: 100% 100%;
    // height: 50%;
  }
  .equipmentWarn{
    margin-top: 10px;
    background: url('/static/imgs/bk_2.png') center center no-repeat;
    // background-size: contain;
    background-size: 100% 100%;
    height: 50%;
    flex: 1;
  }
}
</style>