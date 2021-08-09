import {message} from "antd";
import axios from "axios";
import {getSessionStorage} from "./utils/index.js";
import {BASE_API} from "./config.js";
const service = axios.create({
  baseURL: BASE_API,
  timeout: 5e4,
  withCredentials: false,
  xsrfCookieName: "xsrf-token"
});
service.interceptors.request.use(function(config) {
  const cookie = getSessionStorage("cookie");
  if (cookie) {
    config.headers["access-token"] = cookie;
  }
  config.headers["Content-Type"] = "application/json;charset=UTF-8";
  if (config.method === "get") {
    config.params = {
      ...config.params,
      timestamp: Number(Date.parse(String(new Date()))) / 1e3
    };
  }
  return config;
}, function(error) {
  return Promise.reject(error);
});
service.interceptors.response.use((response) => {
  if (response.status !== 200) {
    message.error(`发送request失败：${JSON.stringify(response)}，方法名：${response.request.responseURL}`);
    return Promise.reject(new Error("网络异常，请稍后重试"));
  }
  if (response.data.errCode != 0) {
    message.error(`发送request失败：${JSON.stringify(response.data.errInfo)}，方法名：${response.request.responseURL}`);
  }
  const res = response.data;
  return res;
}, (error) => {
  return Promise.reject(error);
});
export default service;
