function dataFormat(obj) {
  return Object.keys(obj).reduce((arr, key, index) => {
    arr[index] = (`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    return arr;
  }, []).join('&');
}

export default function xhr(url, params, type = 'POST') {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 304) {
          const resp = JSON.parse(request.responseText);
          resolve(resp);
        } else {
          reject();
        }
      }
    };
    const paramsStr = dataFormat(params);
    if (type === 'POST') {
      request.open('POST', encodeURI(url), true);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.send(paramsStr);
    } else {
      request.open('GET', encodeURI(`${url}?${paramsStr}`), true);
      request.send(null);
    }
  });
}
