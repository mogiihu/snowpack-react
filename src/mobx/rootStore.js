import DetailStore from "./detailStore";

class RootStore {
  constructor() {
    this.detailStore = new DetailStore();
  }
}
export default new RootStore();
