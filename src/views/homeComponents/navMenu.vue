<template>
<div class="navMenu">
  <div class="control" @click="changeCollapse" :class="{ 'positionLeft' : isCollapse}">
    《
  </div>
  <el-menu
    @open="handleOpen" @close="handleClose" :collapse="isCollapse" :collapse-transition="false"
    default-active="0"
    class="el-menu-vertical-demo"
    text-color="#0099cc"
    active-text-color="#00ffde">

    <el-submenu :index="index" v-for="(item,index) in menuList" :key="index">
      <template slot="title">
        <span @click="changePartition(item)">{{ item.partitionName }}</span>
      </template>
      <div v-if="item.childPartition && item.childPartition.length > 0">
        <el-submenu :index="'1-'+ index ">
          <template slot="title">{{ item.partitionName }}</template>
          <el-menu-item @click="changePartition(el)" :index="'1-'+ index + i" v-for="(el,i) in item.childPartition" :key="i">{{ el.partitionName }}</el-menu-item>
        </el-submenu>
      </div>
    </el-submenu>


  </el-menu>

</div>
</template>


<script>
import { getPartitionList } from '@/api/home'

  export default {
    data() {
      return {
        isCollapse: true,
        menuList: []
      };
    },
    created(){
      getPartitionList().then(res => {
        this.menuList = res.data
        // 初始化 id
        if(this.menuList[0].childPartition.length > 0){
          if(this.menuList[0].childPartition[0].length > 0){
            console.log();
          }else{
            this.$store.dispatch('setPartitionId', this.menuList[0].childPartition[0].id)
          }
        }else{
          this.$store.dispatch('setPartitionId', this.menuList[0].id)
        }
      })
    },
    methods: {
      changePartition(obj){
        if(obj.id){
          console.log('obj.id');
          console.log(obj.id);
          this.$store.dispatch('setPartitionId', obj.id)
        }
      },
      changeCollapse(){
        this.isCollapse = !this.isCollapse
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style lang="less">
.el-submenu .el-menu-item:hover{
  background: rgba(0, 153, 204, .4);
}
.el-submenu__title:hover{
  background: rgba(0, 153, 204, .4);
}
.el-submenu .el-menu-item:active{
  background: rgba(0, 153, 204, .4);
}
.el-menu--collapse{
  width: 0 !important;
}
.el-menu{   //el-menu-vertical-demo
  border-right: 1px solid #6666cc;
  background: rgba(0,0,0, .5)
}
 .el-menu-vertical-demo{
  height: 100vh;
  background: rgba(0,0,0, .5);
  border-right: 1px solid #6666cc;

 }
.positionLeft{
  left: 0 !important;
}
.navMenu{
  width: 200px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 9999;
  padding-top: 100px;
  .control{
    position: absolute;
    right: -15px;
    top: 100px;
    bottom: 0;
    width: 15px;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right:1px solid #6666cc;
    background: rgba(0,0,0, .5);
    color: #0099cc;
    transition: all .5s ease-in;
  }
}
</style>
