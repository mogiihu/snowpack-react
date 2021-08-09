import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import {ConfigProvider} from "antd";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {Switch, Router} from "react-router-dom";
import {createHashHistory} from "history";
import routeConfig from "./routeConfig.js";
import "./styles/index.css";
import "antd/dist/antd.css";
const history = createHashHistory();
dayjs.locale("zh-cn");
const APP = () => {
  return /* @__PURE__ */ React.createElement(ConfigProvider, {
    locale: zh_CN
  }, /* @__PURE__ */ React.createElement(Router, {
    history
  }, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "Loading...")
  }, /* @__PURE__ */ React.createElement(Switch, null, routeConfig))));
};
ReactDOM.render(/* @__PURE__ */ React.createElement(APP, null), document.getElementById("root"));
