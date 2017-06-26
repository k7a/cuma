import Difficulty from "./Difficulty"
import Level from "./Level"
import MasterData from "./MasterData"
import ScoreUtil from "./ScoreUtil"

export default class Tune {
  static dummy = new Tune({
    musicId: undefined,
    difficulty: undefined,
  });
  musicId: number;
  difficulty: Difficulty;
  onChange: Function[];
  private _id: string;
  private _level: number;
  private _internalLevel: number;
  private provisionalInternalLevel: number;

  get id() {
    if (this._id === undefined) this._id = `${this.musicId}-${this.difficulty.id}`;
    return this._id;
  }

  get music() {
    return MasterData.getMusic(this.musicId);
  }

  get level() {
    return this._level;
  }

  set level(value) {
    this._level = value;
  }

  get internalLevel(): number | undefined {
    if (this.level === undefined) return undefined;
    // 譜面定数が未定義の場合、そのレベル帯の最小値を用いる
    return this._internalLevel || this.provisionalInternalLevel || (this.provisionalInternalLevel = Level.fromNumber(this.level).border);
  }
  
  set internalLevel(value) {
    this._internalLevel = value;
    // 値の変更を通知
    if (this.onChange.length > 0)
    {
      for (let func of this.onChange)
      {
        func();
      }
    }
  }

  get rawInternalLevel() {
    return this._internalLevel;
  }

  get isProvisional() {
    return this._internalLevel === undefined;
  }

  constructor(params: {musicId: number, difficulty: Difficulty, level?: number, internalLevel?: number}) {
    this.onChange = [];
    this.musicId = params.musicId;
    this.difficulty = params.difficulty;
    this.level = params.level || undefined;
    this.internalLevel = params.internalLevel || undefined;
  }

  calcRating(score: number) {
    if (this.internalLevel === undefined) return undefined;
    return ScoreUtil.calcRating(this.internalLevel, score);
  }

  isDummy() {
    return this === Tune.dummy;
  }
}