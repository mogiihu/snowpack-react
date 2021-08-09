import * as publicApi from "../servers/publicApi.js";
export const getAgentInsurance = async (args) => {
  const res = await publicApi.getAgentInsurance(args);
  if (res.errCode === 0) {
    const insurances = res?.result?.insurances ? res?.result?.insurances : [];
    return insurances;
  }
  return [];
};
export const getDetail = async (args) => {
  const res = await publicApi.getDetail(args);
  if (res.errCode === 0) {
    const result = res?.result ? res?.result : [];
    return result;
  }
  return {};
};
export const getDocs = async (args) => {
  const res = await publicApi.getDocs(args);
  if (res.errCode === 0) {
    const result = res?.result ? res?.result : [];
    return result;
  }
  return [];
};
export const getWxaCode = async (args) => {
  const res = await publicApi.getWxaCode(args);
  if (res.errCode === 0) {
    const result = res?.result ? res?.result : "";
    return result;
  }
  return "";
};
export const getGenerateScheme = async (args) => {
  const res = await publicApi.getGenerateScheme(args);
  if (res.errCode === 0) {
    const result = res?.result ? res?.result : "";
    return result;
  }
  return "";
};
