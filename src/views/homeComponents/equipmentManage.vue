<template>
  <div class="equipmentWarn">
    <div class="top">
      <img src="../../assets/logo.png" alt="">
      <p>设备告警列表</p>
    </div>
    <div class="tableGrid">
      <div class="tableItem" v-for="(item,index) in tableData" :key="index">
        <div class="botttom">
          <p class="equipmentTitle">通风系统</p>
          <div class="equipmentGrid">
            <el-table
              :data="tableData"
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
import { deviceList, getOperateDeviceTypes } from '@/api/home'

export default {
  data(){
    return {
      tableData: []
    }
  },
  created(){

    getOperateDeviceTypes().then(res => {
      console.log(res);
      // 获取设备列表信息
      deviceList({
        partitionId: 2,
        deviceTypeId: 2
      }).then(res => {
        this.tableData = [...res.data, ...res.data]
        console.log(res);
      })
    })
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