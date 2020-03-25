<template>
  <!-- <a-config-provider :locale="locale"> -->
    <div id="app">
      <router-view/>
    </div>
  <!-- </a-config-provider> -->
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

  export default {
    data () {
      return {
        locale: zhCN
      }
    },
    mounted () {
    }
  }
</script>
<style lang="less">
  html, body {
    width: 100%;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar-track {
    border-radius: 2px;
    background-color: rgba(0,0,0,.05)
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: rgba(0,0,0,.1)
  }
  #app {
    height: 100%;
  }

  .mainTitle{
    font-size: 0.18rem !important;
  }
  .el-table thead{
    color: #ddd;
  }
  .el-table .cell{
    line-height: unset;
  }

  .el-table td, .el-table th{
    padding: .039rem 0;
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

  .el-table__row:hover{
    background: rgba(0, 153, 204, .4) !important;
  }
  .el-table__row:active{
    background: rgba(0, 153, 204, .4);
  }
  .el-table tbody tr:hover>td { 
    background: rgba(0, 153, 204, .4) !important;
  }

  table{
    width: auto !important;
    td{
      div{
        white-space: nowrap;
        font-size: .09rem !important;
        span{
          font-size: .09rem !important;
        }
      }
    }
    th{
      div{
        white-space: nowrap;
        font-size: .09rem !important;
        span{
          font-size: .09rem !important;
        }
      }
    }
  }

  .el-input__inner{
    background: transparent !important;
  }
  .el-select-dropdown{
    background: rgba(10, 8, 42, .9) !important;
    border: 1px solid rgba(3, 99, 255, 0.3) !important;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background:rgba(0,255,255, .1) !important;
  }

  .el-popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color: rgba(3, 99, 255, 0.3) !important;
  }

  .el-popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: rgba(10, 8, 42, .9) !important;
  }

  .el-notification{
    z-index: 10000 !important;
  }

</style>

