// 服务域名配置，修改和新增 host变量
const host = {
  plant: "plant.miaoshu365.com",

};

const protocol = window.location.protocol;
const handerHost = (env) => {
  let envHost = env.toLocaleUpperCase();
  let envHostHead = '';
  let envApi = {};

  if (envHost === 'DEV') {
    envHostHead = 'dev.';
  } else if (envHost === 'QA') {
    envHostHead = 'qa.';
  }

  Object.keys(host).map(hostKey => {
    if (host[hostKey]) {
      envApi[hostKey] = `${protocol}//${envHostHead}${host[hostKey]}`;
    }
  });

  return envApi;
}

export default {
  // local
  DEV: {
    ...handerHost('DEV'),
  },
  // qa
  QA: {
    ...handerHost('QA'),
  },
  PROD: {
    ...handerHost('PROD'),
  }
};
