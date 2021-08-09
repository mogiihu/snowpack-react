import React, {useEffect, useState, useRef} from "react";
import {message} from "antd";
import * as publicAction from "../../actions/public.js";
import {isEmpty, getUrlParam, setSessionStorage, getDeferred} from "../../utils/index.js";
import moment from "moment";
import html2canvas from "html2canvas";
import {PUSH_IMAGE_LOCATION} from "../../config.js";
import "./index.css";
function SurveyFile(props) {
  const [caseInfo, setCaseInfo] = useState([]);
  const [carInfo, setCarInfo] = useState([]);
  const [seatsDynamic, setSeatsDynamic] = useState([]);
  const [doc, setDoc] = useState({});
  const [showSignPics, setShowSignPics] = useState(false);
  const [urlParam, setUrlParam] = useState({});
  const addPostMessage = useRef(false);
  const setPromise = useRef(getDeferred());
  const timer = useRef();
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
                setPromise.current = getDeferred();
              });
            });
          }
        }, 500);
      }
    }, false);
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
        type: "webPagePic"
      });
      const doc2 = docList.filter((item) => item._id == urlParam.docId)[0];
      setDoc(doc2);
      const insurance = insuranceList.filter((item) => item._id == insuranceId)[0];
      if (!insurance) {
        throw Error("insurance error");
      }
      const fields = detail?.fields;
      const seatsCreate = insurance?.fields?.["seats-create"] ? insurance?.fields?.["seats-create"] : [];
      if (!isEmpty(seatsCreate)) {
        seatsCreate.forEach((item) => {
          let value = "";
          if (fields[item.key]) {
            if (!isEmpty(item.options)) {
              const optionValue = item.options.filter((option) => option.key == fields[item.key])[0];
              value = optionValue ? optionValue.name : "-";
            } else {
              value = fields[item.key];
            }
          } else {
            value = "-";
          }
          item.value = value;
        });
      }
      const findOwnLossNameIndex = seatsCreate.findIndex((item) => item.key == "ownLossName");
      const caseInfo2 = seatsCreate.slice(0, findOwnLossNameIndex);
      const carInfo2 = seatsCreate.slice(findOwnLossNameIndex);
      const seatsDynamicItem = insurance?.fields?.["seats-dynamic"] ? insurance?.fields?.["seats-dynamic"][0] : [];
      const seatsDynamic2 = [];
      fields?.otherLossPhoneArray?.forEach(() => {
        seatsDynamic2.push(JSON.parse(JSON.stringify(seatsDynamicItem)));
      });
      seatsDynamic2.forEach((dynamicItem, dynamicIndex) => {
        dynamicItem.forEach((item) => {
          let value = "";
          if (fields[item.key] && fields[item.key][dynamicIndex]) {
            if (!isEmpty(item.options)) {
              const optionValue = item.options.filter((option) => option.key == fields[item.key][dynamicIndex])[0];
              value = optionValue ? optionValue.name : "-";
            } else {
              value = fields[item.key][dynamicIndex];
            }
          } else {
            value = "-";
          }
          item.value = value;
        });
      });
      setCaseInfo(caseInfo2);
      setCarInfo(carInfo2);
      setSeatsDynamic(seatsDynamic2);
      setPromise.current.resolve();
    })();
  }, [urlParam]);
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    id: "file-con-img",
    className: "survey-file"
  }, showSignPics && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "signed-title"
  }, "查勘单电子凭证"), /* @__PURE__ */ React.createElement("div", null, "        您好！现场查勘已完成，谢谢您的配合。事故查勘 详情如下，您可保留此凭证，用作后续理赔。")), /* @__PURE__ */ React.createElement("div", {
    className: "file-block"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "file-con-title"
  }, "案件信息"), /* @__PURE__ */ React.createElement("div", {
    className: "file-block-con"
  }, caseInfo.map((item) => {
    return /* @__PURE__ */ React.createElement("div", {
      key: item.key,
      className: "file-col"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "con-left"
    }, item.name), /* @__PURE__ */ React.createElement("div", {
      className: "con-right"
    }, item.value));
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "file-block"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "file-con-title"
  }, "标的信息"), /* @__PURE__ */ React.createElement("div", {
    className: "file-block-con"
  }, carInfo.map((item) => {
    return /* @__PURE__ */ React.createElement("div", {
      key: item.key,
      className: "file-col"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "con-left"
    }, item.name), /* @__PURE__ */ React.createElement("div", {
      className: "con-right"
    }, item.value));
  }))), seatsDynamic.map((seatsDynamicItem, index) => {
    return /* @__PURE__ */ React.createElement("div", {
      className: "file-block",
      key: index
    }, /* @__PURE__ */ React.createElement("div", {
      className: "file-con-title"
    }, "三者", index + 1), /* @__PURE__ */ React.createElement("div", {
      className: "file-block-con"
    }, seatsDynamicItem.map((item) => {
      return /* @__PURE__ */ React.createElement("div", {
        key: item.key,
        className: "file-col"
      }, /* @__PURE__ */ React.createElement("div", {
        className: "con-left"
      }, item.name), /* @__PURE__ */ React.createElement("div", {
        className: "con-right"
      }, item.value));
    })));
  }), showSignPics && !isEmpty(doc) && !isEmpty(doc.signInfo) && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "file-sign"
  }, doc.signInfo.map((item) => {
    return /* @__PURE__ */ React.createElement("div", {
      className: "file-sign-pics",
      key: item
    }, /* @__PURE__ */ React.createElement("div", {
      className: "sign-name"
    }, item.name, "签字"), /* @__PURE__ */ React.createElement("img", {
      className: "sign-img",
      src: item.signPicUrl,
      crossOrigin: "anonymous"
    }));
  })), /* @__PURE__ */ React.createElement("div", {
    className: "file-bt-text"
  }, /* @__PURE__ */ React.createElement("span", null, "线上理赔中心"), /* @__PURE__ */ React.createElement("span", null, moment(doc.signInfo.signTime).format("YYYY-MM-DD HH:mm:ss"))))));
}
export default SurveyFile;
