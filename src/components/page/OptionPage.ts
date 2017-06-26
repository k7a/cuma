import * as Vue from 'vue'
import VueComponent from 'vue-class-component'
import User from "../../core/model/User"
import MasterData from "../../core/model/MasterData"
import DataFetcher from "../../core/utils/DataFetcher"

@VueComponent({
    template: require("./OptionPage.html")
})
export default class {
  loadScoreFromStorage() {
    User.loadFromStorage();
  }

  fetchScore() {
    return User.fetchAllUserTuneDetailMap();
  }

  fetchMusicMaster() {
    return DataFetcher.fetchMusicMasterFromChuniNet();
  }
}