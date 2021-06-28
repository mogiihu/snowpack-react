import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Index from './pages/index';
import Detail from './pages/detail';
import TodoView from './pages/todoView';
import stores from './mobx/rootStore';
import './index.less';

function App() {
    const [count, setCount] = useState(0);

    return (
        <Provider {...stores}>
            <div className="index">
                <BrowserRouter>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">index</Link>
                            </li>
                            <li>
                                <Link to="/detail">detail</Link>
                            </li>
                            <li>
                                <Link to="/todo">todo</Link>
                            </li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/detail" component={Detail} />
                        <Route exact path="/todo" component={TodoView} />
                    </Switch>
                </BrowserRouter>
            </div>
        </Provider>
    );
}
export default App;
