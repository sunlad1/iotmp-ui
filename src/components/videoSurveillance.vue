<template>
  <div class="video-surveillance" id="video-surveillance">
    <div class="header">
      <div class="title">
        <div class="ico"></div>
        <span style="display:inline-block;margin-right:auto">视屏监控</span>
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

    <dialogBox 
      :dialogTableVisible="dialogTableVisible" 
      @closeDialog="closeDialog" 
      @clearDialogSubmit="clearDialogSubmit" 
      @onSubmit="onSubmit"
    >
      <template v-slot:header>
        <img src="/static/imgs/operationManage/operationIcon.png" alt />
        <p style="margin-right:auto">设置回放信息</p>
      </template>
      <template v-slot:middle>
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="监控编号">
                <el-select v-model="form.codeActive" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in codeList"
                    :key="index"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="起止时间">
                <el-date-picker
                  v-model="form.valueTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>    
    </dialogBox>

    <dialogBox 
      :dialogTableVisible="dialogTableVisible1" 
      @closeDialog="closeDialog1" 
      @clearDialogSubmit="clearDialogSubmit1" 
      @onSubmit="onSubmit1"
    >
      <template v-slot:header>
        <img src="/static/imgs/operationManage/operationIcon.png" alt />
        <p style="margin-right:auto">设置预览信息</p>
      </template>
      <template v-slot:middle>
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="24" v-for="(el,i) in monitorForm" :key="i">
              <el-form-item :label="`窗口${i+1}`">
                <el-select v-model="el.active" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in el.list"
                    :key="index"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>    
    </dialogBox>

  </div>
</template>
<script src="jsWebControl-1.0.0.min.js"></script>
<script src="jsencrypt.min.js"></script>  
<script>
import { websoketURL } from "@/config/env";
import { getVideoMonitorInfo, getVideoIndexCode } from '@/api/user'
import { mapGetters } from 'vuex';
import dialogBox from '@/components/dialogBox'
var oWebControl = null; // 插件对象
var initCount = 0;
var pubKey = "";
var widthGrid = 0;
var heightGrid = 0;
var playModeValue = 3;  //0 预览 1 回放
var layoutNum = 2;
var codeList = []
var form = {}
var cameraArr = [
  {
    id: '625f9d1707ac4bdb8028dee0ee085357',
    index: 1,
  },
  {
    id: '7937fd678eb2470c99ee5d7a9100c018',
    index: 2,
  },
]
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
      // oWebControl = null;
    }
  });
}

//初始化
function init() {
  getPubKey(function() {
    getVideoMonitorInfo().then(res => {
      // if (res.status == 200 && res.readyState == 4) {
        // var data = JSON.parse(xhr.responseText);
        var data = res.data;
        ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
        var appkey = data.appKey; //综合安防管理平台提供的appkey，必填
        var secret = setEncrypt(data.appSecret); //综合安防管理平台提供的secret，必填
        var ip = data.ip; //综合安防管理平台IP地址，必填
        var playMode = Number(playModeValue); //初始播放模式：0-预览，1-回放
        var port = 443; //综合安防管理平台端口，若启用HTTPS协议，默认443
        var snapDir = data.snapDir; //抓图存储路径
        var videoDir = data.videoDir; //紧急录像或录像剪辑存储路径
        if(playModeValue == 0){
          var layout = `${layoutNum}x${layoutNum}`; //playMode指定模式的布局
        }else if(playModeValue == 1){
          var layout = `1x1`; //playMode指定模式的布局
        }
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
        if(playModeValue == 0){
          codeList.forEach((v,index) => {
            // previewStart(v.code,index + 1)
            previewStart(v,index + 1)
          })
        }else if(playModeValue == 1){
          playBack()
        }
        // oWebControl.JS_Resize(1108, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
      });
      // }
    })
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
// 设置窗口控制回调
function setCallbacks() {
  oWebControl.JS_SetWindowControlCallback({
    cbIntegrationCallBack: function(oData){ // oData 是封装的视频 web 插件回调消息的消息体
      console.log(JSON.stringify(oData)); // 打印消息体至控制台
    }
  });
  // oWebControl.JS_SetWindowControlCallback({
  //   cbIntegrationCallBack: cbIntegrationCallBack
  // });
}

// 回放方法
function playBack(){
  var cameraIndexCode  = form.codeActive;        //获取输入的监控点编号值，必填
  var startTimeStamp = new Date(form.valueTime[0]).getTime();    //回放开始时间戳，必填
  var endTimeStamp = new Date(form.valueTime[1]).getTime();        //回放结束时间戳，必填
  var recordLocation = 1;                                     //录像存储位置：0-中心存储，1-设备存储
  var transMode = 1;                                          //传输协议：0-UDP，1-TCP
  var gpuMode = 0;                                            //是否启用GPU硬解，0-不启用，1-启用
  var wndId = -1;                                             //播放窗口序号（在2x2以上布局下可指定播放窗口）

  oWebControl.JS_RequestInterface({
      funcName: "startPlayback",
      argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode,                   //监控点编号
          startTimeStamp: Math.floor(startTimeStamp / 1000).toString(),  //录像查询开始时间戳，单位：秒
          endTimeStamp: Math.floor(endTimeStamp / 1000).toString(),      //录像结束开始时间戳，单位：秒
          recordLocation: recordLocation,                     //录像存储类型：0-中心存储，1-设备存储
          transMode: transMode,                               //传输协议：0-UDP，1-TCP
          gpuMode: gpuMode,                                   //是否启用GPU硬解，0-不启用，1-启用
          wndId:wndId                                         //可指定播放窗口
      })
  })
}


