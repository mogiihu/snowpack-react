const { SNOWPACK_PUBLIC_DOMAIN, NODE_ENV } = import.meta.env;
console.log('%c 🍗 NODE_ENV: ', 'font-size:20px;background-color: #B03734;color:#fff;', NODE_ENV);
console.log(
    '%c 🍒 SNOWPACK_PUBLIC_DOMAIN: ',
    'font-size:20px;background-color: #4b4b4b;color:#fff;',
    SNOWPACK_PUBLIC_DOMAIN
);

// 获取通用域名，cloud 为腾讯，ikandy 为甜新
const getCommonProdDomain = () => {
    if (SNOWPACK_PUBLIC_DOMAIN === 'cloud') return 'https://service-support-prod.cloud-ins.cn';
    if (SNOWPACK_PUBLIC_DOMAIN === 'ikandy') return 'https://service-support-prod.ikandy.cn';
};

export const BASE_API =
    NODE_ENV === 'development'
        ? 'https://developer.ikandy.cn:60724/api/'
        : NODE_ENV == 'test'
        ? 'https://service-support-test.ikandy.cn/api/'
        : getCommonProdDomain() + '/api/';

export const SOCKET_URL =
    NODE_ENV === 'development'
        ? 'https://developer.ikandy.cn:60724'
        : NODE_ENV == 'test'
        ? 'https://service-support-test.ikandy.cn'
        : getCommonProdDomain();

export const PUSH_IMAGE_LOCATION =
    NODE_ENV === 'development'
        ? 'http://localhost:8080/'
        : NODE_ENV == 'test'
        ? 'https://service-support-test.ikandy.cn/'
        : getCommonProdDomain() + '/';
