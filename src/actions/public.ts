import * as publicApi from '@servers/publicApi';

// 获取险种信息
export const getAgentInsurance = async args => {
    const res: any = await publicApi.getAgentInsurance(args);
    if (res.errCode === 0) {
        const insurances = res?.result?.insurances ? res?.result?.insurances : [];
        return insurances;
    }
    return [];
};

// 获取工单详情
export const getDetail = async args => {
    const res: any = await publicApi.getDetail(args);
    if (res.errCode === 0) {
        const result = res?.result ? res?.result : [];
        return result;
    }
    return {};
};

// 获取签字信息
export const getDocs = async args => {
    const res: any = await publicApi.getDocs(args);
    if (res.errCode === 0) {
        const result = res?.result ? res?.result : [];
        return result;
    }
    return [];
};

// 获取小程序二维码
export const getWxaCode = async args => {
    const res: any = await publicApi.getWxaCode(args);
    if (res.errCode === 0) {
        const result = res?.result ? res?.result : '';
        return result;
    }
    return '';
};

// 获取小程序跳转链接
export const getGenerateScheme = async args => {
    const res: any = await publicApi.getGenerateScheme(args);
    if (res.errCode === 0) {
        const result = res?.result ? res?.result : '';
        return result;
    }
    return '';
};
