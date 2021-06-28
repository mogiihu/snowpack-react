import DetailStore from "./detailStore";

class RootStore {
  constructor() {}
  detailStore = new DetailStore();
}
export default new RootStore();
