// 设置localstorage
function setLocal(key, data) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

// 获取localstorage
function getLocal(key) {
  const data = window.localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

// 清除localstorage
function clearLocal(key) {
  window.localStorage.clear(key);
}

export {
  setLocal,
  getLocal,
  clearLocal
};
