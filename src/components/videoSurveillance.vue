<template>
  <div class="video-surveillance" id="video-surveillance">
    <div class="header">
      <div class="title">
        <div class="ico"></div>
        <span style="display:inline-block;margin-right:auto">防火分区</span>
        <el-radio-group v-model="monitorType">
          <el-radio :label="0">预览</el-radio>
          <el-radio :label="1">回放</el-radio>
        </el-radio-group>
      </div>
      <!-- <div class="select">
        <a-select
            :defaultValue="current"
            style="width: 100%"
            @change="handleChange"
            placeholder="Please select"
        >
          <a-select-option v-for="i in 25" :key="i"
          >{{i}}
          </a-select-option
          >
        </a-select>
      </div> -->
    </div>
    <!-- <div class="content" id="playWnd" ></div> -->
    <!-- <div class="content contentContainer"></div> -->
    <div class="around">
      <div class="contentContainer"></div>
    </div>
  </div>
</template>
<script src="jsWebControl-1.0.0.min.js"></script>
<script src="jsencrypt.min.js"></script>  
<script>
import { websoketURL } from "@/config/env";
var oWebControl = null; // 插件对象
var initCount = 0;
var pubKey = "";
var widthGrid = 0;
var heightGrid = 0;
var playModeValue = '0';
function remToPx(rem) {
  if (!rem) {
    return 0;
  }
  rem = parseFloat(rem);
  var clientH = document.documentElement.clientHeight;
  console.error(document.documentElement.clientHeight, 11111);
  return (rem * 100 * clientH) / 720;
}
// 初始化插件
function initPlugin() {
  oWebControl = new window.WebControl({
    szPluginContainer: "playWnd",
    iServicePortStart: 15900,
    iServicePortEnd: 15909,
    szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11", // 用于IE10使用ActiveX的clsid
    cbConnectSuccess: function() {
      setCallbacks();
      oWebControl
        .JS_StartService("window", {
          dllPath: "./VideoPluginConnect.dll"
        })
        .then(
          function() {
            oWebControl
              .JS_CreateWnd("playWnd", widthGrid, heightGrid)
              .then(function() {
                init();
              });
          },
          function() {}
        );
    },
    cbConnectError: function() {
      oWebControl = null;
      window.WebControl.JS_WakeUp("VideoWebPlugin://");
      initCount++;
      if (initCount < 3) {
        setTimeout(function() {
          initPlugin();
        }, 3000);
      }
    },
    cbConnectClose: function() {
      // 异常断开：bNormalClose = false
      // JS_Disconnect正常断开：bNormalClose = true
      console.log("cbConnectClose");
      oWebControl = null;
    }
  });
}
//初始化
function init() {
  getPubKey(function() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", `http://${websoketURL}/videoMonitor/getVideoMonitorInfo`);
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.status == 200 && xhr.readyState == 4) {
        var data = JSON.parse(xhr.responseText);
        ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
        var appkey = data.appKey; //综合安防管理平台提供的appkey，必填
        var secret = setEncrypt(data.appSecret); //综合安防管理平台提供的secret，必填
        var ip = data.ip; //综合安防管理平台IP地址，必填
        var playMode = Number(playModeValue); //初始播放模式：0-预览，1-回放
        var port = 443; //综合安防管理平台端口，若启用HTTPS协议，默认443
        var snapDir = "D:\\SnapDir"; //抓图存储路径
        var videoDir = "D:\\VideoDir"; //紧急录像或录像剪辑存储路径
        var layout = "1x1"; //playMode指定模式的布局
        var enableHTTPS = 1; //是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
        var encryptedFields = "secret"; //加密字段，默认加密领域为secret
        var showToolbar = 1; //是否显示工具栏，0-不显示，非0-显示
        var showSmart = 1; //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769"; //自定义工具条按钮
        ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////
        oWebControl
      .JS_RequestInterface({
        funcName: "init",
        argument: JSON.stringify({
          appkey: appkey, //API网关提供的appkey
          secret: secret, //API网关提供的secret
          ip: ip, //API网关IP地址
          playMode: playMode, //播放模式（决定显示预览还是回放界面）
          port: port, //端口
          snapDir: snapDir, //抓图存储路径
          videoDir: videoDir, //紧急录像或录像剪辑存储路径
          layout: layout, //布局
          enableHTTPS: enableHTTPS, //是否启用HTTPS协议
          encryptedFields: encryptedFields, //加密字段
          showToolbar: showToolbar, //是否显示工具栏
          showSmart: showSmart, //是否显示智能信息
          buttonIDs: buttonIDs //自定义工具条按钮
        })
      })
      .then(function() {
        // oWebControl.JS_Resize(1108, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
      });
      }
    };
  });
}
//获取公钥
function getPubKey(callback) {
  oWebControl
    .JS_RequestInterface({
      funcName: "getRSAPubKey",
      argument: JSON.stringify({
        keyLength: 1024
      })
    })
    .then(function(oData) {
      if (oData.responseMsg.data) {
        pubKey = oData.responseMsg.data;
        callback();
      }
    });
}

