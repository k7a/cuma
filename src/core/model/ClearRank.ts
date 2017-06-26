export default class ClearRank {
  id: number;
  name: string;
  border: number;

  static D        = new ClearRank({id: 0, name: "D", border: 0});
  static C        = new ClearRank({id: 1, name: "C", border: 500000});
  static B        = new ClearRank({id: 2, name: "B", border: 600000});
  static BB       = new ClearRank({id: 3, name: "BB", border: 700000});
  static BBB      = new ClearRank({id: 4, name: "BBB", border: 800000});
  static A        = new ClearRank({id: 5, name: "A", border: 900000});
  static AA       = new ClearRank({id: 6, name: "AA", border: 925000});
  static AAA      = new ClearRank({id: 7, name: "AAA", border: 950000});
  static S        = new ClearRank({id: 8, name: "S", border: 975000});
  static SS       = new ClearRank({id: 9, name: "SS", border: 1000000});
  static SS_PLUS  = new ClearRank({id: 10, name: "SS+", border: 1005000});
  static SSS      = new ClearRank({id: 11, name: "SSS", border: 1007500});
  static MAX      = new ClearRank({id: 12, name: "MAX", border: 1010000});

  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;
    this.border = params.border;
  }

  static fromScore(score: number) {
    for (let clearRank of ClearRank.All.reverse())
    {
      if (score >= clearRank.border) return clearRank;
    }
  }

  static get All() {
    return [
            ClearRank.D,
            ClearRank.C,
            ClearRank.B,
            ClearRank.BB,
            ClearRank.BBB,
            ClearRank.A,
            ClearRank.AA,
            ClearRank.AAA,
            ClearRank.S,
            ClearRank.SS,
            ClearRank.SSS,
            ClearRank.MAX,
           ];
  }
}