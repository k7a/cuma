import ClearRank from "../../core/model/ClearRank"
import Difficulty from "../../core/model/Difficulty"
import Level from "../../core/model/Level"
import FullComboState from "../../core/model/FullComboState"

export class UserTuneDetailListDisplayCondition {
  sortType: UserTuneDetailListDisplayCondition.SortType;
  orderType: UserTuneDetailListDisplayCondition.OrderType;
  filterConditions: {
    levelMin: number,
    levelMax: number,
    scoreMin: number,
    scoreMax: number,
    difficulty: {
      [x: number]: boolean
      },
    fullComboState: {
      [x: number]: boolean
    },
  };

  constructor() {
    this.reset();
  }

  reset() {
    this.sortType = "rating";
    this.orderType = UserTuneDetailListDisplayCondition.OrderType.DESC;
    this.filterConditions = {
      difficulty: {
        [Difficulty.BASIC.id]: true,
        [Difficulty.ADVANCED.id]: true,
        [Difficulty.EXPERT.id]: true,
        [Difficulty.MASTER.id]: true,
      },
      fullComboState: {
        [FullComboState.NONE.id]: true,
        [FullComboState.FULL_COMBO.id]: true,
        [FullComboState.ALL_JUSTICE.id]: true,
        [FullComboState.ALL_JUSTICE_CRITICAL.id]: true,
      },
      levelMin: 1,
      levelMax: 13.9,
      scoreMin: 0,
      scoreMax: ClearRank.MAX.border,
    }
  }

  static copy(target: any, source: any) {
    for (let key of Object.keys(source))
    {
      let obj = source[key];
      if (typeof obj === "object")
      {
        UserTuneDetailListDisplayCondition.copy(target[key], obj);
      }
      else target[key] = obj;
    }
  }

  apply(condition: UserTuneDetailListDisplayCondition) {
    UserTuneDetailListDisplayCondition.copy(this, condition);
  }

  changeOrder(sortType: UserTuneDetailListDisplayCondition.SortType) {
    if (sortType && this.sortType != sortType) this.sortType = sortType;
    else this.orderType = this.orderType * -1;
  }

  decrementLevelMin() {
    let oldLevel = this.filterConditions.levelMin;
    let nextLevel = Level.All.reverse().find(l => l.border < oldLevel);
    if (!nextLevel || nextLevel.border > this.filterConditions.levelMax) return;
    this.filterConditions.levelMin = nextLevel.border;
  }

  incrementLevelMin() {
    let oldLevel = this.filterConditions.levelMin;
    let nextLevel = Level.All.find(l => l.border > oldLevel);
    let newLevel = nextLevel ? nextLevel.border : Level.MAX;
    if (newLevel > this.filterConditions.levelMax) return;
    this.filterConditions.levelMin = newLevel;
  }

  decrementLevelMax() {
    let oldLevel = this.filterConditions.levelMax;
    let nextLevel = Level.All.reverse().find(l => (l.border * 10 - 1) / 10 < oldLevel);
    let newLevel = (nextLevel.border * 10 - 1) / 10;
    if (!nextLevel || newLevel < this.filterConditions.levelMin) return;
    this.filterConditions.levelMax = newLevel;
  }

  incrementLevelMax() {
    let oldLevel = this.filterConditions.levelMax;
    let nextLevel = Level.All.find(l => (l.border * 10 - 1) / 10 > oldLevel);
    let newLevel = nextLevel ? (nextLevel.border * 10 - 1) / 10 : Level.MAX;
    if (newLevel < this.filterConditions.levelMin) return;
    this.filterConditions.levelMax = newLevel;
  }

  decrementScoreMin() {
    let oldScore = this.filterConditions.scoreMin;
    let nextClearRank = ClearRank.All.reverse().find(c => c.border < oldScore);
    if (!nextClearRank || nextClearRank.border > this.filterConditions.scoreMax) return;
    this.filterConditions.scoreMin = nextClearRank.border;
  }

  incrementScoreMin() {
    let oldScore = this.filterConditions.scoreMin;
    let nextClearRank = ClearRank.All.find(c => c.border > oldScore);
    if (!nextClearRank || nextClearRank.border > this.filterConditions.scoreMax) return;
    this.filterConditions.scoreMin = nextClearRank.border;
  }

  decrementScoreMax() {
    let oldScore = this.filterConditions.scoreMax;
    let nextClearRank = ClearRank.All.reverse().find(c => (c.border -  1) < oldScore);
    let newScore = nextClearRank ? (nextClearRank.border - 1) : ClearRank.MAX.border;
    if (newScore < this.filterConditions.scoreMin) return;
    this.filterConditions.scoreMax = newScore;
  }

  incrementScoreMax() {
    let oldScore = this.filterConditions.scoreMax;
    let nextClearRank = ClearRank.All.find(c => (c.border -  1) > oldScore);
    let newScore = nextClearRank ? (nextClearRank.border - 1) : ClearRank.MAX.border;
    if (newScore < this.filterConditions.scoreMin) return;
    this.filterConditions.scoreMax = newScore;
  }
}

export namespace UserTuneDetailListDisplayCondition {
  export enum OrderType {
    ASC = 1,
    DESC = -1
  }
  export type SortType = "musicName" | "internalLevel" | "score" | "fullComboState" | "rating";
}