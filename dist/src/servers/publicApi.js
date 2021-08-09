import request from "../request.js";
export function getDetail(params) {
  return request({
    url: "report/detail",
    method: "GET",
    params
  });
}
export function getAgentInsurance(params) {
  return request({
    url: "insurance/agent",
    method: "GET",
    params
  });
}
export function getDocs(params) {
  return request({
    url: "report/docs",
    method: "GET",
    params
  });
}
export function getWxaCode(params) {
  return request({
    url: "weixin/getWxaCode",
    method: "POST",
    data: params
  });
}
export function getGenerateScheme(params) {
  return request({
    url: "weixin/getGenerateScheme",
    method: "POST",
    data: params
  });
}
