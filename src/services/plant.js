import Request from '@/utils/request';

const {postFree, post, uploadFile} = new Request('plant');


/**
 * 获取植物列表
 * @param {userId} params
 */
export function fetchPlantDetail(params) {
  return postFree('/web/plant/list-for-invite', params, {closeTips: true});
}

/**
 * 获取到访记录
 * @param {userId} params
 */
export function fetchAccessRecord(params) {
  return postFree('/web/visit-record/list4Invite', params);
}

/**
 * 接受邀请
 * @param {invitorId, acceptorMobile, verifyCode} param
 */
export function fetchAccept(params) {
  return postFree('/web/member/accept', params, {
    closeTips: true
  });
}

/**
 * 再次邀请
 * @param {invitorId, acceptorMobile, verifyCode} param
 */
export function fetchExitAndJoin(params) {
  return postFree('/web/member/exitAndJoin', params, {
    closeTips: true
  });
}

/**
 * 留言展示
 * @param {userId, ps, pn} params
 */
export function fetchMessage(params) {
  return postFree('/web/message-board/listPage4Invite', params);
}

/**
 * 微信签名
 * @param {url} params
 */
export function fetchWeChatJsSdkConfig(params) {
  return postFree('/web/wx/signature', params, {
    closeTips: true
  });
}

/**
 * 更新微信签名
 * @param {*} params
 */
export function fetchWeChatJsSdkRefresh(params) {
  return postFree('/web/wx/refreshSignature', params);
}

/**
 * 留言展示
 * @param {plantId, pageSize, pageNum} params
 */
export function fetchManageRecord(params) {
  return post('/web/plant/manage-record-list', params);
}

/**
 * 获取喜欢的数量
 * @param {plantId} params
 */
export function fetchManageLikeCount(params) {
  return post('/web/plant/like-count', params);
}

/**
 * 获取房间信息
 * @param {inviteLinkId} params
 */
export function fetchRoomInfo(params) {
  return postFree('/web/member/inviteLinkValid', params, {closeTips: true});
}

/**
 * 植物日记详情
 * @param {diaryId} params
 */
export function fetchDiaryDetail(params) {
  return postFree('/web/plant-diary/get-diary-detail', params, {closeTips: true});
}

/**
 * 植物详情-查看植物详情
 * @param {plantId} params
 */
export function fetchMobilePlantDetail(params) {
  return post('/web/plant/info', params);
}

/**
 * 植物详情-查看植物详情
 * @param {plantId, waterCycleTime} params
 */
export function setWarningTime(params) {
  return post('/web/plant/set-warning-time', params);
}

/**
 * 植物详情-查看植物详情
 * @param {plantId, startDate, endDate} params
 */
export function fetchCalendars(params) {
  return post('/web/plant/calendar', params);
}

/**
 * 植物日记点赞列表
 * http://dev.plant.miaoshu365.com/swagger-ui.html#!
 * @param {pageSize, pageNum, bizId, bizType} param
 */
export function fetch_diary_like_list(params) {
  return postFree('/web/plant-diary/like/list', params);
}

/**
 * 植物日记评论
 * http://dev.plant.miaoshu365.com/swagger-ui.html#!
 * @param {pageSize, pageNum, plantDiaryId} params
 */
export function fetch_diary_comment_list(params) {
  return postFree('/web/plant-diary/comment/list', params);
}

/**
 * 共享病例
 * http://dev.plant.miaoshu365.com/swagger-ui.html#!
 * @param {caseTopic,symptom,plants,treatmentMethod,pics} params
 */
export function caseShare(params) {
  return post('/web/plant-case/share', params);
}

/**
 *http://dev.plant.miaoshu365.com/swagger-ui.html#!
 * 上传图片
 */
export function uploadAlbum(params) {
  return uploadFile('/web/plant/album-upload', params, {loading: true});
}

/*
*常见病例分页列表
 */
export function caseList(params) {
  return post('/web/plant-case/page-list', params, {loading: true});
}

/*
*常见病例跳转的详情
 */
export function caseDetail(params) {
  return post('/web/plant-case/get', params, {loading: true});
}

/*
*常见病例跳转的详情
 */
export function plant_host_list(params) {
  return post('/web/plant-hot/list', params);
}

/*
*热门病例
 */
export function case_host_list(params) {
  return post('/web/hot-case/list', params);
}

/**
 * 植物综合生长情况
 * http://dev.plant.miaoshu365.com/swagger-ui.html#!
 * @param {name, wikiId} params
 */
// 植物详情-植物养护日历
export function fetchCalendar(params) {
  return post('/web/plant-growth/calendar', params);
}

// 查询指定日期生长情况
export function fetchGetByDate(params) {
  return post('/web/plant-growth/get-by-date', params);
}

// 查询房间下植物列表
export function fetchPlantList(params) {
  return post('/web/plant-growth/plant-list', params);
}

// 根据植物查询所在家庭的房间列表
export function fetchRoomList(params) {
  return post('/web/plant-growth/room-list', params);
}

// 查询植物所在房间
export function fetchRoomPlantName(params) {
  return post('/web/plant-growth/plant-room', params);
}

// 新增,编辑生长情况
export function fetchSaveUpdate(params) {
  return post('/web/plant-growth/save-update', params);
}

// 管理操作-设置浇水时间
export function fetchSetWarnTime(params) {
  return post('/web/plant-growth/set-warning-time', params);
}

// 植物详情-查看植物浇水周期
export function fetchWaterInfo(params) {
  return post('/web/plant-growth/water-info', params);
}

// 搜索添加
export function plant_hot_add(params) {
  return post('/web/plant-hot/add', params,{closeTips: true});
}

// 病例联想搜索
export function case_linkage_search(params) {
  return post('/web/plant-case/linkage-search', params, {loading: true});
}

// 病例搜索跳转详情
export function case_search_detail(params) {
  return post('/web/plant-case/detail', params);
}
