import React, {lazy} from "react";
import {Route} from "react-router-dom";
const Index = lazy(() => import("./pages/index/index.js"));
const AccidentLetter = lazy(() => import("./pages/accidentLetter/index.js"));
const SurveyFile = lazy(() => import("./pages/surveyFile/index.js"));
const ShareMiniapp = lazy(() => import("./pages/shareMiniapp/index.js"));
const routes = [
  {
    path: "/index",
    component: Index
  },
  {
    path: "/accidentLetter",
    component: AccidentLetter
  },
  {
    path: "/surveyFile",
    component: SurveyFile
  },
  {
    path: "/shareMiniapp",
    component: ShareMiniapp
  }
];
const rootConfig = routes.map((route) => {
  const {component: Component} = route;
  return /* @__PURE__ */ React.createElement(Route, {
    key: route.path,
    path: route.path,
    exact: true,
    component: Component
  });
});
export default rootConfig;
