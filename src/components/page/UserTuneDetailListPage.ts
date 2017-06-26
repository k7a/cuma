import VueComponent from 'vue-class-component'
import User from "../../core/model/User"
import UserTuneDetail from "../../core/model/UserTuneDetail"
import MasterData from "../../core/model/MasterData"
import UserTuneDetailListItem from "../parts/UserTuneDetailListItem"
import DataStore from "../common/DataStore"
import { UserTuneDetailListDisplayCondition } from "../common/UserTuneDetailListDisplayCondition"

@VueComponent({
    template: require("./UserTuneDetailListPage.html"),
    components: {
      UserTuneDetailListItem
    }
})
export default class {
  requestQueue: any;
  displayCondition: UserTuneDetailListDisplayCondition
  rightSideBar: boolean;

  data() {
    return {
      requestQueue: null,
      displayCondition: this.displayCondition,
      rightSideBar: this.rightSideBar
    };
  }

  created() {
    this.displayCondition = DataStore.userTuneDetailListDisplayCondition;
    this.rightSideBar = false;
  }

  get sortedUserTuneDetails() {
    let sortType = this.displayCondition.sortType;
    let orderType = this.displayCondition.orderType;
    return  DataStore.userTuneDetails
                .sort((a, b) => {
                  let x: any, y: any;
                  [x, y] = [a[sortType], b[sortType]];
                  switch (sortType)
                  {
                    case "musicName":
                      [x, y] = [x || "-", y || "-"];
                      return x.localeCompare(y) * orderType;
                    case "fullComboState":
                      [x, y] = [x.id || 0, y.id || 0];                      
                    default:
                      [x, y] = [x || 0, y || 0];
                      return (x > y ? 1 : -1) * orderType;
                  }
                });
  }

  get sortAndFilteredUserTuneDetails() {
    let filterConditions = this.displayCondition.filterConditions;
    return  this.sortedUserTuneDetails
                .filter((userTuneDetail) => {
                  if (
                    !filterConditions.difficulty[userTuneDetail.tune.difficulty.id] ||
                    !filterConditions.fullComboState[userTuneDetail.fullComboState.id] ||
                    userTuneDetail.internalLevel < filterConditions.levelMin ||
                    userTuneDetail.internalLevel > filterConditions.levelMax ||
                    userTuneDetail.score < filterConditions.scoreMin ||
                    userTuneDetail.score > filterConditions.scoreMax
                  ) return false;

                  return true;
                });
  }

  fetch() {
    User.fetchAllUserTuneDetailMap();
  }

  saveMasterData() {
    MasterData.saveToStorage();
  }

  loadMasterData() {
    MasterData.loadFromStorage();
  }
}