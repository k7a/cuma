import VueComponent from 'vue-class-component'
import User from "../../core/model/User"
import UserTuneDetailMap from "../../core/model/UserTuneDetailMap"
import UserTuneDetail from "../../core/model/UserTuneDetail"
import ClearRank from "../../core/model/ClearRank"
import UserTuneDetailListItem from "../parts/UserTuneDetailListItem"
import DataStore from "../common/DataStore"

@VueComponent({
    template: require("./BestRatingPage.html"),
    components: {
      UserTuneDetailListItem
    }
})
export default class {
  dataStore: any;

  created() {
    this.dataStore = DataStore;
  }
}