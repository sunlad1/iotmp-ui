<template>
  <div class="showContainer">
  <!-- 导航栏 -->
  <div class="guideGrid">
    <span>当前位置：</span>
    <p v-if="levelArr.length == 1">
      <span class="hignLightWord">{{ partitionedList[levelArr[0]].partitionName }}</span>
    </p>
    <p v-if="levelArr.length == 2">
      <span class="normalWord">{{ partitionedList[levelArr[0]].partitionName }} > </span>
      <span class="hignLightWord">{{ partitionedList[levelArr[0]].childPartition[levelArr[1]].partitionName }}</span>
    </p>
    <p v-if="levelArr.length == 3">
      <span class="normalWord">{{ partitionedList[levelArr[0]].partitionName }} > </span>
      <span class="normalWord">{{ partitionedList[levelArr[0]].childPartition[levelArr[1]].partitionName }} > </span>
      <span class="hignLightWord">{{ partitionedList[levelArr[0]].childPartition[levelArr[1]].childPartition[levelArr[2]].partitionName }}</span>
    </p>
  </div>
  <div class="flexBottom">
    <div class="content">
      <div class="top">
        <div class="left">
          <leftCom :isCloseMonitor="isCloseMonitor" @changeIsCloseMonitor="changeIsCloseMonitor"></leftCom>
        </div>
        <div class="right" id="right">
          <VideoSurveillance :isCloseMonitor="isCloseMonitor"/>
        </div>
      </div>
    </div>
    <div class="spaceOccupy"></div>
    <div class="equipmentManage">
      <equipmentManage></equipmentManage>
    </div>
  </div>
</div>
</template>

<script>
  import VideoSurveillance from '@/components/videoSurveillance';
  import leftCom from './homeComponents/leftCom';
  import equipmentManage from './homeComponents/equipmentManage';
  import { mapGetters } from 'vuex';

export default {
  data(){
    return {
      levelArr: [],
      isCloseMonitor: false
    }
  },
  computed: {
    ...mapGetters(['currentPartitionLevel', 'partitionedList'])
  },
  components: {
    VideoSurveillance,
    leftCom,
    equipmentManage
  },
  watch:{
    'currentPartitionLevel':{
      handler: function(n){
        let arr = n.split('-')
        arr = arr.map( v => Number(v))
        this.levelArr = arr
      },
      immediate: true
    }
  },
  methods:{
    changeIsCloseMonitor(flag){
      this.isCloseMonitor = flag
    }
  }
}
</script>

<style lang="less" scoped>
.showContainer{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  .flexBottom{
    flex: 1;
    height: 100%;
    max-height: 100%;
    padding: .23rem;
    padding-top: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .guideGrid{
    display: flex;
    align-items: center;
    color: #787DB8;
    width: 100%;
    padding-left: 80px;
    padding-top: .2rem;
    padding-bottom: .1rem;
    p{
      margin: 0;
    }
    .normalWord{
      color: #787DB8;
      font-size: 12px;
    }
    .hignLightWord{
      font-size: 12px;
      color: #00C3FF;
    }
  }

  .spaceOccupy{
    flex: 0.2;
  }
  .equipmentManage{
    flex: 3.5;
    overflow: hidden;
  }
  .content {
    width: 100%;
    margin: 0 auto;
    flex: 6.3;
    overflow: hidden;
    .top {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      .left {
        flex: 0 0 32.38%;
      }
      .right {
        height: auto;
        flex: 0 0 65%;
      }
    }
  }

}
</style>