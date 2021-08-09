/*
 * 天津人保 道路交通事故协商书 h5
 * @Author: mogii
 * @Date: 2020-12-28 11:17:32
 * @Last Modified by: mogii
 * @Last Modified time: 2021-08-06 14:41:00
 */
import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, message, Button } from 'antd';
import * as publicAction from '@src/actions/public';
import { isEmpty, getUrlParam, setSessionStorage, getDeferred } from '@utils/index';
import { PUSH_IMAGE_LOCATION } from '@config';
import moment from 'moment';
import html2canvas from 'html2canvas';
import './index.less';

function AccidentLetter(props) {
    const [fields, setFields] = useState<any>({});
    const [insurance, setInsurance] = useState<any>({});
    const [doc, setDoc] = useState<any>({});
    const [fileCustomerInfo, setFileCustomerInfo] = useState<any>([]);
    const [showSignPics, setShowSignPics] = useState<boolean>(false);
    const [urlParam, setUrlParam] = useState<any>({});
    const addPostMessage = useRef<boolean>(false);
    const setPromise = useRef<any>(getDeferred());
    const timer = useRef<any>();

    const getMsgByRequest = async () => {
        setPromise.current = getDeferred();
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

        const insurance = insuranceList.filter(item => item._id == insuranceId)[0];
        setInsurance(insurance);

        const doc = docList.filter(item => item._id == urlParam.docId)[0];
        setDoc(doc);

        const fields = detail?.fields;
        setFields(fields);
        const seatsCreate = insurance?.fields?.['seats-create']
            ? insurance?.fields?.['seats-create']
            : [];
        if (!isEmpty(seatsCreate)) {
            seatsCreate.forEach(item => {
                item.value = fields[item.key] ? fields[item.key] : '-';
            });
        }

        const fileCustomerInfo = doc?.signInfo?.map(item => {
            const index = fields?.otherClientNameArray?.findIndex(name => item.name == name);
            return {
                otherClientNameArray: fields?.otherClientNameArray?.[index],
                otherClientCardNumberArray: fields?.otherClientCardNumberArray?.[index],
                otherClientPhoneArray: fields?.otherClientPhoneArray?.[index],
                otherClientCarNumberArray: fields?.otherClientCarNumberArray?.[index],
                otherClientInsurerArray: fields?.otherClientInsurerArray?.[index],
                otherClientAciNumberArray: fields?.otherClientAciNumberArray?.[index]
            };
        });

        setFileCustomerInfo(fileCustomerInfo);
        setPromise.current.resolve();
    };

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

    useEffect(() => {
        if (isEmpty(urlParam)) {
            return;
        }
        if (urlParam.fields && urlParam.doc) {
            setFields(urlParam.fields);
            setDoc(urlParam.doc);
            const fileCustomerInfo = urlParam.doc?.signInfo?.map(item => {
                const index = fields?.otherClientNameArray?.findIndex(name => item.name == name);
                return {
                    otherClientNameArray: fields?.otherClientNameArray?.[index],
                    otherClientCardNumberArray: fields?.otherClientCardNumberArray?.[index],
                    otherClientPhoneArray: fields?.otherClientPhoneArray?.[index],
                    otherClientCarNumberArray: fields?.otherClientCarNumberArray?.[index],
                    otherClientInsurerArray: fields?.otherClientInsurerArray?.[index],
                    otherClientAciNumberArray: fields?.otherClientAciNumberArray?.[index]
                };
            });
            setFileCustomerInfo(fileCustomerInfo);
        } else {
            getMsgByRequest();
        }
    }, [urlParam]);

    const getSelectOption = (key, value) => {
        if (!value) {
            return '';
        }

        const field = [
            ...insurance.fields['seats-info'],
            ...insurance.fields['seats-dynamic'].flat(),
            ...insurance.fields['seats-info-dynamic'].flat()
        ].filter(item => item.key == key)[0];
        if (!field) {
            return value;
        } else {
            const option = field.options.filter(item => item.key == value)[0];
            return option.name;
        }
    };

    if (isEmpty(fields) || isEmpty(fileCustomerInfo)) {
        return <></>;
    }
    return (
        <div id={'file-con-img'} className="file-con">
            <div className="file-title">道路交通事故协商书</div>
            <div className="file-grid">
                <Row className="file-col">
                    <Col span={3}>事故时间</Col>
                    <Col span={14}>{moment(fields.reportTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                    <Col span={2}>天气</Col>
                    <Col span={5}>{getSelectOption('accidentWeather', fields.accidentWeather)}</Col>
                </Row>
                <Row className="file-col">
                    <Col span={3}>事故地点</Col>
                    <Col span={21}>{fields.accidentPlace}</Col>
                </Row>
                <Row className="file-col">
                    <Col span={3}>当事人</Col>
                    <Col span={4}>驾驶证或身份证号码</Col>
                    <Col span={2}>联系方式</Col>
                    <Col span={2}>交通方式</Col>
                    <Col span={4}>机动车类型、牌号</Col>
                    <Col span={4}>保险公司</Col>
                    <Col span={5}>交强险凭证号</Col>
                </Row>
                {fileCustomerInfo?.map((item, index) => {
                    return (
                        <Row className="file-col" key={index}>
                            <Col span={3}>{item.otherClientNameArray}</Col>
                            <Col span={4}>{item.otherClientCardNumberArray}</Col>
                            <Col span={2}>{item.otherClientPhoneArray}</Col>
                            <Col span={2}>驾驶机动车</Col>
                            <Col span={4}>
                                <div>
                                    {getSelectOption(
                                        'otherClientCarTypeArray',
                                        fields?.otherClientCarTypeArray?.[index]
                                    )}
                                </div>
                                <div>{item.otherClientCarNumberArray}</div>
                            </Col>
                            <Col span={4}>{item.otherClientInsurerArray}</Col>
                            <Col span={5}>{item.otherClientAciNumberArray}</Col>
                        </Row>
                    );
                })}
                <Row className="file-col file-col2">
                    <Col span={3}>
                        <div className="file-col-title">交通事故事实责任</div>
                    </Col>
                    <Col span={21} className="file-col-con1">
                        {fields.accidentDetail}
                    </Col>
                </Row>
                <Row className="file-col file-col2">
                    <Col span={3}>
                        <div className="file-col-title">损害赔偿调解结果</div>
                    </Col>
                    <Col span={21} className="file-col-con2">
                        {fields.accidentResult}
                    </Col>
                </Row>
                <Row className="file-col">
                    <div className="file-col-notice">
                        24小时内可前往***（电话***）开具正式协商书
                    </div>
                </Row>
            </div>
            {showSignPics && !isEmpty(doc) && !isEmpty(doc.signInfo) && (
                <div>
                    <div className="file-sign" key="file-sign">
                        {doc.signInfo.map(item => {
                            return (
                                <div className="file-sign-pics" key={item}>
                                    <div className="sign-name">{item.name}签字</div>
                                    {item.signPic && (
                                        <img className="sign-img" src={item.signPic} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="file-time">
                        {moment(doc.signInfo.signTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccidentLetter;
