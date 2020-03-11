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
  #app {
    height: 100%;
  }
</style>
