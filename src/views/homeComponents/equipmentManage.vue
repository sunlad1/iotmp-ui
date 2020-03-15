<template>
  <div class="equipmentWarn">
    <div class="top">
      <img src="../../assets/logo.png" alt="">
      <p>设备告警列表</p>
    </div>
    <div class="tableGrid">
      <div class="tableItem" v-for="(item,index) in [1,2,3,4,5]" :key="index">
        <div class="botttom">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
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
</template>

<script>
export default {
  data(){
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市'
      }]
    }
  }
}
</script>

<style lang="less">

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
    .tableItem{
      background: url(/img/surveillance.a11582f6.png) center center no-repeat;
      background-size: 100% 100%;
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

  .equipmentWarn{
    height: 100%;
    padding-top: .15rem;
    background: url(/img/surveillance.a11582f6.png) center center no-repeat;
    background-size: 100% 100%;
    padding:0 .15rem;
    padding-bottom: .15rem;
    display: flex;
    flex-direction: column;
  }
</style>