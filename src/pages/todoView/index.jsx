import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject("detailStore")
@observer
class TodoView extends Component {
  render() {
    console.log(this.props);
    return <div>111111111111</div>;
  }
}
export default TodoView;
