import * as Vue from "vue"
import VueComponent from 'vue-class-component'
import User from "../../core/model/User"
import UserTuneDetailMap from "../../core/model/UserTuneDetailMap"
import UserTuneDetail from "../../core/model/UserTuneDetail"
import ClearRank from "../../core/model/ClearRank"
import Difficulty from "../../core/model/Difficulty"
import Level from "../../core/model/Level"
import FullComboState from "../../core/model/FullComboState"
import { UserTuneDetailListDisplayCondition } from "./UserTuneDetailListDisplayCondition"

@VueComponent({})
class DataStore extends Vue {
  userTuneDetailMap: UserTuneDetailMap
  userTuneDetailListDisplayCondition: UserTuneDetailListDisplayCondition

  data() {
    return {
      userTuneDetailMap: this.userTuneDetailMap,
      userTuneDetailListDisplayCondition: this.userTuneDetailListDisplayCondition
    }
  }

  created() {
    this.userTuneDetailMap = User.userTuneDetailMap;
    this.userTuneDetailListDisplayCondition = new UserTuneDetailListDisplayCondition();
  }

  get userTuneDetails() {
    return this.userTuneDetailMap.values;
  }

  get sortByRatingUserTuneDetails() {
    return  this.userTuneDetails
                .sort((a, b) => a.rating < b.rating ? 1 : -1);
  }

  get bestUserTuneDetails() {
    return  this.sortByRatingUserTuneDetails
                .slice(0, UserTuneDetailMap.RATING_BEST_COUNT);
  }

  get proposedBestUserTuneDetails() {
    let bestUserTuneDetails = this.bestUserTuneDetails;
    if (bestUserTuneDetails.length === 0) return [];

    let borderRating = bestUserTuneDetails[bestUserTuneDetails.length-1].rating;
    return  this.sortByRatingUserTuneDetails
                .slice(UserTuneDetailMap.RATING_BEST_COUNT)
                .filter(userTuneDetail => {
                  if (userTuneDetail.clearRank == ClearRank.SSS) return false;
                  if (userTuneDetail.tune.internalLevel + 2 <= borderRating) return false;
                  return true;
                });
  }
  
  get bestRating() {
    if (this.bestUserTuneDetails.length === 0) return undefined;
    return this.bestUserTuneDetails[0].rating;
  }

  get bestSum() {
    let bestUserTuneDetails = this.bestUserTuneDetails;
    if (bestUserTuneDetails.length === 0) return undefined;
    let bestRatings = bestUserTuneDetails.map(i => i.rating);
    return bestRatings.reduce((a, b) => (a + b));
  }

  get bestAverage() {
    if (this.bestSum === undefined) return undefined;
    return this.bestSum / UserTuneDetailMap.RATING_BEST_COUNT;
  }

  get reachableRating() {
    let bestUserTuneDetails = this.bestUserTuneDetails;
    if (bestUserTuneDetails.length === 0) return undefined;
    let bestRatings = bestUserTuneDetails.map(i => i.rating);
    let bestRating = bestRatings[0];
    return (bestRatings.reduce((a, b) => (a + b)) / (UserTuneDetailMap.RATING_BEST_COUNT + UserTuneDetailMap.RATING_RECENT_COUNT) + (bestRating / 4.0));
  }

  changeUserTuneDetailListDisplayCondition(condition: UserTuneDetailListDisplayCondition) {
    this.userTuneDetailListDisplayCondition.apply(condition);
  }
}

export default new DataStore();