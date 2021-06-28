import { observable, action } from "mobx";
export default class DetailStore {
  @observable count = 1;

  @action
  add() {
    this.count++;
  }
}
