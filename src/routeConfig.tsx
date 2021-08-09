/*
 * 页面路由配置
 * @Author: mogii
 * @Date: 2020-12-28 11:18:07
 * @Last Modified by: mogii
 * @Last Modified time: 2021-08-03 18:23:44
 */
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
const Index = lazy(() => import('@pages/index/index'));
const AccidentLetter = lazy(() => import('@pages/accidentLetter'));
const SurveyFile = lazy(() => import('@pages/surveyFile/index'));
const ShareMiniapp = lazy(() => import('@pages/shareMiniapp/index'));

const routes = [
    {
        // 登录页
        path: '/index',
        component: Index
    },
    {
        // 天津人保事故责任认定书
        path: '/accidentLetter',
        component: AccidentLetter
    },
    {
        // 通用车险事故责任认定书
        path: '/surveyFile',
        component: SurveyFile
    },
    {
        // h5小程序引导页面
        path: '/shareMiniapp',
        component: ShareMiniapp
    }
];

const rootConfig = routes.map(route => {
    const { component: Component } = route;
    return <Route key={route.path} path={route.path} exact component={Component} />;
});
export default rootConfig;
