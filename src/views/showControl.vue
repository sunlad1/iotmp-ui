<template>
  <div class="showContainer">
  <div class="content">
    <div class="top">
      <div class="left">
        <leftCom></leftCom>
      </div>
      <div class="right" id="right">
        <VideoSurveillance/>
      </div>
    </div>
  </div>
  <div class="spaceOccupy"></div>
  <div class="equipmentManage">
    <equipmentManage></equipmentManage>
  </div>
</div>
</template>

<script>
  import VideoSurveillance from '@/components/videoSurveillance';
  import leftCom from './homeComponents/leftCom';
  import equipmentManage from './homeComponents/equipmentManage';
export default {
    components: {
      VideoSurveillance,
      leftCom,
      equipmentManage
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
  .spaceOccupy{
    flex: 0 0 2%;
  }
  .equipmentManage{
    flex: 0 0 35%;
    overflow: hidden;
  }
  .content {
    width: 100%;
    margin: 0 auto;
    flex: 0 0 63%;
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