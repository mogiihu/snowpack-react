import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Index from '@pages/home/index.jsx';
import Hello from '@pages/hello/index.jsx';
import Snowpack from '@pages/snowpack/index.jsx';
import 'antd/dist/antd.css';

function App() {
    return (
        <div className="index">
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route exact path="/hello" component={Hello} />
                    <Route exact path="/snowpack" component={Snowpack} />
                </Switch>
            </HashRouter>
        </div>
    );
}
export default App;
