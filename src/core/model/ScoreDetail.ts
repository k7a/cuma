import FullComboState from "./FullComboState"
import ClearRank from "./ClearRank"

export default class ScoreDetail {
  fullComboState: FullComboState;
  score: number;
  
  get clearRank() {
    return ClearRank.fromScore(this.score);
  }

  constructor(params: {fullComboState: FullComboState, score: number}) {
    this.fullComboState = params.fullComboState;
    this.score = params.score;
  }

  static fromUserMusicResponse(userMusicResponse: any) {
    let scoreMax = userMusicResponse.scoreMax;
    let isFullCombo = userMusicResponse.isFullCombo;
    let isAllJustice = userMusicResponse.isAllJustice;
    return new ScoreDetail({
      score: userMusicResponse.scoreMax,
      fullComboState: FullComboState.getFullComboState(isFullCombo, isAllJustice, scoreMax)
    });
  }
}