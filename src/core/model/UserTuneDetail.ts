import Tune from "./Tune"
import Difficulty from "./Difficulty"
import ScoreDetail from "./ScoreDetail"
import FullComboState from "./FullComboState"
import ClearRank from "./ClearRank"
import MasterData from "./MasterData"
import ScoreUtil from "./ScoreUtil"

export default class UserTuneDetail {
  tune: Tune;
  playCount: number;
  lastPlayed: Date;
  scoreDetail: ScoreDetail;
  private _rating: number;

  constructor(params: {tune: Tune, scoreDetail: ScoreDetail, playCount: number, lastPlayed: Date}) {
    this.tune = params.tune;
    this.playCount = params.playCount;
    this.lastPlayed = params.lastPlayed;
    this.scoreDetail = params.scoreDetail;
    this.tune.onChange.push(() => {
      this.calcRating();
    });
  }

  static fromUserMusicResponse(tune: Tune, userMusicResponse: any) {
    return new UserTuneDetail({
      tune: tune,
      playCount: userMusicResponse.playCount || undefined,
      lastPlayed: userMusicResponse.updateDate !== null ? new Date(userMusicResponse.updateDate) : undefined,
      scoreDetail: ScoreDetail.fromUserMusicResponse(userMusicResponse)
    });
  }

  get id() {
    return this.tune.id;
  }

  get music() {
    return this.tune.music;
  }

  get musicName() {
    return this.music.name;
  }
  
  get internalLevel() {
    return this.tune.internalLevel;
  }

  get score() {
    return this.scoreDetail.score;
  }

  get clearRank() {
    return this.scoreDetail.clearRank;
  }
  
  get isMaxRating() {
    return this.clearRank.id >= ClearRank.SSS.id;
  }

  get fullComboState() {
    return this.scoreDetail.fullComboState;
  }

  get rating() {
    if (this._rating === undefined)
    {
      this.calcRating();
    }
    return this._rating || 0;
  }

  get ratingDiff() {
    return (this.internalLevel + 2.0) - this.rating || undefined;
  }

  calcRating() {
    this._rating = ScoreUtil.calcRating(this.tune.internalLevel, this.score);
  }
  
  // static fromArray(data: UserTuneDetailArray) {
  //   let tune = MasterData.getTune(data[1], Difficulty.find(data[2]));
  //   let scoreDetail = new ScoreDetail({score: data[3], fullComboState: FullComboState.find(data[4])});
  //   return new UserTuneDetail({
  //     tune: tune,
  //     scoreDetail: scoreDetail
  //   });
  // }

  // toArray():UserTuneDetailArray {
  //   return [
  //     this.music.id,
  //     this.tune.difficulty.id,
  //     this.score,
  //     this.fullComboState.id
  //   ];
  // }
}

// type UserTuneDetailArray = [number, number, number, number];