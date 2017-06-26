import * as Vue from "vue"
import Tune from "./Tune"
import Difficulty from "./Difficulty"
import ScoreDetail from "./ScoreDetail"
import FullComboState from "./FullComboState"
import UserTuneDetail from "./UserTuneDetail"
import MasterData from "./MasterData"
import ObservableMap from "../common/ObservableMap"

export default class UserTuneDetailMap extends ObservableMap<string, UserTuneDetail> {
  static RATING_BEST_COUNT = 30;
  static RATING_RECENT_COUNT = 10;

  // private map: Map<Tune, UserTuneDetail>
  // values: UserTuneDetail[]

  // constructor() {
  //   this.map = new Map<Tune, UserTuneDetail>();
  //   this.values = [];
  // }

  // set(userTuneDetail: UserTuneDetail, apply: boolean = true) {
  //   this.map.set(userTuneDetail.tune, userTuneDetail);
  //   if (apply) this.apply();
  // }

  setAll(userTuneDetails: UserTuneDetail[]) {
    for (let userTuneDetail of userTuneDetails)
    {
      this.set(userTuneDetail.tune.id, userTuneDetail);
    }
  }

  // clear(apply: boolean = true) {
  //   this.map.clear();
  //   this.apply();
  // }

  // private apply() {
  //   // this.values = this.toArray();
  //   Vue.set(this, "values", this.toArray());
  // }

  // toArray() {
  //   return Array.from(this.map.values());
  // }

  // {
  //   musicId: {
  //     difficultyId: [score, fullComboStateId, playCount, lastPlayed]
  //   }
  // }
  toJSON() {
    let jsonObj = {};
    for (let userTuneDetail of this.values)
    {
      let musicId = userTuneDetail.music.id;
      let difficultyId = userTuneDetail.tune.difficulty.id;
      let score = userTuneDetail.score;
      let fullComboStateId = userTuneDetail.fullComboState.id;
      let playCount = userTuneDetail.playCount;
      let lastPlayed = userTuneDetail.lastPlayed && userTuneDetail.lastPlayed.toISOString();

      if (!jsonObj[musicId]) jsonObj[musicId] = {};
      let data: any[] = [score, fullComboStateId];
      if (playCount && lastPlayed)
      {
        data.push(playCount);
        data.push(lastPlayed);
      }
      jsonObj[musicId][difficultyId] = data;

      let music = MasterData.getMusic(musicId);
      // if (music.isNewData)
      // {
      //   // TODO: ここは別領域に保存するようにする（MasterDataもtoJSONfromJSONする）
      //   if (!jsonObj["musicNameMap"]) jsonObj["musicNameMap"] = {};
      //   jsonObj["musicNameMap"][musicId] = music.name;
      // }
    }

    return jsonObj;
  }

  loadFromJSON(jsonObj: any) {
    this.clear();

    for (let musicIdStr in jsonObj)
    {
      let musicId = parseInt(musicIdStr);
      let musicData = jsonObj[musicId];
      for (let difficultyIdStr in musicData)
      {
        let scoreData = musicData[difficultyIdStr];
        let score = scoreData[0];
        let fullComboStateId = scoreData[1];
        let playCount = scoreData[2];
        let lastPlayed = scoreData[3] && new Date(scoreData[3]);
        let fullComboState = FullComboState.find(fullComboStateId);
        let scoreDetail = new ScoreDetail({
          score: score,
          fullComboState: fullComboState
        });

        let difficultyId = parseInt(difficultyIdStr);
        let difficulty = Difficulty.find(difficultyId);
        let tune = MasterData.getTune(musicId, difficulty);

        let userTuneDetail = new UserTuneDetail({
          tune: tune,
          scoreDetail: scoreDetail,
          playCount: playCount,
          lastPlayed: lastPlayed
        });
        this.set(userTuneDetail.tune.id, userTuneDetail);
      }
    }
  }
}
