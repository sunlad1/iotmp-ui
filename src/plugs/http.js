/* eslint-disable no-unused-expressions */
import axios from 'axios';
import {getSessionInfo, setSessionByWeb, updateSession} from './session';



function showToast() {

}

function showLoading() {

}

function hideLoading() {

}

// const { updateSession, getSessionInfo } = session;

function transformPostData(data, type) {
  let params;
  if (type === 'post') {
    const dataArr = [];
    Object.keys(data).forEach((key) => {
      dataArr.push(`${key}=${data[key]}`);
    });
    params = dataArr.join('&');
  } else {
    params = {params: data};
  }
  return params;
}

// function canMock() {
//   if (ENV === 'DEV'
//     && !(/\.56qq\.([com]||[cn])/).test(window.location.hostname)) {
//     return true;
//   }
//   return false;
// }

function getAxios(option) {
  const {timeout, host, api} = option;
  let request;
  let url;
  // if (canMock() && useMock) {
  //   request = axios.create({
  //     timeout,
  //     headers: { 'Host-Proxy': host }
  //   });
  //   url = api;
  // } else {
  request = axios.create({
    timeout
  });
  url = host + api;
  // }
  return {
    request,
    url
  };
}

/**
 * http
 * 参数：
 *  {String} {required} host：接口域名
 *  {Array} authorityFailureCodes：session下线错误码
 *  {Object} 其他参数
 *    {Boolean} useMock：是否开启mock
 *    {Number} timeout：超时时间，默认20000
 * 方法：
 *  post：带session post请求
 *  get：带session get请求
 *  postFree：post请求
 *  getFree：get请求
 */
