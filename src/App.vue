<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
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
<style>
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
</style>
