<template>
  <div class="equipmentWarn">
    <div class="top">
      <img src="../../assets/logo.png" alt="">
      <p style="margin-right: auto;">设备告警列表</p>
      <div>
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="item.typeName" v-for="(item,index) in typeList" :key="index"></el-checkbox>
      </el-checkbox-group>
      </div>
    </div>
    <div class="tableGrid">
      <div class="tableItem" v-show="typeList[index].isShow" v-for="(item,index) in totalData" :key="index">
        <div class="botttom">
          <p class="equipmentTitle">{{ typeList[index].typeName }}</p>
          <div class="equipmentGrid">
            <el-table
              :data="totalData[index]"
              height="1rem"
              style="width: 100%">
              <el-table-column
                prop="deviceName"
                label="设备名称"
              >
              </el-table-column>
              <el-table-column
                prop="deviceValue"
                label="状态"
              >
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5">关闭</span>
                  <span style="color: #009dd5">|</span>
                  <span @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5">自动</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOperateDeviceTypes } from '@/api/home'
import { websoketURL } from '@/config/env'
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      totalData: [],
      tableData: [],
      checkList:[],
      typeList:[],
      wsArr: []
    }
  },
  computed:{
    ...mapGetters(['partitionId'])
  },
  watch:{
    'partitionId': function() {
      this.initList()
    },
    'checkList': function(n) {
      this.typeList.map ( v => {
        if(n.includes(v.typeName)){
          v.isShow = true
        }else{
          v.isShow = false
        }
      })
    }
  },
  methods:{
    initList(){
      if(this.partitionId) {
        this.typeList.map((el,index) => {
          let obj = {
            deviceTypeId: el.id
          }
          this.$set(this.totalData, index, [])
          this.WebSocketFun(obj,index)
        })
      }
    },
    WebSocketFun(obj,index){
      let deviceTypeId = obj.deviceTypeId
      if(this.wsArr[index]){
        this.wsArr[index].onclose = function()
        { 
          console.log('关闭 ws');
        };
      }

      this.wsArr[index] = new WebSocket(`ws://${websoketURL}/ws/deviceList?deviceTypeId=${deviceTypeId}&partitionId=${this.partitionId}`)
      this.wsArr[index].onmessage = (res) => {
        if(!this.totalData[index]){
          this.$set(this.totalData, index, [])
        }
        this.$set(this.totalData, index, JSON.parse(res.data))
      }
    }
  },
  async created(){
    let arr = await getOperateDeviceTypes()
    this.typeList = arr.data
    this.typeList.map( (v)=>{
      v.isShow = true
    })
    this.checkList = this.typeList.map( v => v.typeName)
    this.initList()
  }
}
</script>

<style lang="less">
.equipmentWarn{
  height: 100%;
  padding-top: .15rem;
  background: url(/img/surveillance.a11582f6.png) center center no-repeat;
  background-size: 100% 100%;
  padding:0 .15rem;
  padding-bottom: .15rem;
  display: flex;
  flex-direction: column;
  .zero{
    width: 0 !important;
  }
  .equipmentTitle{
    color: #00a0d8;
    font-size: .125rem;
    margin-bottom: 0;
  }
  .equipmentGrid{
    // overflow: auto;
  }
  .el-table thead{
    color: #fff;
  }

  .el-table::before{
    height: 0 !important;
  }
  .el-table{
    background: transparent !important;
    color: #fff !important;
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

  .tableGrid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
    max-width: 100%;
    flex: 1;
    overflow: auto;
    .tableItem{
      background: url(/img/surveillance.a11582f6.png) center center no-repeat;
      background-size: 100% 100%;
      .botttom{
        padding: .15rem;

      }
    }
  }

  .top{
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
}
</style>