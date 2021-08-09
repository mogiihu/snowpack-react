import request from '@request';

// 获取工单详情
export function getDetail(params) {
    return request({
        url: 'report/detail',
        method: 'GET',
        params
    });
}

// 获取可配置字段
export function getAgentInsurance(params) {
    return request({
        url: 'insurance/agent',
        method: 'GET',
        params
    });
}

// 获取文档
export function getDocs(params) {
    return request({
        url: 'report/docs',
        method: 'GET',
        params
    });
}

// 获取小程序二维码
export function getWxaCode(params) {
    return request({
        url: 'weixin/getWxaCode',
        method: 'POST',
        data: params
    });
}

// 获取小程序跳转链接
export function getGenerateScheme(params) {
    return request({
        url: 'weixin/getGenerateScheme',
        method: 'POST',
        data: params
    });
}