class Http {
  constructor(host = '', authorityFailureCodes = [], option = {}) {
    this.host = host;
    this.authorityFailureCodes = authorityFailureCodes;
    this.option = {
      useMock: false,
      timeout: 20000,
      ...option
    };
    this.post = this.post.bind(this);
    this.get = this.get.bind(this);
    this.postFree = this.postFree.bind(this);
    this.getFree = this.getFree.bind(this);
    this.sso = this.sso.bind(this);
    this.free = this.free.bind(this);
    this.ssoWeb = this.ssoWeb.bind(this);
    this.postWeb = this.postWeb.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  get(api = '', data = {}, option = {}) {
    return this.sso({
      api,
      data,
      option,
      type: 'get',
      isDo: false
    });
  }

  post(api = '', data = {}, option = {}, isDo = false) {
    return this.sso({
      api,
      data,
      option,
      type: 'post',
      isDo
    });
  }

  postWeb(api = '', data = {}, option = {}) {
    return this.ssoWeb({
      api,
      data,
      option,
      type: 'post'
    });
  }

  getFree(api = '', data = {}, option = {}) {
    return this.free({
      api,
      data,
      option,
      type: 'get'
    });
  }

  postFree(api = '', data = {}, option = {}) {
    return this.free({
      api,
      data,
      option,
      type: 'post'
    });
  }

  sso(params) {
    return new Promise((resolve, reject) => {
      const {api, option, type, isDo} = params;
      let {data} = params;
      const session = getSessionInfo();
      const {loading, isUpdateSSO = false} = option;
      if (loading) {
        showLoading();
      }
      // 请求参数加入st、sid
      data = {
        _tk_: session.st,
        _deviceId_: session.sid,
        ...data
      };
      const {request, url} = getAxios({
        timeout: option.timeout || this.option.timeout,
        host: this.host,
        api,
        useMock: option.useMock === false ? false : (option.useMock || this.option.useMock)
      });
      return request[type](url, transformPostData(data, type)).then(async (response) => {
        if (loading) {
          hideLoading();
        }
        if (response.data.status.toUpperCase() === 'ERROR') {
          // 如果是session下线，并且没有更新过session，就更新session，并重新执行
          const isErrorOut = this.authorityFailureCodes.includes(response.data.errorCode.toString());
          if (isErrorOut && !isDo) {       
            await updateSession({_promisePending: isUpdateSSO});
            return this.sso(Object.assign(params, {
              isDo: true
            })).then((resp) => {
              resolve(resp);
            }, (resp) => {
              return reject(resp);
            });
          } else {
            if (!option.closeTips && response.data.errorMsg) {
              // 登录状态中，有错误码时提示
              if (!isErrorOut) {
                showToast(response.data.errorMsg);
              }
              // 未登录时，弹起登录关闭提示
              if (isErrorOut && !option.isVote) {
                showToast(response.data.errorMsg);
              }
            }
            return reject(response.data);
          }
        } else {
          resolve(response.data.content);
        }
      }, (e) => {
        showToast('加载异常，请稍后再试');
        hideLoading();
        return reject({status: 'FAIL', errorMsg: '接口错误'}, e);
      });
    });
  }

  ssoWeb(params) {
    return new Promise((resolve, reject) => {

      const {api, option, type} = params;
      const {loading} = option;
      if (loading) {
        showLoading();
      }
      let {data} = params;
      setSessionByWeb().then(
          () => {
            const session = getSessionInfo();

            // 请求参数加入st、sid
            data = {
              _tk_: session.st,
              _deviceId_: session.sid,
              ...data
            };
            const {request, url} = getAxios({
              timeout: option.timeout || this.option.timeout,
              host: this.host,
              api,
              useMock: option.useMock === false ? false : (option.useMock || this.option.useMock)
            });
            return request[type](url, transformPostData(data, type)).then(async (response) => {
              if (loading) {
                hideLoading();
              }
              if (response.data.status.toUpperCase() === 'ERROR') {
                // 如果是session下线，并且没有更新过session，就弹出登陆框，执行h5登陆操作
                if (this.authorityFailureCodes.includes(response.data.errorCode.toString())) {

                  // 弹出登陆
                  return reject(response);
                } else {
                  if (!option.closeTips && response.data.errorMsg) {
                    showToast(response.data.errorMsg);
                  }
                  return reject(response.data);
                }
              } else {
                resolve(response.data.content);
              }

            }, (e) => {
              showToast('加载异常，请稍后再试');
              hideLoading();
              return reject({status: 'FAIL', errorMsg: '接口错误'}, e);
            });
          }
      );

    });
  }

  free(params) {
    return new Promise((resolve, reject) => {
      const {api, data, option, type} = params;
      const {request, url} = getAxios({
        timeout: option.timeout || this.option.timeout,
        host: this.host,
        api,
        useMock: option.useMock === false ? false : (option.useMock || this.option.useMock)
      });
      const {loading} = option;
      if (loading) {
        showLoading();
      }
      return request[type](url, transformPostData(data, type)).then(async (response) => {
        if (loading) {
          hideLoading();
        }
        if (response.data.status && typeof response.data.status === 'string' && response.data.status.toUpperCase() === 'ERROR') {
          if (!option.closeTips && response.data.errorMsg) {
            showToast(response.data.errorMsg);
          }
          return reject(response.data);
        } else {
          if (data.detailInfo) {  // 由于作品详情页面有请求成功但返回有errorCode的情况，所以为作品详情页面单独做处理
            resolve(response.data);
          } else {
            resolve(response.data.content);
          }
        }
      }, (e) => {
        showToast('加载异常，请稍后再试');
        return reject({status: 'FAIL', errorMsg: '接口错误'}, e);
      });
    });
  }

  uploadFile(api, data = {}, option = {}) {
    return new Promise((resolve, reject) => {
      const request = axios.create({
        baseURL: `${this.host}${api}`,
        data,
        method: 'post',
        headers: {'Content-Type': 'multipart/form-data'}
      });
      const {loading} = option;
      if (loading) {
        showLoading();
      }
      return request().then(async (response) => {
        if (loading) {
          hideLoading();
        }
        if (response.data.status && typeof response.data.status === 'string' && response.data.status.toUpperCase() === 'ERROR') {
          if (!option.closeTips && response.data.errorMsg) {
            showToast(response.data.errorMsg);
          }
          return reject(response.data);
        } else {
          resolve(response.data.content);
        }
      }, (e) => {
        showToast('加载异常，请稍后再试');
        return reject({status: 'FAIL', errorMsg: '接口错误'}, e);
      });
    });
  }
}

export default Http;
