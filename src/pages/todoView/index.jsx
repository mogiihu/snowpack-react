import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject("detailStore")
@observer
class TodoView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      detailStore: { count, data },
    } = this.props;
    console.log(this.props);
    return (
      <div>
        <button
          onClick={() => {
            this.props.detailStore.add();
          }}
        >
          +
        </button>
        {count}
        {data.a}
      </div>
    );
  }
}
export default TodoView;
