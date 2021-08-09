/*
 * 错误捕获组件
 * @Author: Jiang
 * @Date: 2019-06-12 15:21:19
 * @Last Modified by: Jiang
 * @Last Modified time: 2020-12-21 11:24:51
 */
import { Component } from 'react';
import { Result } from 'antd';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, info: '' };
    }

    static getDerivedStateFromError() {
        // 更新 state 使下一次渲染可以显示降级 UI
        return { hasError: true };
    }

    componentDidCatch(error) {
        this.setState({
            info: '错误信息：' + error
        });
    }

    back = () => {
        location = document.referrer;
    };

    render() {
        if (this.state.hasError) {
            return <Result status="500" title="JS报错啦" subTitle={this.state.info} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
