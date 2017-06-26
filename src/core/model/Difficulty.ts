export default class Difficulty {
  id: number;
  name: string;
  shortName: string;

  private static Map = new Map<number, Difficulty>();

  static get All() { return Array.from(Difficulty.Map).map(([key, value]) => value); }

  static BASIC = new Difficulty({id: 0, name: "BASIC"});
  static ADVANCED = new Difficulty({id: 1, name: "ADVANCED"});
  static EXPERT = new Difficulty({id: 2, name: "EXPERT"});
  static MASTER = new Difficulty({id: 3, name: "MASTER"});

  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;
    this.shortName = this.name.slice(0, 3);

    Difficulty.Map.set(this.id, this);
  }

  static find(id: number) {
    return Difficulty.Map.get(id);
  }
}