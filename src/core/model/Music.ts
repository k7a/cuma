import Difficulty from "./Difficulty"
import Tune from "./Tune"
import Level from "./Level"
import ObservableMap from "../common/ObservableMap"

export default class Music {
  id: number;
  name: string;
  artist: string;
  tuneMap: ObservableMap<number, Tune>;
  date: Date;

  constructor(params: {id: number, name: string, artist?: string, date?: Date}) {
    this.id = params.id;
    this.name = params.name;
    this.artist = params.artist || undefined;
    this.date = params.date || undefined;
    this.tuneMap = new ObservableMap<number, Tune>();
  }

  get basic() {
    return this.getTune(Difficulty.BASIC);
  }

  get advanced() {
    return this.getTune(Difficulty.ADVANCED);
  }

  get expert() {
    return this.getTune(Difficulty.EXPERT);
  }

  get master() {
    return this.getTune(Difficulty.MASTER);
  }

  getTune(difficulty: Difficulty): Tune {
    let tune = this.tuneMap.get(difficulty.id);
    if (tune === undefined)
    {
      // tune = this.setTune({difficulty: difficulty});
      tune = Tune.dummy;
    }
    return tune;
  }

  findOrCreateTune(difficulty: Difficulty) {
    let tune = this.tuneMap.get(difficulty.id);

    if (tune === undefined)
    {
      tune = this.setTune({difficulty: difficulty});
    }
    return tune;
  }

  hasTune(difficulty: Difficulty) {
    return this.tuneMap.hasKey(difficulty.id);
  }

  setTune(params: {difficulty: Difficulty, level?: number, internalLevel?: number}) {
    let tune = new Tune(Object.assign({
      musicId: this.id
    }, params));
    this.tuneMap.set(tune.difficulty.id, tune);
    return tune;
  }
}