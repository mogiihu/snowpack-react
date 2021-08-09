/* h5小程序引导页面
 * @Author: mogii
 * @Date: 2021-01-21 17:32:54
 * @Last Modified by: mogii
 * @Last Modified time: 2021-08-06 14:52:58
 */
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { getWxaCode, getGenerateScheme } from '@src/actions/public';
import { getUrlParam } from '@utils/index';
import './index.less';

export default function ShareMiniapp() {
    const [imgSrc, setImgSrc] = useState();
    const [appUrl, setAppUrl] = useState('');
    const { fullName, tenantCode, page } = getUrlParam();
    const query = decodeURIComponent(getUrlParam().query);

    useEffect(() => {
        getWxaCode({
            tenantCode: tenantCode,
            scene: query,
            page: page || 'pages/index/index'
        }).then(imgResult => {
            setImgSrc(imgResult);
        });

        getGenerateScheme({
            tenantCode: tenantCode,
            jump_wxa: {
                path: page || 'pages/index/index',
                query: query
            }
        }).then(scheme => {
            setAppUrl(scheme);
            location.href = scheme;
        });
    }, []);

    const openMiniapp = async () => {
        if (!appUrl) {
            Modal.error({ title: '链接跳转失败，请扫码打开小程序！' });
        }
        location.href = appUrl;
    };

    return (
        <div className="share-miniapp">
            <div className="top">
                <div className="left">业务员</div>
                <div className="cen">{decodeURIComponent(fullName)}</div>
                <div className="right">邀请您发起视频呼叫</div>
            </div>
            <div className="center">
                {imgSrc && <img className="img" src={imgSrc} />}
                <div className="text">支持使用微信APP扫码后呼叫</div>
            </div>
            <div className="bottom">
                <Button className="btn" type="primary" onClick={openMiniapp}>
                    打开小程序
                </Button>
            </div>
        </div>
    );
}
