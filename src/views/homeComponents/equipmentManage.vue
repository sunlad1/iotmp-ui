<template>
  <div class="equipmentWarn">
    <div class="top">
      <img src="/static/imgs/home_icon3.png" alt="">
      <p class="subheading" style="margin-right: auto;">设备运行状态及管理</p>
      <div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.groupName" v-for="(item,index) in typeList" :key="index"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="tabelWrapper" id="tabelWrapper_eq">
      <div class="tableGrid">
        <div class="tableItem" v-show="typeList[index] && typeList[index].isShow" v-for="(item,index) in totalData" :key="index">
        <!-- <div class="tableItem" v-show="typeList[index].isShow" v-for="(item,index) in totalData" :key="index"> -->
          <div class="botttom">
            <p class="equipmentTitle">{{ typeList[index] && typeList[index].groupName }}</p>
            <div class="equipmentGrid">
              <el-table
                :data="totalData[index]"
                height="100%"
                style="width: 100%">
                <el-table-column
                  prop="deviceName"
                  label="设备名称"
                  width="85"
                >
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="deviceValue"
                  label="状态"
                  width="100"
                >
                </el-table-column>
                <el-table-column width="130" label="操作">
                  <template slot-scope="scope">
                    <div class="operrateGrid">
                      <div v-for="(el,index) in scope.row.deviceOperateList" :key="index">

                        <el-popconfirm
                          :title="`您确定${el.operateName}该设备吗？`"
                          @onConfirm="resetPassword()"
                        >
                          <span slot="reference" @click="handleEdit(el)" style="color: #009dd5;cursor: pointer;">{{ el.operateName }}</span>
                          <!-- <el-button slot="reference">删除</el-button> -->
                        </el-popconfirm>
                        <!-- <span @click="handleEdit(el)" style="color: #009dd5;cursor: pointer;">{{ el.operateName }}</span> -->
                        <span style="color: #009dd5;padding:0 2px" class="bar">|</span>
                      </div>
                    </div>
                    <!-- <span @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5">自动</span> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialogBox 
      :dialogTableVisible="dialogTableVisible" 
      @closeDialog="closeDialog" 
      @clearDialogSubmit="clearDialogSubmit" 
      @onSubmit="onSubmit"
    >
    
      <template v-slot:header>
        <img src="/static/imgs/operationManage/operationIcon.png" alt />
        <p style="margin-right:auto">设备{{ operateId.operateName }}信息确认</p>
      </template>
      <template v-slot:middle>
        <p class="middleEquipment">您确定{{ operateId.operateName }}该设备吗？</p>
      </template> 
    </dialogBox>
  </div>
</template>

<script>
import { getOperateDeviceTypes, setOperate } from '@/api/home'
import { websoketURL } from '@/config/env'
import { mapGetters } from 'vuex'
import dialogBox from '@/components/dialogBox'

