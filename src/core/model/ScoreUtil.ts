import ClearRank from "./ClearRank"

export default class ScoreUtil {
  static calcRating(level: number, score: number) {
    let clearRank = ClearRank.fromScore(score);
    let [rating, base, addition] = [0.0, 0.0, 0.0];
    switch (clearRank)
    {
      case ClearRank.SSS:
        base = level + 2.0;
        break;
      case ClearRank.SS_PLUS:
        base = level + 1.5;
        addition = (score - ClearRank.SS_PLUS.border) / (ClearRank.MAX.border - ClearRank.SS_PLUS.border);
        break;
      case ClearRank.SS:
        base = level + 1.0;
        addition = (score - ClearRank.SS.border) / (ClearRank.MAX.border - ClearRank.SS.border);
        break;
      case ClearRank.S:
        base = level;
        addition = (score - ClearRank.S.border) / (ClearRank.SS.border - ClearRank.S.border);
        break;
      case ClearRank.AAA:
      case ClearRank.AA:
        if (level > 3.0)
        {
          base = level - 3.0;
          addition = 3.0 * (score - ClearRank.AA.border) / (ClearRank.S.border - ClearRank.AA.border);
        }
        else
        {
          addition = level * (score - ClearRank.AA.border) / (ClearRank.S.border - ClearRank.AA.border);
        }
        break;
      case ClearRank.A:
        if (level > 5.0)
        {
          base = level - 5.0;
          addition = 2.0 * (score - ClearRank.A.border) / (ClearRank.AA.border - ClearRank.A.border);
        }
        else
        {
          addition = (level - 3.0) * (score - ClearRank.A.border) / (ClearRank.AA.border - ClearRank.A.border);
        }
        break;
      case ClearRank.BBB:
        base = (level - 5.0) / 2.0;
        addition = (level - 5.0) * (score - ClearRank.BBB.border) / (ClearRank.A.border - ClearRank.BBB.border) / 2.0;
        break;
      case ClearRank.BB:
      case ClearRank.B:
      case ClearRank.C:
        addition = (level - 5.0) * (score - ClearRank.C.border) / (ClearRank.BBB.border - ClearRank.C.border) / 2.0;
        break;
    }
    rating = base + addition;
    if (rating < 0.0) rating = 0.0;
    return rating;
  }
}