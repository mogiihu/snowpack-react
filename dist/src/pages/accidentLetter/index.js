import React, {useEffect, useState, useRef} from "react";
import {Row, Col, message} from "antd";
import * as publicAction from "../../actions/public.js";
import {isEmpty, getUrlParam, setSessionStorage, getDeferred} from "../../utils/index.js";
import {PUSH_IMAGE_LOCATION} from "../../config.js";
import moment from "moment";
import html2canvas from "html2canvas";
import "./index.css";
function AccidentLetter(props) {
  const [fields, setFields] = useState({});
  const [insurance, setInsurance] = useState({});
  const [doc, setDoc] = useState({});
  const [fileCustomerInfo, setFileCustomerInfo] = useState([]);
  const [showSignPics, setShowSignPics] = useState(false);
  const [urlParam, setUrlParam] = useState({});
  const addPostMessage = useRef(false);
  const setPromise = useRef(getDeferred());
  const timer = useRef();
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
      type: "webPagePic"
    });
    const insurance2 = insuranceList.filter((item) => item._id == insuranceId)[0];
    setInsurance(insurance2);
    const doc2 = docList.filter((item) => item._id == urlParam.docId)[0];
    setDoc(doc2);
    const fields2 = detail?.fields;
    setFields(fields2);
    const seatsCreate = insurance2?.fields?.["seats-create"] ? insurance2?.fields?.["seats-create"] : [];
    if (!isEmpty(seatsCreate)) {
      seatsCreate.forEach((item) => {
        item.value = fields2[item.key] ? fields2[item.key] : "-";
      });
    }
    const fileCustomerInfo2 = doc2?.signInfo?.map((item) => {
      const index = fields2?.otherClientNameArray?.findIndex((name) => item.name == name);
      return {
        otherClientNameArray: fields2?.otherClientNameArray?.[index],
        otherClientCardNumberArray: fields2?.otherClientCardNumberArray?.[index],
        otherClientPhoneArray: fields2?.otherClientPhoneArray?.[index],
        otherClientCarNumberArray: fields2?.otherClientCarNumberArray?.[index],
        otherClientInsurerArray: fields2?.otherClientInsurerArray?.[index],
        otherClientAciNumberArray: fields2?.otherClientAciNumberArray?.[index]
      };
    });
    setFileCustomerInfo(fileCustomerInfo2);
    setPromise.current.resolve();
  };
  const sendPicture = () => {
    window.addEventListener("message", (e) => {
      if (e.data?.getPicture) {
        timer.current = setInterval(() => {
          if (document.getElementById("file-con-img")) {
            clearInterval(timer.current);
            setPromise.current.then(() => {
              const dom = document.getElementById("file-con-img");
              html2canvas(dom, {useCORS: true}).then((canvas) => {
                const dataUrl = canvas.toDataURL("image/png");
                window.parent.postMessage({dataUrl, type: e.data.type}, PUSH_IMAGE_LOCATION);
              });
            });
          }
        }, 500);
      }
    }, false);
  };
  useEffect(() => {
    message.loading({content: "正在生成电子单，请稍等..."});
    let newUrlParam = getUrlParam().urlParam;
    if (newUrlParam) {
      newUrlParam = JSON.parse(decodeURI(newUrlParam));
    } else {
      throw new Error("urlParam empty");
    }
    if (!newUrlParam.flowId || !newUrlParam.agentId || !newUrlParam.insuranceId || !newUrlParam.token) {
      return;
    }
    setSessionStorage("cookie", newUrlParam.token);
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
      const fileCustomerInfo2 = urlParam.doc?.signInfo?.map((item) => {
        const index = fields?.otherClientNameArray?.findIndex((name) => item.name == name);
        return {
          otherClientNameArray: fields?.otherClientNameArray?.[index],
          otherClientCardNumberArray: fields?.otherClientCardNumberArray?.[index],
          otherClientPhoneArray: fields?.otherClientPhoneArray?.[index],
          otherClientCarNumberArray: fields?.otherClientCarNumberArray?.[index],
          otherClientInsurerArray: fields?.otherClientInsurerArray?.[index],
          otherClientAciNumberArray: fields?.otherClientAciNumberArray?.[index]
        };
      });
      setFileCustomerInfo(fileCustomerInfo2);
    } else {
      getMsgByRequest();
    }
  }, [urlParam]);
  const getSelectOption = (key, value) => {
    if (!value) {
      return "";
    }
    const field = [
      ...insurance.fields["seats-info"],
      ...insurance.fields["seats-dynamic"].flat(),
      ...insurance.fields["seats-info-dynamic"].flat()
    ].filter((item) => item.key == key)[0];
    if (!field) {
      return value;
    } else {
      const option = field.options.filter((item) => item.key == value)[0];
      return option.name;
    }
  };
  if (isEmpty(fields) || isEmpty(fileCustomerInfo)) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  }
  return /* @__PURE__ */ React.createElement("div", {
    id: "file-con-img",
    className: "file-con"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "file-title"
  }, "道路交通事故协商书"), /* @__PURE__ */ React.createElement("div", {
    className: "file-grid"
  }, /* @__PURE__ */ React.createElement(Row, {
    className: "file-col"
  }, /* @__PURE__ */ React.createElement(Col, {
    span: 3
  }, "事故时间"), /* @__PURE__ */ React.createElement(Col, {
    span: 14
  }, moment(fields.reportTime).format("YYYY-MM-DD HH:mm:ss")), /* @__PURE__ */ React.createElement(Col, {
    span: 2
  }, "天气"), /* @__PURE__ */ React.createElement(Col, {
    span: 5
  }, getSelectOption("accidentWeather", fields.accidentWeather))), /* @__PURE__ */ React.createElement(Row, {
    className: "file-col"
  }, /* @__PURE__ */ React.createElement(Col, {
    span: 3
  }, "事故地点"), /* @__PURE__ */ React.createElement(Col, {
    span: 21
  }, fields.accidentPlace)), /* @__PURE__ */ React.createElement(Row, {
    className: "file-col"
  }, /* @__PURE__ */ React.createElement(Col, {
    span: 3
  }, "当事人"), /* @__PURE__ */ React.createElement(Col, {
    span: 4
  }, "驾驶证或身份证号码"), /* @__PURE__ */ React.createElement(Col, {
    span: 2
  }, "联系方式"), /* @__PURE__ */ React.createElement(Col, {
    span: 2
  }, "交通方式"), /* @__PURE__ */ React.createElement(Col, {
    span: 4
  }, "机动车类型、牌号"), /* @__PURE__ */ React.createElement(Col, {
    span: 4
  }, "保险公司"), /* @__PURE__ */ React.createElement(Col, {
    span: 5
  }, "交强险凭证号")), fileCustomerInfo?.map((item, index) => {
    return /* @__PURE__ */ React.createElement(Row, {
      className: "file-col",
      key: index
    }, /* @__PURE__ */ React.createElement(Col, {
      span: 3
    }, item.otherClientNameArray), /* @__PURE__ */ React.createElement(Col, {
      span: 4
    }, item.otherClientCardNumberArray), /* @__PURE__ */ React.createElement(Col, {
      span: 2
    }, item.otherClientPhoneArray), /* @__PURE__ */ React.createElement(Col, {
      span: 2
    }, "驾驶机动车"), /* @__PURE__ */ React.createElement(Col, {
      span: 4
    }, /* @__PURE__ */ React.createElement("div", null, getSelectOption("otherClientCarTypeArray", fields?.otherClientCarTypeArray?.[index])), /* @__PURE__ */ React.createElement("div", null, item.otherClientCarNumberArray)), /* @__PURE__ */ React.createElement(Col, {
      span: 4
    }, item.otherClientInsurerArray), /* @__PURE__ */ React.createElement(Col, {
      span: 5
    }, item.otherClientAciNumberArray));
  }), /* @__PURE__ */ React.createElement(Row, {
    className: "file-col file-col2"
  }, /* @__PURE__ */ React.createElement(Col, {
    span: 3
  }, /* @__PURE__ */ React.createElement("div", {
    className: "file-col-title"
  }, "交通事故事实责任")), /* @__PURE__ */ React.createElement(Col, {
    span: 21,
    className: "file-col-con1"
  }, fields.accidentDetail)), /* @__PURE__ */ React.createElement(Row, {
    className: "file-col file-col2"
  }, /* @__PURE__ */ React.createElement(Col, {
    span: 3
  }, /* @__PURE__ */ React.createElement("div", {
    className: "file-col-title"
  }, "损害赔偿调解结果")), /* @__PURE__ */ React.createElement(Col, {
    span: 21,
    className: "file-col-con2"
  }, fields.accidentResult)), /* @__PURE__ */ React.createElement(Row, {
    className: "file-col"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "file-col-notice"
  }, "24小时内可前往***（电话***）开具正式协商书"))), showSignPics && !isEmpty(doc) && !isEmpty(doc.signInfo) && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "file-sign",
    key: "file-sign"
  }, doc.signInfo.map((item) => {
    return /* @__PURE__ */ React.createElement("div", {
      className: "file-sign-pics",
      key: item
    }, /* @__PURE__ */ React.createElement("div", {
      className: "sign-name"
    }, item.name, "签字"), item.signPic && /* @__PURE__ */ React.createElement("img", {
      className: "sign-img",
      src: item.signPic
    }));
  })), /* @__PURE__ */ React.createElement("div", {
    className: "file-time"
  }, moment(doc.signInfo.signTime).format("YYYY-MM-DD HH:mm:ss"))));
}
export default AccidentLetter;