export default {
  components:{
    dialogBox
  },
  data(){
    return {
      dialogTableVisible: false,
      clearIndex: 0,
      totalData: [],
      tableData: [],
      checkList:[],
      typeList:[],
      wsArr: [],
      operateId: ''
    }
  },
  computed:{
    ...mapGetters(['partitionId'])
  },
  watch:{
    'partitionId': function(n) {
      if(n != ''){
        this.initTypeList()
      }
    },
    'checkList': function(n) {
      this.typeList.map ( v => {
        if(n.includes(v.groupName)){
          v.isShow = true
        }else{
          v.isShow = false
        }
      })
    }
  },
  beforeDestroy(){
    this.closeAllWs()
  },
  methods:{
    closeDialog(){
      this.dialogTableVisible = false
    },
    clearDialogSubmit(){
      this.dialogTableVisible = false
    },
    onSubmit(){
      this.dialogTableVisible = false
      setOperate({
        operateId: this.operateId.id
      }).then(res => {
        if(res.status != 200){
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        }else{
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '操作失败'
        });
      })
    },
    resetPassword(){
      setOperate({
        operateId: this.operateId.id
      }).then(res => {
        if(res.status != 200){
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        }else{
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '操作失败'
        });
      })
    },
    handleEdit(el){
      this.operateId = el
      // this.dialogTableVisible = true
    },
    initList(){
      this.typeList.map((el,index) => {
        let obj = {
          groupId: el.id
        }
        this.$set(this.totalData, index, [])

        this.$nextTick(() => {
          let height = document.getElementById('tabelWrapper_eq').offsetHeight
          let arr = document.getElementsByClassName('tableItem')
          arr.forEach((v,i) => {
            arr[i].style.height = height + 'px'
          })
        })

        this.WebSocketFun(obj,index)
      })
    },
    closeAllWs(){
      (this.wsArr || []).forEach( (v,index) => {
        this.wsArr && this.wsArr[index].close(1000)
        this.clearIndex = index
      })
    },
    WebSocketFun(obj,index){
      let groupId = obj.groupId
      // 每次监控钱需要先关闭旧的监控
      if(this.wsArr[index]){
        this.wsArr[index].close(1000)
        this.clearIndex = index
      }

      // new ws对象，进行监控 
      this.wsArr[index] = new WebSocket(`ws://${websoketURL}/ws/deviceList?groupId=${groupId}&partitionId=${this.partitionId}`)

      this.wsArr[index].onopen = function()
      {
        console.log('打开ws-WebSocketFun');
      };
      
      this.wsArr[index].onmessage = (res) => {
        if(!this.totalData[index]){
          this.$set(this.totalData, index, [])
        }
        this.$set(this.totalData, index, JSON.parse(res.data))
      }

      this.wsArr[index].onclose = (val) =>
      {
        if(this.totalData && this.totalData[this.clearIndex]) this.totalData[this.clearIndex] = []
        if (val.code != 1000) {
          this.$notify({
            title: '提示',
            message: '数据监控出现异常，请刷新网页',
            duration: 0
          });
        }
        // 关闭 websocket
        console.log('关闭ws-WebSocketFun');
      };      

    },
    async initTypeList(){
      let arr = await getOperateDeviceTypes({partitionId: this.partitionId})
      if(arr.data instanceof Array && arr.data.length > 0){
        this.typeList = arr.data
        console.log(JSON.parse(JSON.stringify(this.typeList)))
        this.typeList.map( (v)=>{
          if(v){
            v.isShow = true
          }
        })
        this.checkList = this.typeList.map( v => v.groupName)
        this.initList()
      }else{
        // 如果拿到的是空数据 就直接清空所有监控
        this.closeAllWs()
        // 同时 清空数据
        this.totalData = []
        this.typeList = []
      }
    }
  },
  mounted(){
    if(this.partitionId != ''){
      this.initTypeList()
    }
  },
  // created(){
  //   if(this.partitionId != ''){
  //     this.initTypeList()
  //   }
  // }
}
</script>

<style lang="less">
.middleEquipment{
  font-size:.125rem;
  font-weight:normal;
  color:rgba(221,221,221,1);
  height: 1rem;
}
.equipmentWarn{
  height: 100%;
  padding-top: .15rem;
  background: url('/static/imgs/bk_3.png') center center no-repeat;
  background-size: 100% 100%;
  padding:0 .15rem;
  padding-bottom: .15rem;
  display: flex;
  flex-direction: column;
  .operrateGrid{
    display: flex;
    flex-wrap: wrap;
    // & div:nth-last-child(1) span:nth-last-child(1){
    & div:nth-last-child(1) .bar{
      color: transparent !important;
    }
  }
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
    flex: 1;
  }
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
    padding-left: 0;
    padding-right: 0;
  }

  .el-table  .cell:nth-last-child(1){
    max-width: 200px;
  }
  .tabelWrapper{
    flex: 1;
    overflow: auto;
  }
  .tableGrid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
    max-width: 100%;
    .tableItem{
      background: url(/img/surveillance.a11582f6.png) center center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
      .botttom{
        padding: .1rem;
        display: flex;
        height: 100%;
        flex-direction: column;
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