// eslint-disable-next-line no-unused-expressions
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Switch, Router, Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import Index from '@pages/index/index';
import ErrorBoundary from '@components/ErrorBoundary/index';
import routeConfig from '@routeConfig';
import './styles/index.less';
import 'antd/dist/antd.css';

const history = createHashHistory();
dayjs.locale('zh-cn');

const APP = () => {
    return (
        <ConfigProvider locale={zh_CN}>
            <Router history={history}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        {routeConfig}
                        {/* <ErrorBoundary>
                            <Redirect from="/*" to="/index" />
                            <Route path="/index" exact component={Index} />
                        </ErrorBoundary> */}
                    </Switch>
                </Suspense>
            </Router>
        </ConfigProvider>
    );
};

ReactDOM.render(<APP />, document.getElementById('root'));