// 预览方法
function previewStart(id,index){
  var cameraIndexCode  = id;     //获取输入的监控点编号值，必填
  var streamMode = 0;                                     //主子码流标识：0-主码流，1-子码流
  var transMode = 1;                                      //传输协议：0-UDP，1-TCP
  var gpuMode = 0;                                        //是否启用GPU硬解，0-不启用，1-启用
  var wndId = index;                                         //播放窗口序号（在2x2以上布局下可指定播放窗口）

  cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
  cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");

  oWebControl.JS_RequestInterface({
      funcName: "startPreview",
      argument: JSON.stringify({
          cameraIndexCode:cameraIndexCode,                //监控点编号
          streamMode: streamMode,                         //主子码流标识
          transMode: transMode,                           //传输协议
          gpuMode: gpuMode,                               //是否开启GPU硬解
          wndId:wndId                                     //可指定播放窗口
      })
  })
}

// 推送消息
function cbIntegrationCallBack(oData) {
  console.log(oData);
}
export default {
  name: "HelloWorld",
  components:{
    dialogBox
  },
  props: {
    isCloseMonitor:{
      type: Boolean
    }
  },
  data() {
    return {
      monitorForm:[],
      dialogTableVisible1: false,
      dialogTableVisible: false,
      monitorType: null,
      selectData: [{}],
      current: [0],
      codeList: [],
      layoutNum: 2,
      form:{
        codeActive: '',
        valueTime: ''
      }
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
        if(oWebControl){
          console.log('oWebControl不存在');
          oWebControl.JS_RequestInterface({
              funcName: "stopAllPlayback"
          }).then(res => {
            this.dialogTableVisible1 = true
            playModeValue = 0
            this.monitorForm = []
            this.codeList.forEach(v => {
              this.monitorForm.push({
                list: this.codeList,
                active: ''
              })
            })
          })
        }else{
          this.dialogTableVisible1 = true
          playModeValue = 0
          this.monitorForm = []
          this.codeList.forEach(v => {
            this.monitorForm.push({
              list: this.codeList,
              active: ''
            })
          })
        }
        // this.closeWindow(() => {})
      }else if(n == 1){
        if(oWebControl){
          oWebControl.JS_RequestInterface({
              funcName: "stopAllPreview"
          }).then(res => {
            playModeValue = 1
            this.dialogTableVisible = true
          })
        }else{
          playModeValue = 1
          this.dialogTableVisible = true
        }
        // this.closeWindow(() => {})
      }
    }
  },
  beforeDestroy(){
    this.closeWindow()
    // oWebControl.JS_RequestInterface({
    //     funcName: "stopAllPreview"
    // });
  },
  computed:{
      ...mapGetters(['userInfo','partitionId']),
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
        // 初始化之前先把一些配置参数和 监控编号拿到手
        this.initMonitor()
      },1000)
    })
  },
  methods: {
    onSubmit1(){
      this.dialogTableVisible1 = false
      playModeValue = 0
      codeList= []
      this.monitorForm.forEach(res => {
        if(res.active && res.active != ''){
          codeList.push(res.active)
        }
      })

      let index = 6
      while(index--){
        if(index * index < codeList.length){
          layoutNum = index + 1
          break
        }
      }
      if(oWebControl){
        console.log('oWebControl 不存在');
        initPlugin()
      }else{
        init()
      }
    },
    clearDialogSubmit1(){
      this.dialogTableVisible1 = false
    },
    closeDialog1(){
      this.dialogTableVisible1 = false
    },
    closeDialog(){
      this.dialogTableVisible = false
    },
    clearDialogSubmit(){
      this.dialogTableVisible = false
    },
    onSubmit(){
      this.dialogTableVisible = false
      form = this.form
      playModeValue = 1
      if(oWebControl){
        initPlugin()
      }else{
        init()
      }
    },
    async initMonitor(){
      let data = await getVideoIndexCode({partitionId: this.partitionId})
      this.codeList = data.data
      // codeList = data.data
      // let index = 6
      // while(index--){
      //   if(index * index < codeList.length){
      //     layoutNum = index + 1
      //     break
      //   }
      // }
      // initPlugin()
    },
    closeWindow(callback) {
      if (oWebControl != null) {
        oWebControl.JS_HideWnd(); // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
        oWebControl.JS_Disconnect().then(
          () => {
            // 断开与插件服务连接成功
            oWebControl = null;
            console.log('断开与插件服务连接成功');
            if(callback){
              callback()
            }
          },
          () => {
            console.log('断开与插件服务连接失败');
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
<style lang="less">
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


  // .addDialog{
  //   position: fixed !important;
  //   bottom: 0 !important;
  //   left: 0 !important;
  // }

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
