import {Component} from "react";
import {Result} from "antd";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, info: ""};
  }
  static getDerivedStateFromError() {
    return {hasError: true};
  }
  componentDidCatch(error) {
    this.setState({
      info: "错误信息：" + error
    });
  }
  back = () => {
    location = document.referrer;
  };
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ React.createElement(Result, {
        status: "500",
        title: "JS报错啦",
        subTitle: this.state.info
      });
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
