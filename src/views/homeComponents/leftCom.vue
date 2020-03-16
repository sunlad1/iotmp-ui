<template>
  <div class="leftContainer">
    <div class="environmentControl">
      <div class="leftComtop">
        <img src="/static/imgs/home_icon2.png" alt="">
        <p class="mainTitle">环控仪表</p>
      </div>
      <div class="botttom">
        <div class="circle">
          <span class="level">{{ meterLevelObj.level }}</span>
          <span>{{ meterLevelObj.partitionName }}</span>
          <span>当前状态</span>
        </div>
        <div class="manyData">
          <div v-for="(item,index) in meterList" :key="index">
            <div class="item" v-if="item.id">
              <div class="point"><span></span></div>
              <span>{{ item.valueName }}</span>
              <span class="bar">|</span>
              <span>{{ item.deviceValue }}{{ item.valueUnitName }}</span>
            </div>

            <div class="item" style="color: 0e68f6;padding-left:.2rem" v-else>
              查看更多分组信息 >>
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
      <div class="botttom">
        <el-table
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
            prop="alarmSource"
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
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      alarmList: [],
      meterList: {},
      meterLevelObj:{},
      wsArr: []
    }
  },
  computed:{
    ...mapGetters(['partitionId'])
  },
  watch:{
    'partitionId': function() {
      this.alarmList = []
      this.meterList = []
      this.meterLevelObj = {}
      this.setAlarmList()
      this.setMeterData()
      this.setMeterLevelObj()
    }
  },
  methods:{
    setAlarmList(){

      if(this.wsArr[0]){
        this.wsArr[0].onclose = function()
        { 
          console.log('关闭 ws');
        };
      }

      this.wsArr[0] = new WebSocket(`ws://${websoketURL}/ws/getUnRemovedAlarmList?partitionId=${this.partitionId}`)
      this.wsArr[0].onmessage = (res) => {
        this.alarmList = JSON.parse(res.data)
      }
    },
    setMeterData(){

      if(this.wsArr[1]){
        this.wsArr[1].onclose = function()
        { 
          console.log('关闭 ws');
        };
      }

      this.wsArr[1] = new WebSocket(`ws://${websoketURL}/ws/getMeterData?partitionId=${this.partitionId}`)
      this.wsArr[1].onmessage = (res) => {
        this.meterList = JSON.parse(res.data)
        this.meterList.push([])
      }
    },
    setMeterLevelObj(){

      if(this.wsArr[2]){
        this.wsArr[2].onclose = function()
        { 
          console.log('关闭 ws');
        };
      }

      this.wsArr[2] = new WebSocket(`ws://${websoketURL}/ws/getMeterLevel?partitionId=${this.partitionId}`)
      this.wsArr[2].onmessage = (res) => {
        this.meterLevelObj = JSON.parse(res.data)
      }
    }
  },
  created(){
    if(this.partitionId){
      this.setAlarmList()
      this.setMeterData()
      this.setMeterLevelObj()
    }
  }
}
</script>

<style lang="less">
.leftContainer{
  height: 100%;
  padding-right: .15rem;


  .botttom{
    padding: 0 .15rem;
    display: flex;
    .manyData{
      flex: 1;
      display: grid;
      grid-template-columns: 50% 50%;

      .item{
        display: flex;
        align-items: center;
        span{
          color: #009dd5;
          font-weight: bold;
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
      width: 1.18rem;
      height: 1.18rem;
      border-radius: 50%;
      border: 1px solid red;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: .22rem;
      span{
        color: #fff;
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
    margin-top: 20px;
    background: url('/static/imgs/bk_2.png') center center no-repeat;
    // background-size: contain;
    background-size: 100% 100%;
    height: 50%;
    flex: 1;
  }
}
</style>