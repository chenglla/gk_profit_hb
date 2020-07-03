import request from '@/utils/request'

export function getGenerateCode (req) { // 生成推广码
    return request({
        url: 'extends/QRCode',
        method: 'get',
        params: req
    })
}
export function getOneScoreByCity (req) { // 通过地区 年份 科目 分页查询一份一段表
    return request({
        url: 'sectionscore/getList',
        method: 'get',
        params: req
    })
}
export function getOneScoreById (req) { // 通过id查询一份一段表信息
    return request({
        url: 'sectionscore/getSectionscoreById',
        method: 'get',
        params: req
    })
}
export function updateOneScore (req) { // 修改新增一份一段表信息
    return request({
        url: 'sectionscore/updateSectionscore',
        method: 'get',
        params: req
    })
}
// export function getOneScoreProvince () { // 一分一段表获取城市
//     return request({
//         url: 'sectionscore/sectioncity',
//         method: 'get'
//         // params: req
//     })
// }
export function getOneScoreYear (req) { // 一分一段表根据城市获取年份
    return request({
        url: 'sectionscore/sectionyear',
        method: 'get',
        params: req
    })
}
export function getOneScoreCategory (req) { // 一分一段表根据城市年份获取文理科
    return request({
        url: 'sectionscore/sectionsubject',
        method: 'get',
        params: req
    })
}
export function getzyBatchInfo (req) { // 志愿批次信息表根据城市获取
    return request({
        url: 'batch/findAllBatchByCity',
        method: 'get',
        params: req
    })
}
export function updateBatchInfo (req) { // 志愿批次信息表修改
    return request({
        url: 'batch/updateBatchInfo',
        method: 'get',
        params: req
    })
}
export function getOneScoreProvince () { // 一分一段表获取城市
    return request({
        url: 'extends/sectioncity',
        method: 'get'
        // params: req
    })
}
export function getVipPayInfo (req) { // 获取vip付费详情
    return request({
        url: 'extends/findUserVipInfo',
        method: 'get',
        params: req
    })
}
export function getPredictInfo (req) { // 获取预测付费详情
    return request({
        url: 'extends/findUserYuceInfo',
        method: 'get',
        params: req
    })
}
export function findAgentInfo (req) {
    req.pageSize = 20
    return request({
        url: 'extends/findAgentInfo',
        method: 'get',
        params: req
    })
}
export function getAllAgent (req) { // 获取所有的代理
    return request({
        url: 'extends/findAgentAll',
        method: 'get',
        params: req
    })
}
export function login (req) { // 用户登录
    return request({
        url: 'extends/login',
        method: 'get',
        params: req
    })
}
export function updatePwd (req) { // 修改密码
    return request({
        url: 'extends/updatePwd',
        method: 'get',
        params: req
    })
}
