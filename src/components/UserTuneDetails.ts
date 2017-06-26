// import VueComponent from 'vue-class-component'
// import User from "../core/model/User"
// import UserTuneDetailMap from "../core/model/UserTuneDetailMap"
// import UserTuneDetail from "../core/model/UserTuneDetail"
// import ClearRank from "../core/model/ClearRank"
// import Difficulty from "../core/model/Difficulty"
// import Level from "../core/model/Level"
// import FullComboState from "../core/model/FullComboState"
// import UserTuneDetailsToolBar from "./UserTuneDetailsToolBar"
// import DifficultyLabel from "./DifficultyLabel"
// import FullComboStateLabel from "./FullComboStateLabel"
// import MasterData from "../core/model/MasterData"
// import DataStore from "./common/DataStore"

// enum OrderType {
//   ASC = 1,
//   DESC = -1
// }

// type SortType = "musicName" | "internalLevel" | "score" | "fullComboState" | "rating";

// @VueComponent({
//     template: require("./UserTuneDetails.html"),
//     components: {
//       UserTuneDetailsToolBar,
//       DifficultyLabel,
//       FullComboStateLabel
//     }
// })
// export default class {
//   requestQueue: any;
//   sortType: SortType;
//   orderType: OrderType;
//   filterConditions: any;
//   rightSideBar: boolean;

//   data() {
//     return {
//       requestQueue: null,
//       sortType: this.sortType,
//       orderType: this.orderType,
//       filterConditions: this.filterConditions,
//       rightSideBar: this.rightSideBar
//     };
//   }

//   created() {
//     this.sortType = "rating";
//     this.orderType = OrderType.ASC;
//     this.filterConditions = {
//       difficulty: Difficulty.All.reduce((map, difficulty) => {
//                     map[difficulty.id] = true;
//                     return map;
//                   }, {}),
//       fullComboState: {
//         [FullComboState.NONE.id]: true,
//         [FullComboState.FULL_COMBO.id]: true,
//         [FullComboState.ALL_JUSTICE.id]: true,
//         [FullComboState.ALL_JUSTICE_CRITICAL.id]: true,
//       },
//       levelMin: 1,
//       levelMax: 13.9,
//       scoreMin: 0,
//       scoreMax: ClearRank.MAX.border,
//     };
//     this.rightSideBar = false;
//   }

//   get sortedUserTuneDetails() {
//     let sortType = this.sortType;
//     let orderType = this.orderType;
//     return  DataStore.userTuneDetails
//                 .sort((a, b) => {
//                   let x: any, y: any;
//                   [x, y] = [a[sortType], b[sortType]];
//                   switch (sortType)
//                   {
//                     case "musicName":
//                       [x, y] = [x || "-", y || "-"];
//                       return x.localeCompare(y) * orderType;
//                     case "fullComboState":
//                       [x, y] = [x.id || 0, y.id || 0];                      
//                     default:
//                       [x, y] = [x || 0, y || 0];
//                       return (x > y ? 1 : -1) * orderType;
//                   }
//                 });
//   }

//   get sortAndFilteredUserTuneDetails() {
//     let filterConditions = this.filterConditions;
//     return  this.sortedUserTuneDetails
//                 .filter((userTuneDetail) => {
//                   if (
//                     !filterConditions.difficulty[userTuneDetail.tune.difficulty.id] ||
//                     !filterConditions.fullComboState[userTuneDetail.fullComboState.id] ||
//                     userTuneDetail.internalLevel < filterConditions.levelMin ||
//                     userTuneDetail.internalLevel > filterConditions.levelMax ||
//                     userTuneDetail.score < filterConditions.scoreMin ||
//                     userTuneDetail.score > filterConditions.scoreMax
//                   ) return false;

//                   return true;
//                 });
//   }

//   changeOrder(sortType: SortType) {
//     if (sortType && this.sortType != sortType) this.sortType = sortType;
//     else this.orderType = this.orderType * -1;
//   }

//   decrementLevelMin() {
//     let oldLevel = this.filterConditions.levelMin;
//     let nextLevel = Level.All.reverse().find(l => l.border < oldLevel);
//     if (!nextLevel || nextLevel.border > this.filterConditions.levelMax) return;
//     this.filterConditions.levelMin = nextLevel.border;
//   }

//   incrementLevelMin() {
//     let oldLevel = this.filterConditions.levelMin;
//     let nextLevel = Level.All.find(l => l.border > oldLevel);
//     let newLevel = nextLevel ? nextLevel.border : Level.MAX;
//     if (newLevel > this.filterConditions.levelMax) return;
//     this.filterConditions.levelMin = newLevel;
//   }

//   decrementLevelMax() {
//     let oldLevel = this.filterConditions.levelMax;
//     let nextLevel = Level.All.reverse().find(l => (l.border - 0.1) < oldLevel);
//     let newLevel = nextLevel.border - 0.1;
//     if (!nextLevel || newLevel < this.filterConditions.levelMin) return;
//     this.filterConditions.levelMax = newLevel;
//   }

//   incrementLevelMax() {
//     let oldLevel = this.filterConditions.levelMax;
//     let nextLevel = Level.All.find(l => (l.border - 0.1) > oldLevel);
//     let newLevel = nextLevel ? (nextLevel.border - 0.1) : Level.MAX;
//     if (newLevel < this.filterConditions.levelMin) return;
//     this.filterConditions.levelMax = newLevel;
//   }

//   decrementScoreMin() {
//     let oldScore = this.filterConditions.scoreMin;
//     let nextClearRank = ClearRank.All.reverse().find(c => c.border < oldScore);
//     if (!nextClearRank || nextClearRank.border > this.filterConditions.scoreMax) return;
//     this.filterConditions.scoreMin = nextClearRank.border;
//   }

//   incrementScoreMin() {
//     let oldScore = this.filterConditions.scoreMin;
//     let nextClearRank = ClearRank.All.find(c => c.border > oldScore);
//     if (!nextClearRank || nextClearRank.border > this.filterConditions.scoreMax) return;
//     this.filterConditions.scoreMin = nextClearRank.border;
//   }

//   decrementScoreMax() {
//     let oldScore = this.filterConditions.scoreMax;
//     let nextClearRank = ClearRank.All.reverse().find(c => (c.border -  1) < oldScore);
//     let newScore = nextClearRank ? (nextClearRank.border - 1) : ClearRank.MAX.border;
//     if (newScore < this.filterConditions.scoreMin) return;
//     this.filterConditions.scoreMax = newScore;
//   }

//   incrementScoreMax() {
//     let oldScore = this.filterConditions.scoreMax;
//     let nextClearRank = ClearRank.All.find(c => (c.border -  1) > oldScore);
//     let newScore = nextClearRank ? (nextClearRank.border - 1) : ClearRank.MAX.border;
//     if (newScore < this.filterConditions.scoreMin) return;
//     this.filterConditions.scoreMax = newScore;
//   }

//   fetch() {
//     User.fetchAllUserTuneDetailMap();
//   }

//   saveMasterData() {
//     MasterData.saveToStorage();
//   }

//   loadMasterData() {
//     MasterData.loadFromStorage();
//   }
// }