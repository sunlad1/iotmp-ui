<template>
  <div class="leftContainer">
    <div class="environmentControl">
      <div class="leftComtop">
        <img src="../../assets/logo.png" alt="">
        <p>环控仪表</p>
      </div>
      <div class="botttom">
        <div class="circle">
          <span class="level">优</span>
          <span>防火分区1</span>
          <span>当前状态</span>
        </div>
        <div class="manyData">
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item">
            <div class="point"><span></span></div>
            <span>温度</span>
            <span class="bar">|</span>
            <span>26℃</span>
          </div>
          <div class="item" style="color: 0e68f6;">
            查看更多分组信息 >>
          </div>
        </div>
      </div>
    </div>
    <div class="equipmentWarn">
      <div class="leftComtop">
        <img src="../../assets/logo.png" alt="">
        <p>设备告警列表</p>
      </div>
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
              <span @click="handleEdit(scope.$index, scope.row)" style="color: #009dd5">更多</span>
            </template>
          </el-table-column>
        </el-table>
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
.leftContainer{
  height: 100%;
  padding-right: .15rem;

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
    background: url(/img/surveillance.a11582f6.png) center center no-repeat;
    background-size: 100% 100%;
    height: 50%;
  }
  .equipmentWarn{
    margin-top: 20px;
    background: url(/img/surveillance.a11582f6.png) center center no-repeat;
    // background-size: contain;
    background-size: 100% 100%;
    height: 50%;
  }
}
</style>