<!--
 * @Author: slw
 * @Date: 2020-03-25 13:49:50
 * @LastEditTime: 2020-03-25 21:47:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /iotmp-ui/src/views/dataMonitor/index.vue
 -->
<template>
  <div class="dataMonitor">
    <!-- 以及筛选 -->
    <div class="oneLevelFilter">
      <el-menu
        :default-active="activeIndex1"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#0A082A"
        text-color="#2DA2FD"
        active-text-color="#00FFD8">
        <el-menu-item :index="String(index)" v-for="(item,index) in [1,2,3,4,5,6,7]" :key="index">处理中心</el-menu-item>
      </el-menu>
    </div>
    <!-- 二级筛选  -->
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#0A082A"
      text-color="#2DA2FD"
      active-text-color="#00FFD8">
      <el-menu-item :index="String(index)" v-for="(item,index) in [1,2,3,4,5,6,7]" :key="index">处理中心</el-menu-item>
    </el-menu>
    <div id="chartsGrid"
         style="width: 500px;height: 500px;"></div>
  </div>
</template>

<script>
var echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/markPoint");
require("echarts/lib/component/markLine");
export default {
  data() {
    return {
      activeIndex1: '0',
      activeIndex2: '0'
    };
  },
  created() {
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    initEcharts() {
      let myChart = echarts.init(document.getElementById('chartsGrid'));
      let option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };

      myChart.setOption(option);
    }
  }
};
</script>

<style lang="less">
// 包含X轴的NavMenu的修改样式
.dataMonitor {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  padding-left: 25px;
  .el-menu.el-menu--horizontal{
    border-bottom: 1px solid rgba(3, 99, 255, 0.3) !important;
  }
  .el-menu--horizontal>.el-menu-item.is-active{
    border-bottom-color: transparent !important;
  }
  .oneLevelFilter{
    .el-menu--horizontal>.el-menu-item.is-active{
      background-color: rgba(0,255,255,.1) !important;
    }
  }
}
</style>