import * as Vue from "vue"
import VueComponent from "vue-class-component"
import UserTuneDetail from "../../core/model/UserTuneDetail"
import DifficultyLabel from "./DifficultyLabel"
import FullComboStateLabel from "./FullComboStateLabel"
import ClearRankLabel from "./ClearRankLabel"
import LevelLabel from "./LevelLabel"

@VueComponent({
    template: require("./UserTuneDetailListItem.html"),
    props: {
      userTuneDetail: UserTuneDetail,
      index: Number,
      showInternalLevel: Boolean,
      showRatingDiff: Boolean,
    },
    components: {
      DifficultyLabel,
      FullComboStateLabel,
      ClearRankLabel,
      LevelLabel,
    }
})
export default class UserTuneDetailListItem extends Vue {
  userTuneDetail: UserTuneDetail
  index: number
}