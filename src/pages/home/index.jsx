import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '@assets/images/logo.svg';
import './index.css';

function Home() {
    const [count, setCount] = useState(0);
    const [current, setCurrent] = useState('mail');

    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), 1000);
        return () => clearTimeout(timer);
    }, [count, setCount]);

    return (
        <div className="App">
            <header className="App-header">
                <nav>
                    <ul>
                        <li>
                            <Link to="/hello">hello</Link>
                        </li>
                        <li>
                            <Link to="/snowpack">snowpack</Link>
                        </li>
                    </ul>
                </nav>
                <img src={logo} className="App-logo" alt="logo" />
                <h1>Hello snowpack!</h1>
                <p>
                    Page has been open for <code>{count}</code> seconds.
                </p>
            </header>
        </div>
    );
}

export default Home;
