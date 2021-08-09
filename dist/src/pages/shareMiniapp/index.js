import React, {useEffect, useState} from "react";
import {Button, Modal} from "antd";
import {getWxaCode, getGenerateScheme} from "../../actions/public.js";
import {getUrlParam} from "../../utils/index.js";
import "./index.css";
export default function ShareMiniapp() {
  const [imgSrc, setImgSrc] = useState();
  const [appUrl, setAppUrl] = useState("");
  const {fullName, tenantCode, page} = getUrlParam();
  const query = decodeURIComponent(getUrlParam().query);
  useEffect(() => {
    getWxaCode({
      tenantCode,
      scene: query,
      page: page || "pages/index/index"
    }).then((imgResult) => {
      setImgSrc(imgResult);
    });
    getGenerateScheme({
      tenantCode,
      jump_wxa: {
        path: page || "pages/index/index",
        query
      }
    }).then((scheme) => {
      setAppUrl(scheme);
      location.href = scheme;
    });
  }, []);
  const openMiniapp = async () => {
    if (!appUrl) {
      Modal.error({title: "链接跳转失败，请扫码打开小程序！"});
    }
    location.href = appUrl;
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "share-miniapp"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "top"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "left"
  }, "业务员"), /* @__PURE__ */ React.createElement("div", {
    className: "cen"
  }, decodeURIComponent(fullName)), /* @__PURE__ */ React.createElement("div", {
    className: "right"
  }, "邀请您发起视频呼叫")), /* @__PURE__ */ React.createElement("div", {
    className: "center"
  }, imgSrc && /* @__PURE__ */ React.createElement("img", {
    className: "img",
    src: imgSrc
  }), /* @__PURE__ */ React.createElement("div", {
    className: "text"
  }, "支持使用微信APP扫码后呼叫")), /* @__PURE__ */ React.createElement("div", {
    className: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    className: "btn",
    type: "primary",
    onClick: openMiniapp
  }, "打开小程序")));
}
