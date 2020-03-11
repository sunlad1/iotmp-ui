// import { isLogin } from './tool';
import xhr from './xhr';
import * as storage from './storage';

// 客户端如果未登录返回结果为-1
const sessionInfo = {
  time: null,
  sid: -1,
  st: -1
};

// 储存session
const saveSession = (sid, st) => {
  sessionInfo.sid = sid || -1;
  sessionInfo.st = st || -1;
  sessionInfo.time = Date.now();

  // 存到storage
  storage.setLocal("sso_sid", sid);
  storage.setLocal("sso_st", st);
};

// 返回当前缓存session
const getSessionInfo = () => {
  return sessionInfo;
};

let list = [];
let promisePending = false;
// 从native更新session(此方法目前只在goblin中调用,触发条件为访问业务接口下线)
const updateSession = ({ _promisePending }) => {
  return new Promise((resolve) => {
    const { updateSession } = window.DN || {};

    if (_promisePending) {
      promisePending = false
    }
    if (!updateSession) {
      return resolve(sessionInfo);
    }

    if (!promisePending) {
      promisePending = true;
      // 调用客户端方法
      updateSession({
        success: function (resp) {
          resp = JSON.parse(resp, 10);
          const { deviceId, tk } = resp;
          saveSession(deviceId, tk);

          // 充值promisePending
          promisePending = false;
          resolve();
          list.map(fun => fun());
          list = [];
        },
        error: function () {
          promisePending = false;
          saveSession(-1, -1);
          resolve();
          list.map(fun => fun());
          list = [];
        }
      })
    } else {
      list.push(resolve);
    }
  });
};

// dev中网页login。
const getSessionByWeb = () => {
  return new Promise((resolve) => {
    const st = storage.getLocal('sso_st') || -1;
    const sid = storage.getLocal('sso_sid') || -1;
    const { api, params } = {};
    if (st !== -1 && sid !== -1) {
      saveSession(sid, st);
      resolve(sessionInfo);
    } else if (!params.mobile) {
      throw new Error('mobile not found');
    } else {
      xhr(api, params)
        .then((resp) => {
          const { deviceId, token } = resp.content;
          saveSession(deviceId, token);
          resolve(sessionInfo);
        });
    }
  });
};

const setSessionByWeb = (deviceId = '-1', tk = "") => {
  return new Promise((resolve) => {
    const st = storage.getLocal('sso_st') || tk;
    const sid = storage.getLocal('sso_sid') || deviceId;
    saveSession(sid, st);
    resolve(sessionInfo);
  });
};



export {
  getSessionInfo,
  updateSession,
  saveSession,
  setSessionByWeb,
  getSessionByWeb
};
