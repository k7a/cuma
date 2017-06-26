import * as Vue from 'vue'
import VueComponent from 'vue-class-component'
import User from "../core/model/User"
import EventDispatcher from "./EventDispatcher"
import DropDownMenu from "./DropDownMenu"
import ApiButton from "./ApiButton"
import StorageManager from "../core/utils/StorageManager"

@VueComponent({
    template: require("./UserTuneDetailsToolBar.html"),
    components: {
      ApiButton,
      DropDownMenu
    }
})
export default class extends Vue {
  isCheck: boolean;

  data() {
    return {
      isCheck: this.isCheck
    }
  }

  created() {
    this.isCheck = false;
  }

  fetch() {
    return User.fetchAllUserTuneDetailMap();
  }

  save() {
    User.saveToStorage();
  }

  load() {
    User.loadFromStorage();
  }

  clear() {
    StorageManager.clear();
  }
}