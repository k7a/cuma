import * as Vue from 'vue'
import VueComponent from 'vue-class-component'
import DataStore from "../common/DataStore"
import { UserTuneDetailListDisplayCondition } from "../common/UserTuneDetailListDisplayCondition"

@VueComponent({
  template: require("./UserTuneDetailListPageSideBar.html")
})
export default class extends Vue {
  displayCondition: UserTuneDetailListDisplayCondition

  data() {
    return {
      displayCondition: this.displayCondition,
    }
  }

  get changed() {
    return JSON.stringify(this.$data["displayCondition"]) != JSON.stringify(DataStore.$data["userTuneDetailListDisplayCondition"]);
  }

  created() {
    // this.displayCondition = DataStore.userTuneDetailListDisplayCondition;
    this.displayCondition = new UserTuneDetailListDisplayCondition();
  }

  reset() {
    this.displayCondition.reset();
    this.apply();
  }

  apply() {
    DataStore.changeUserTuneDetailListDisplayCondition(this.displayCondition);
  }
}