<template>
<div class="navMenu">
  <div class="control" @click="changeCollapse" :class="{ 'positionLeft' : isCollapse}">
    <span v-if="!isCollapse">&lsaquo;&lsaquo;</span>
    <span v-else>&rsaquo;&rsaquo;</span>
  </div>
  <el-menu
    @open="handleOpen" @close="handleClose" :collapse="isCollapse" :collapse-transition="false"
    :default-active="activeIndex"
    class="el-menu-vertical-demo"
    text-color="#2DA2FD"
    active-text-color="#00FFFF">
      <label v-for="(item,index) in menuList" :key="index">
        <el-submenu :index="String(index)" v-if="item.childPartition && item.childPartition.length > 0">
          <template slot="title">
            <span>{{ item.partitionName }}</span>
          </template>

          <label v-for="(el,i) in item.childPartition" :key="i">

            <el-submenu :index="String(index)+'-'+String(i)" v-if="el.childPartition && el.childPartition.length > 0">
              <template slot="title">{{ el.partitionName }}</template>
              <el-menu-item :index="String(index) +'-'+String(i)+'-'+String(I)" @click="changePartition(v)" v-for="(v,I) in el.childPartition" :key="I">{{ v.partitionName }}</el-menu-item>
            </el-submenu>

            <el-menu-item-group v-else>
              <el-menu-item :index="String(index)+'-'+String(i)" @click="changePartition(el)">{{ el.partitionName }}</el-menu-item>
            </el-menu-item-group>


          </label>


        </el-submenu>

        <el-menu-item :index="String(index)" v-else @click="changePartition(item)">
          <span slot="title">{{ item.partitionName }}</span>
        </el-menu-item>
      </label>
  </el-menu>
</div>
</template>


<script>
import { getPartitionList } from '@/api/home'

  export default {
    data() {
      return {
        isCollapse: true,
        activeIndex: '0',
        menuList: []
      };
    },
    created(){
      getPartitionList().then(res => {
        this.menuList = res.data
        // 初始化 id
        if(this.menuList[0].childPartition.length > 0){
          if(this.menuList[0].childPartition[0].childPartition.length > 0){
            this.activeIndex = '0-0-0'
            this.$store.dispatch('setPartitionId', this.menuList[0].childPartition[0].childPartition[0].id)
          }else{
            this.activeIndex = '0-0'
            this.$store.dispatch('setPartitionId', this.menuList[0].childPartition[0].id)
          }
        }else{
          this.activeIndex = '0'
          this.$store.dispatch('setPartitionId', this.menuList[0].id)
        }
      })
    },
    methods: {
      changePartition(obj){
        if(obj.id){
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

.el-menu-item:hover{
  background:rgba(0,255,255, .1);
}
.el-submenu__title:hover{
  background:rgba(0,255,255, .1);
}
.el-submenu .el-menu-item:active{
  background:rgba(0,255,255, .1);
}
.el-menu--collapse{
  width: 0 !important;
}
.el-menu{   //el-menu-vertical-demo
  border-right: 1px solid rgba(3,99,255,.3);
  background: rgba(10, 8, 42, .9);
}
 .el-menu-vertical-demo{
  height: 100vh;
  background: rgba(10, 8, 42, .9);
  border-right: 1px solid rgba(3,99,255,.3);
  overflow: hidden;
 }
.positionLeft{
  left: 0 !important;
}
.el-menu-item.is-active {
  background:rgba(0,255,255, .1);
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
    right: -25px;
    top: 100px;
    bottom: 0;
    width: 25px;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right:1px solid rgba(3,99,255,.3);
    background: rgba(0,0,0, .5);
    color: #0099cc;
    transition: all .5s ease-in;
    &:hover{
      cursor: pointer;
    }
  }
}
</style>
