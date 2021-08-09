/*
 * 通用车险 h5
 * @Author: mogii
 * @Date: 2020-12-28 11:17:44
 * @Last Modified by: mogii
 * @Last Modified time: 2021-08-03 17:47:58
 */
import React, { useEffect, useState, useRef } from 'react';
import { message } from 'antd';
import * as publicAction from '@src/actions/public';
import { isEmpty, getUrlParam, setSessionStorage, getDeferred } from '@utils/index';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { PUSH_IMAGE_LOCATION } from '@config';
import './index.less';

function SurveyFile(props) {
    const [caseInfo, setCaseInfo] = useState<any>([]);
    const [carInfo, setCarInfo] = useState<any>([]);
    const [seatsDynamic, setSeatsDynamic] = useState<any[]>([]);
    const [doc, setDoc] = useState<any>({});
    const [showSignPics, setShowSignPics] = useState<boolean>(false);
    const [urlParam, setUrlParam] = useState<any>({});
    const addPostMessage = useRef<boolean>(false);
    const setPromise = useRef<any>(getDeferred());
    const timer = useRef<any>();

    const sendPicture = () => {
        window.addEventListener(
            'message',
            e => {
                if (e.data?.getPicture) {
                    timer.current = setInterval(() => {
                        if (document.getElementById('file-con-img')) {
                            clearInterval(timer.current);
                            setPromise.current.then(() => {
                                const dom: any = document.getElementById('file-con-img');
                                html2canvas(dom, { useCORS: true }).then(canvas => {
                                    const dataUrl = canvas.toDataURL('image/png');
                                    window.parent.postMessage(
                                        { dataUrl, type: e.data.type },
                                        PUSH_IMAGE_LOCATION
                                    );
                                    setPromise.current = getDeferred();
                                });
                            });
                        }
                    }, 500);
                }
            },
            false
        );
    };

    useEffect(() => {
        if (isEmpty(urlParam)) {
            return;
        }
        (async () => {
            const insuranceId = urlParam.insuranceId;
            const insuranceList = await publicAction.getAgentInsurance({
                id: urlParam.agentId,
                detailed: true
            });

            const detail = await publicAction.getDetail({
                flowId: urlParam.flowId,
                agentId: urlParam.agentId
            });

            const docList = await publicAction.getDocs({
                flowId: urlParam.flowId,
                agentId: urlParam.agentId,
                type: 'webPagePic'
            });
            const doc = docList.filter(item => item._id == urlParam.docId)[0];
            setDoc(doc);

            const insurance = insuranceList.filter(item => item._id == insuranceId)[0];
            if (!insurance) {
                throw Error('insurance error');
            }

            const fields = detail?.fields;
            const seatsCreate = insurance?.fields?.['seats-create']
                ? insurance?.fields?.['seats-create']
                : [];
            if (!isEmpty(seatsCreate)) {
                seatsCreate.forEach(item => {
                    let value = '';
                    if (fields[item.key]) {
                        if (!isEmpty(item.options)) {
                            const optionValue = item.options.filter(
                                option => option.key == fields[item.key]
                            )[0];
                            value = optionValue ? optionValue.name : '-';
                        } else {
                            value = fields[item.key];
                        }
                    } else {
                        value = '-';
                    }
                    item.value = value;
                });
            }

            const findOwnLossNameIndex = seatsCreate.findIndex(item => item.key == 'ownLossName');
            const caseInfo = seatsCreate.slice(0, findOwnLossNameIndex);
            const carInfo = seatsCreate.slice(findOwnLossNameIndex);

            const seatsDynamicItem: any = insurance?.fields?.['seats-dynamic']
                ? insurance?.fields?.['seats-dynamic'][0]
                : [];
            const seatsDynamic: any[] = [];

            fields?.otherLossPhoneArray?.forEach(() => {
                seatsDynamic.push(JSON.parse(JSON.stringify(seatsDynamicItem)));
            });
            seatsDynamic.forEach((dynamicItem, dynamicIndex) => {
                dynamicItem.forEach(item => {
                    let value = '';
                    if (fields[item.key] && fields[item.key][dynamicIndex]) {
                        if (!isEmpty(item.options)) {
                            const optionValue = item.options.filter(
                                option => option.key == fields[item.key][dynamicIndex]
                            )[0];
                            value = optionValue ? optionValue.name : '-';
                        } else {
                            value = fields[item.key][dynamicIndex];
                        }
                    } else {
                        value = '-';
                    }

                    item.value = value;
                });
            });

            setCaseInfo(caseInfo);
            setCarInfo(carInfo);
            setSeatsDynamic(seatsDynamic);
            setPromise.current.resolve();
        })();
    }, [urlParam]);

    useEffect(() => {
        message.loading({ content: '正在生成电子单，请稍等...' });
        let newUrlParam = getUrlParam().urlParam;
        if (newUrlParam) {
            newUrlParam = JSON.parse(decodeURI(newUrlParam));
        } else {
            throw new Error('urlParam empty');
        }
        if (
            !newUrlParam.flowId ||
            !newUrlParam.agentId ||
            !newUrlParam.insuranceId ||
            !newUrlParam.token
        ) {
            return;
        }
        setSessionStorage('cookie', newUrlParam.token);
        setShowSignPics(newUrlParam.showSignPics);
        setUrlParam(newUrlParam);

        if (!addPostMessage.current) {
            addPostMessage.current = true;
            sendPicture();
        }
    }, [props.location.search]);

    return (
        <>
            <div id={'file-con-img'} className="survey-file">
                {showSignPics && (
                    <div>
                        <div className="signed-title">查勘单电子凭证</div>
                        <div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好！现场查勘已完成，谢谢您的配合。事故查勘
                            详情如下，您可保留此凭证，用作后续理赔。
                        </div>
                    </div>
                )}
                <div className="file-block">
                    <div className="file-con-title">案件信息</div>
                    <div className="file-block-con">
                        {caseInfo.map(item => {
                            return (
                                <div key={item.key} className="file-col">
                                    <div className="con-left">{item.name}</div>
                                    <div className="con-right">{item.value}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="file-block">
                    <div className="file-con-title">标的信息</div>
                    <div className="file-block-con">
                        {carInfo.map(item => {
                            return (
                                <div key={item.key} className="file-col">
                                    <div className="con-left">{item.name}</div>
                                    <div className="con-right">{item.value}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {seatsDynamic.map((seatsDynamicItem, index) => {
                    return (
                        <div className="file-block" key={index}>
                            <div className="file-con-title">三者{index + 1}</div>
                            <div className="file-block-con">
                                {seatsDynamicItem.map(item => {
                                    return (
                                        <div key={item.key} className="file-col">
                                            <div className="con-left">{item.name}</div>
                                            <div className="con-right">{item.value}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                {showSignPics && !isEmpty(doc) && !isEmpty(doc.signInfo) && (
                    <div>
                        <div className="file-sign">
                            {doc.signInfo.map(item => {
                                return (
                                    <div className="file-sign-pics" key={item}>
                                        <div className="sign-name">{item.name}签字</div>
                                        <img
                                            className="sign-img"
                                            src={item.signPicUrl}
                                            crossOrigin="anonymous"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="file-bt-text">
                            <span>线上理赔中心</span>
                            <span>
                                {moment(doc.signInfo.signTime).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SurveyFile;