//RSA加密
function setEncrypt(value) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubKey);
  return encrypt.encrypt(value);
}
// initPlugin();                                                                   //dsadasdsadasd
// 设置窗口控制回调
function setCallbacks() {
  oWebControl.JS_SetWindowControlCallback({
    cbIntegrationCallBack: cbIntegrationCallBack
  });
}

// 推送消息
function cbIntegrationCallBack(oData) {
  console.log(oData);
}
export default {
  name: "HelloWorld",
  props: {
    isCloseMonitor:{
      type: Boolean
    }
  },
  data() {
    return {
      monitorType: 0,
      selectData: [{}],
      current: [0]
    };
  },
  watch:{
    'isCloseMonitor': function(n){
      if(n){
        // close
        this.closeWindow()
        // oWebControl.JS_RequestInterface({
        //     funcName: "stopAllPreview"
        // });
      }else{
        initPlugin()
      }
    },
    'monitorType': function(n){
      if(n == 0){
        playModeValue = 0
        initPlugin()
      }else{
        playModeValue = 1
        initPlugin()
      }
    }
  },
  beforeDestroy(){
    this.closeWindow()
    // oWebControl.JS_RequestInterface({
    //     funcName: "stopAllPreview"
    // });
  },
  mounted() {
    let timer = null   //video-surveillance
    // let playWnd = document.getElementById('playWnd')
    let surveillance = document.getElementById('video-surveillance')
    let right = document.getElementById('right')
    let con = document.getElementsByClassName('contentContainer')[0]
    this.$nextTick(() => {
      setTimeout(() =>{
        widthGrid = con.offsetWidth
        heightGrid = con.offsetHeight
        con.setAttribute('id','playWnd');
        initPlugin()
      },1000)
    })
  },
  methods: {
    closeWindow() {
      if (oWebControl != null) {
        oWebControl.JS_HideWnd(); // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
        oWebControl.JS_Disconnect().then(
          () => {
            // 断开与插件服务连接成功
          },
          () => {
            // 断开与插件服务连接失败
          }
        );
      }
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.video-surveillance {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: url("./../assets/images/surveillance.png") center center no-repeat;
  // background-size: contain;
  background-size: 100% 100%;

  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    .title {
      width: 100%;
      position: relative;
      color: #0099cc;
      font-size: 0.18rem;
      // line-height: 0.5rem;
      margin-top: .07rem;
      margin-left: .2rem;
      font-family: "Heiti SC";
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: .2rem;
      .ico {
        // position: absolute;
        // left: -30px;
        // top: 15px;
        width: 0.22rem;
        height: 0.24rem;
        margin-top: 5px;
        background: url("./../assets/images/sprite.png") top left no-repeat;
      }
    }

    .select {
      width: 1.05rem;
      height: 0.3rem;
      margin-right: 0.3rem;
      margin-top: 0.07rem;
      color: #6666cc;

      .ant-select-selection {
        height: 100%;
        width: 100%;
        background: none;
        color: #6666cc;
        border: solid 0.01rem #6666cc;
      }
    }
  }
  .around{
    padding: 0.2rem;
    flex: 1;
    overflow: hidden;
  }
  .content, .contentContainer {
    height: 100%;
    max-height: 100%;
    position: relative;
    // width: 1080px;
    // height: 400px;
    // flex: 1;
    overflow: hidden;
    margin: 0 auto;
  }
}
</style>
